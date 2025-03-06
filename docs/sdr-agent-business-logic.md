# SDR Agent Business Logic Implementation Guide

## Overview

This document provides a comprehensive overview of the SDR (Sales Development Representative) Agent business logic implementation in the DentalHub system. It explains how the campaign automation system works, how campaigns are structured, and how they interact with the frontend UI components.

## Core Components

The SDR agent system consists of the following core components:

### 1. Base Campaign Class

The foundation of all campaign types that provides common functionality:

```typescript
// src/ai/sdr/campaigns/base.campaign.ts
export class Campaign {
  name: string;
  automationEvents: AutomationEvent[];
  responseHandlers: ResponseHandler[];
  nextCampaign: CampaignType | null;
  config: CampaignConfig;
  officeName: string;

  constructor(config: CampaignConfig = { enabled: true }) {
    this.config = config;
    this.officeName = config.officeName?.toString() || "Bright Smile Dental";
    this.name = "Base Campaign";
    this.nextCampaign = null;
    this.automationEvents = [];
    this.responseHandlers = [];
  }
  
  processMessage(message: string): string {
    return message.replace(/{{OfficeName}}/g, this.officeName);
  }
}
```

### 2. Specialized Campaign Classes

Eight specialized campaign types that extend the base Campaign class, each with its own sequence of automation events and response handlers:

- **LeadGenerationCampaign**: For new leads who filled out a form or showed initial interest
- **NoResponseCampaign**: For leads who didn't respond to the initial outreach
- **NoShowCampaign**: For leads who booked but didn't show up for their appointment
- **ReEngagementCampaign**: For leads who haven't engaged in a while
- **ListValidationCampaign**: For validating contact information from cold lists
- **ColdOfferCampaign**: For prospects from cold lists who have been validated
- **PowerHourCampaign**: For intense follow-up with selected holding prospects
- **HoldingCampaign**: Simple storage campaign for inactive prospects

Each campaign implements specific automation sequences and response handling logic tailored to its purpose.

### 3. Campaign Manager

Orchestrates all campaigns and manages prospect movement between them:

```typescript
// src/ai/sdr/campaign-manager.ts
export class CampaignManager {
  private campaigns: Record<string, Campaign>;
  private prospects: Map<string, ProspectRecord>;
  private appointments: Map<string, Appointment>;
  
  constructor(config: CampaignConfig = {}) {
    // Initialize all campaign types with the provided config
    this.campaigns = {
      leadGeneration: new LeadGenerationCampaign(config),
      noResponse: new NoResponseCampaign(config),
      noShow: new NoShowCampaign(config),
      reEngagement: new ReEngagementCampaign(config),
      listValidation: new ListValidationCampaign(config),
      coldOffer: new ColdOfferCampaign(config),
      powerHour: new PowerHourCampaign(config),
      holding: new HoldingCampaign(config)
    };
    
    this.prospects = new Map();
    this.appointments = new Map();
  }
  
  // Methods for managing prospects and campaigns
  addProspect(prospect: Prospect, campaignName: string): boolean;
  processResponse(prospectId: string, message: string): ResponseResult | null;
  sendNextEvent(prospectId: string): boolean;
  moveToNextCampaign(prospectId: string, nextCampaignName: string): boolean;
  bookAppointment(prospectId: string, message: string): Appointment | false;
  activatePowerHour(count: number): number;
  checkNoShows(): number;
}
```

### 4. SDR Agent

Facade that provides a simplified API for the rest of the application to interact with the campaign system.

## Business Logic Implementation

### Campaign Configuration

Each campaign is initialized with a configuration object that can customize its behavior:

```typescript
interface CampaignConfig {
  enabled?: boolean;     // Whether the campaign is active
  officeName?: string;   // Dental office name for personalization
  [key: string]: any;    // Additional custom configuration
}
```

By default, all campaigns are enabled. This is set in the constructor for each campaign class:

```typescript
constructor(config: CampaignConfig = { enabled: true }) {
  super(config);
  // Campaign-specific initialization
}
```

### Automation Events

Campaigns define a sequence of communication events to be executed in order:

```typescript
interface AutomationEvent {
  type: "sms" | "email" | "ai_voice_call" | "voicemail_drop";
  name: string;
  timing: string;
  message: string;
  subject?: string; // For email events
}
```

For example, the Lead Generation campaign includes these events:

```typescript
this.automationEvents = [
  {
    type: "sms",
    name: "Thank You",
    timing: "send_after_opt_in",
    message: "Hey {{FirstName}}, this is {{AssigneeFirstName}} with {{OfficeName}}. I thought following up by text might be easier for you. Thanks for filling out our form for Enhanced Dental PPO Coverage! 😊"
  },
  {
    type: "email",
    name: "Covering My Bases",
    timing: "send_5_min_after_opt_in",
    subject: "{{FirstName}}, Thanks for your inquiry",
    message: "Hey {{FirstName}}, this is {{AssigneeFullName}} with {{OfficeName}}. I wanted to cover all my communication bases with you today. I hope you don't mind.\n\nThanks for your interest in our Enhanced Dental PPO Coverage. Would tomorrow at 2pm, 3pm, or 4pm work for a quick call to discuss how this could benefit you?"
  },
  // More events...
]
```

### Response Handlers

Each campaign defines handlers for processing prospect responses:

```typescript
interface ResponseHandler {
  keywords: string[];
  action: "offer_times" | "book_appointment" | "move_campaign" | "mark_invalid" | "default_reply";
  reply: string;
  targetCampaign?: string; // For move_campaign action
}
```

For example, the Cold Offer campaign includes these handlers:

```typescript
this.responseHandlers = [
  {
    keywords: ["yes", "interested", "tell me more", "information", "savings", "spots", "available"],
    action: "offer_times",
    reply: "Great! Would tomorrow at 2pm, 3pm, or 4pm work for a quick call to discuss our Enhanced Dental PPO program and how it can save you money?"
  },
  {
    keywords: ["2pm", "3pm", "4pm", "tomorrow", "time works"],
    action: "book_appointment",
    reply: "Perfect! You're all set for a call on {{AppointmentDate}} at {{AppointmentTime}}. I'll give you a call then to discuss our Enhanced Dental PPO program. If anything comes up before then, feel free to reach out!"
  },
  {
    keywords: ["no", "not interested", "stop", "unsubscribe"],
    action: "move_campaign",
    targetCampaign: "holding",
    reply: "I understand. If you change your mind about saving on your dental care, feel free to reach out anytime!"
  }
]
```

## Business Logic Flow

### 1. Adding a Prospect

When a new prospect is added to the system:

1. The UI calls `sdrAgent.addProspect(prospect, campaignName)`
2. The SDR Agent forwards this to the Campaign Manager
3. Campaign Manager:
   - Validates the campaign exists
   - Creates a new prospect record with the specified campaign and stage 0
   - Triggers the first automation event in the campaign sequence

```typescript
// Example flow
function handleNewLeadSubmission(formData) {
  const prospect = {
    id: generateUniqueId(),
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    source: 'website_form'
  };
  
  // Determine appropriate starting campaign based on lead source
  let startingCampaign = 'leadGeneration';
  if (formData.source === 'cold_list') {
    startingCampaign = 'listValidation';
  }
  
  // Add to the system
  sdrAgent.addProspect(prospect, startingCampaign);
}
```

### 2. Processing Responses

When a prospect responds to a message:

1. The UI calls `sdrAgent.processIncomingMessage(prospectId, message)`
2. The SDR Agent forwards this to the Campaign Manager
3. Campaign Manager:
   - Retrieves the prospect's current campaign
   - Matches the message against the campaign's response handlers
   - Executes the matched handler's action
   - Returns a personalized reply
4. The SDR Agent sends the reply to the prospect

```typescript
// Example flow
async function handleIncomingMessage(prospectId, messageText) {
  // Process the response
  const result = await sdrAgent.processIncomingMessage(prospectId, messageText);
  
  // Update UI with the result
  if (result.action === 'book_appointment') {
    showAppointmentConfirmation(result.appointment);
  } else if (result.action === 'move_campaign') {
    updateProspectStatus(prospectId, result.targetCampaign);
  }
}
```

### 3. Campaign Progression

Prospects move through campaigns as follows:

1. Automation events are sent in sequence based on timing rules
2. When a prospect completes all events in a campaign, they move to the next campaign
3. Response handlers can override this flow and move prospects to specific campaigns
4. Special operations like Power Hour can move prospects between campaigns

```typescript
// Automatic campaign progression
function checkDailyCampaignProgress() {
  // Check for prospects who have completed their current campaign
  const completedProspects = sdrAgent.getProspectsWithCompletedCampaigns();
  
  for (const prospectId of completedProspects) {
    // Move to the next campaign defined in the campaign's nextCampaign property
    sdrAgent.progressToNextCampaign(prospectId);
  }
  
  // Check for no-shows
  sdrAgent.checkNoShows();
}
```

### 4. Appointment Booking

When a prospect agrees to an appointment:

1. A response handler triggers the `book_appointment` action
2. Campaign Manager extracts time information from the message
3. An appointment record is created and linked to the prospect
4. Reminders are scheduled for the appointment
5. The prospect may be moved to a different campaign based on the outcome

```typescript
// Example of appointment booking logic in Campaign Manager
bookAppointment(prospectId: string, message: string): Appointment | false {
  const prospectRecord = this.prospects.get(prospectId);
  if (!prospectRecord) return false;
  
  // Extract time from message (basic implementation)
  let time = "3:00 PM"; // Default time
  if (message.includes("2pm") || message.includes("2 pm")) {
    time = "2:00 PM";
  } else if (message.includes("4pm") || message.includes("4 pm")) {
    time = "4:00 PM";
  }
  
  // Set date to tomorrow
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const date = tomorrow.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  
  // Create appointment
  const appointment = {
    id: `apt_${Date.now()}`,
    prospectId: prospectId,
    date: date,
    time: time,
    status: 'scheduled',
    service: 'Enhanced Dental PPO Coverage Consultation'
  };
  
  // Save appointment and update prospect record
  this.appointments.set(appointment.id, appointment);
  prospectRecord.data.appointment = appointment;
  prospectRecord.tags.add('appointment_scheduled');
  this.prospects.set(prospectId, prospectRecord);
  
  // Schedule reminders
  this.sendAppointmentReminders(prospectId, appointment);
  
  return appointment;
}
```

## Message Personalization

Messages are personalized using template variables:

1. The base Campaign class provides the `processMessage()` method
2. The Campaign Manager extends this with additional personalization:
   - Prospect information (name, contact details)
   - Appointment details if applicable
   - Time suggestions for scheduling

```typescript
personalizeMessage(message: string, prospect: Prospect): string {
  // Replace placeholders with prospect data
  let personalizedMessage = message;
  
  // Basic replacements
  personalizedMessage = personalizedMessage.replace(/{{FirstName}}/g, prospect.firstName || "there");
  personalizedMessage = personalizedMessage.replace(/{{LastName}}/g, prospect.lastName || "");
  personalizedMessage = personalizedMessage.replace(/{{OfficeName}}/g, this.config.officeName || "Bright Smile Dental");
  
  // WooAI time suggestion (dynamic time options - typically 3 choices)
  if (personalizedMessage.includes("{{wooai}}")) {
    const timeOptions = this.generateTimeOptions();
    personalizedMessage = personalizedMessage.replace(/{{wooai}}/g, timeOptions);
  }
  
  // Appointment details if available
  if (prospect.appointment) {
    personalizedMessage = personalizedMessage.replace(/{{AppointmentDate}}/g, prospect.appointment.date || "tomorrow");
    personalizedMessage = personalizedMessage.replace(/{{AppointmentTime}}/g, prospect.appointment.time || "the scheduled time");
  }
  
  return personalizedMessage;
}
```

## Frontend Integration

### Data Exchange with UI

The UI interacts with the SDR Agent through:

1. Direct API calls to the SDR Agent
2. Event subscriptions for real-time updates
3. Data queries for displaying campaign and prospect information

```typescript
// Example of UI component integration
function ProspectOverview({ prospectId }) {
  const [prospect, setProspect] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadProspect() {
      setLoading(true);
      const prospectData = await sdrAgent.getProspect(prospectId);
      const campaignData = await sdrAgent.getCampaign(prospectData.currentCampaign);
      
      setProspect(prospectData);
      setCampaign(campaignData);
      setLoading(false);
    }
    
    loadProspect();
    
    // Subscribe to updates
    const unsubscribe = sdrAgent.subscribeToProspectUpdates(
      prospectId, 
      updatedProspect => setProspect(updatedProspect)
    );
    
    return unsubscribe;
  }, [prospectId]);
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="prospect-overview">
      <h2>{prospect.firstName} {prospect.lastName}</h2>
      <div className="campaign-status">
        Current Campaign: {campaign.name}
        Stage: {prospect.stage + 1} of {campaign.automationEvents.length}
      </div>
      
      {prospect.appointment && (
        <AppointmentCard appointment={prospect.appointment} />
      )}
      
      <ActionButtons 
        prospectId={prospectId}
        onMoveCampaign={handleMoveCampaign}
        onSendManualMessage={handleSendMessage}
      />
    </div>
  );
}
```

### Campaign Management UI

The UI provides tools for staff to:

1. Configure campaign settings
2. Preview and edit message templates
3. Adjust timing and sequence of automation events
4. Manage response handlers and keywords

```typescript
// Campaign configuration component
function CampaignSettings({ campaignId }) {
  const [settings, setSettings] = useState({
    enabled: true,
    officeName: "Bright Smile Dental",
    customFields: {}
  });
  
  useEffect(() => {
    // Load existing settings
    async function loadSettings() {
      const config = await sdrAgent.getCampaignConfig(campaignId);
      setSettings(config);
    }
    
    loadSettings();
  }, [campaignId]);
  
  const handleToggleEnabled = async () => {
    const updatedSettings = {
      ...settings,
      enabled: !settings.enabled
    };
    
    await sdrAgent.updateCampaignConfig(campaignId, updatedSettings);
    setSettings(updatedSettings);
  };
  
  return (
    <div className="campaign-settings">
      <h2>{campaignId} Settings</h2>
      
      <div className="setting-group">
        <label>
          <input 
            type="checkbox" 
            checked={settings.enabled} 
            onChange={handleToggleEnabled} 
          />
          Campaign Enabled
        </label>
      </div>
      
      {/* More settings fields */}
    </div>
  );
}
```

## Advanced Features

### Power Hour Mode

Power Hour is a special mode that intensifies outreach to selected prospects:

1. Staff activate Power Hour from the UI
2. The system selects prospects from the Holding campaign
3. These prospects are moved to the PowerHour campaign
4. After Power Hour ends, remaining prospects return to Holding

```typescript
// Power Hour activation in UI
function PowerHourController() {
  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(25);
  const [activeProspects, setActiveProspects] = useState(0);
  
  const startPowerHour = async () => {
    const activated = await sdrAgent.activatePowerHour(count);
    setIsActive(true);
    setActiveProspects(activated);
    
    // Schedule end of Power Hour
    setTimeout(() => {
      endPowerHour();
    }, 60 * 60 * 1000); // 1 hour
  };
  
  const endPowerHour = async () => {
    await sdrAgent.endPowerHour();
    setIsActive(false);
    setActiveProspects(0);
  };
  
  return (
    <div className="power-hour-controller">
      <h2>Power Hour</h2>
      
      {isActive ? (
        <>
          <p>{activeProspects} prospects in Power Hour mode</p>
          <button onClick={endPowerHour}>End Power Hour</button>
        </>
      ) : (
        <>
          <input 
            type="number" 
            value={count} 
            onChange={e => setCount(parseInt(e.target.value))} 
            min="1" 
            max="100" 
          />
          <button onClick={startPowerHour}>Start Power Hour</button>
        </>
      )}
    </div>
  );
}
```

### No-Show Processing

The system automatically identifies and follows up with prospects who miss appointments:

1. The `checkNoShows()` method runs daily
2. It identifies appointments from the previous day that are still "scheduled"
3. These are marked as "no-show" and the prospects are moved to the NoShow campaign
4. The NoShow campaign sequences attempt to reschedule the appointment

```typescript
// No-Show processing logic
checkNoShows(): number {
  // Find appointments that were missed
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const noShows = [...this.appointments.values()]
    .filter(apt => {
      const aptDate = new Date(apt.date);
      return (
        apt.status === 'scheduled' &&
        aptDate < yesterday
      );
    });
  
  // Move no-shows to the no-show campaign
  for (const appointment of noShows) {
    appointment.status = 'no-show';
    this.appointments.set(appointment.id, appointment);
    
    this.moveToNextCampaign(appointment.prospectId, 'noShow');
  }
  
  return noShows.length;
}
```

## Implementation Examples

### Adding New Campaign Types

To add a new campaign type to the system:

1. Create a new class extending the base Campaign
2. Define automation events and response handlers
3. Register it in the Campaign Manager

```typescript
// src/ai/sdr/campaigns/referral.campaign.ts
import { Campaign } from './base.campaign';
import { CampaignConfig } from '../interfaces/campaign.interfaces';

export class ReferralCampaign extends Campaign {
  constructor(config: CampaignConfig = { enabled: true }) {
    super(config);
    this.name = "Referral";
    this.nextCampaign = "holding";
    
    this.automationEvents = [
      {
        type: "email",
        name: "Thank You for Referral",
        timing: "send_after_opt_in",
        subject: "{{FirstName}}, Thank You for Your Referral",
        message: "Hey {{FirstName}}, this is {{AssigneeFirstName}} with {{OfficeName}}. I wanted to thank you for referring your friend to us. As a token of our appreciation, you'll receive a $50 credit on your next visit!"
      },
      // More events...
    ];
    
    this.responseHandlers = [
      // Define handlers...
    ];
  }
}

// Register in Campaign Manager
campaigns = {
  // Existing campaigns...
  referral: new ReferralCampaign(config)
};
```

### Customizing Message Templates

To update message templates for a campaign:

```typescript
// Example API for updating templates
async function updateCampaignMessages(campaignId, eventIndex, updates) {
  try {
    await sdrAgent.updateCampaignEvent(campaignId, eventIndex, updates);
    showSuccessMessage("Message template updated successfully");
  } catch (error) {
    showErrorMessage("Failed to update message template");
  }
}

// Usage in UI
updateCampaignMessages('leadGeneration', 0, {
  message: "Hi {{FirstName}}, this is {{AssigneeFirstName}} from {{OfficeName}}. Thanks for your interest in our services! When would be a good time to chat?"
});
```

## Debugging and Troubleshooting

### Viewing Campaign Status

The UI provides tools to inspect the current state of campaigns and prospects:

```typescript
// Campaign debugger component
function CampaignDebugger() {
  const [campaignStats, setCampaignStats] = useState({});
  
  useEffect(() => {
    async function loadStats() {
      const stats = await sdrAgent.getCampaignStatistics();
      setCampaignStats(stats);
    }
    
    loadStats();
    const interval = setInterval(loadStats, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="campaign-debugger">
      <h2>Campaign Statistics</h2>
      
      <table>
        <thead>
          <tr>
            <th>Campaign</th>
            <th>Active Prospects</th>
            <th>Messages Sent Today</th>
            <th>Response Rate</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(campaignStats).map(([campaign, stats]) => (
            <tr key={campaign}>
              <td>{campaign}</td>
              <td>{stats.activeProspects}</td>
              <td>{stats.messagesSentToday}</td>
              <td>{stats.responseRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Testing Messages

The UI allows staff to test messages before enabling them:

```typescript
// Message testing component
function MessageTester() {
  const [template, setTemplate] = useState(
    "Hey {{FirstName}}, this is {{AssigneeFirstName}} with {{OfficeName}}. Would {{wooai}} work for a quick call?"
  );
  
  const [preview, setPreview] = useState("");
  
  const testTemplate = async () => {
    const testProspect = {
      id: "test_prospect",
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      phone: "+15551234567"
    };
    
    const processed = await sdrAgent.testMessageTemplate(template, testProspect);
    setPreview(processed);
  };
  
  return (
    <div className="message-tester">
      <h2>Test Message Templates</h2>
      
      <div className="template-input">
        <textarea 
          value={template}
          onChange={e => setTemplate(e.target.value)}
          rows={5}
          className="full-width"
        />
      </div>
      
      <button onClick={testTemplate}>Test Template</button>
      
      {preview && (
        <div className="preview">
          <h3>Preview:</h3>
          <div className="message-preview">{preview}</div>
        </div>
      )}
    </div>
  );
}
```

## Conclusion

The SDR Agent business logic implementation provides a flexible and powerful system for dental practices to automate prospect communications and drive appointment bookings. By leveraging specialized campaign types with carefully crafted message sequences and response handlers, the system can effectively nurture leads through the sales funnel.

The integration between the business logic and the UI ensures that staff can easily configure, monitor, and manage the automation while maintaining the personal touch that is essential in healthcare services.

For developers looking to extend the system, the campaign architecture makes it straightforward to add new campaign types, customize message templates, and integrate with additional communication channels.