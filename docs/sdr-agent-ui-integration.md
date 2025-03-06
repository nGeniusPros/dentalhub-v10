# SDR Agent UI Integration Documentation

## Overview

This document explains how the SDR Agent business logic integrates with the DentalHub frontend UI. It provides developers with a clear understanding of the data flow, component interactions, and configuration options for the dental practice campaign automation system.

## Architecture Overview

The SDR Agent system follows a layered architecture:

```
┌────────────────────────┐
│     Frontend UI        │
│  (React Components)    │
└───────────┬────────────┘
            │
┌───────────▼────────────┐
│    SDR Agent API       │
│  (Integration Layer)   │
└───────────┬────────────┘
            │
┌───────────▼────────────┐
│   Campaign Manager     │
│  (Business Logic)      │
└───────────┬────────────┘
            │
┌───────────▼────────────┐
│ Campaign Implementations│
│  (Business Rules)      │
└───────────┬────────────┘
            │
┌───────────▼────────────┐
│ Communication Services │
│  (SMS, Email, Voice)   │
└────────────────────────┘
```

## Business Logic Structure

The core business logic consists of:

1. **Base Campaign Class**: Provides common functionality for all campaigns
2. **Specialized Campaign Classes**: Implement specific campaign types with unique sequences and response handlers
3. **Campaign Manager**: Coordinates campaigns and prospect movement between them
4. **SDR Agent**: Acts as a facade to the outside world, exposing a simplified API

Each campaign is configured with:
- **Automation Events**: Scheduled messages to be sent to prospects
- **Response Handlers**: Rules for processing prospect replies
- **Campaign Flow**: Rules for moving prospects between campaigns

## Data Flow

### From UI to Agent (Input Flow)

1. **UI Action**: User performs an action in the UI (e.g., adding a prospect, updating settings)
2. **API Call**: Frontend calls appropriate method on the SDR Agent API
3. **Business Logic**: Campaign Manager processes the request
4. **State Update**: Campaign state is updated
5. **Feedback**: Success/failure response returned to UI

### From Agent to UI (Output Flow)

1. **Agent Events**: SDR Agent generates events (e.g., message sent, campaign changed)
2. **Event Bus**: Events are published to the application event bus
3. **UI Subscription**: UI components subscribe to relevant events
4. **Component Updates**: UI components update based on event data
5. **User Notification**: User is notified of important events via the UI

## UI Components

### 1. Campaign Dashboard

**Purpose**: Provides an overview of all active campaigns and their performance

**Integration Points**:
- Retrieves campaign statistics from SDR Agent
- Displays real-time updates of campaign activities
- Allows enabling/disabling campaigns

**Code Example**:
```tsx
import { useCampaignStats } from '../hooks/useCampaignStats';

function CampaignDashboard() {
  const { stats, loading, error } = useCampaignStats();
  
  const toggleCampaign = async (campaignId: string, enabled: boolean) => {
    await sdrAgent.setCampaignStatus(campaignId, enabled);
  };
  
  return (
    <div className="campaign-dashboard">
      <h1>Campaign Performance</h1>
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : (
        <CampaignTable 
          data={stats} 
          onToggleCampaign={toggleCampaign} 
        />
      )}
    </div>
  );
}
```

### 2. Prospect Management

**Purpose**: Allows staff to view, add, and manage prospects

**Integration Points**:
- Creates new prospects in the system
- Assigns prospects to specific campaigns
- Displays prospect journey history
- Shows scheduled automation events

**Code Example**:
```tsx
function AddProspectForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    source: 'website',
    campaign: 'leadGeneration'
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const prospect = {
      id: `prospect_${Date.now()}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      source: formData.source
    };
    
    await sdrAgent.addProspect(prospect, formData.campaign);
    // Handle success/error and reset form
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Add Prospect</button>
    </form>
  );
}
```

### 3. Campaign Configuration

**Purpose**: Allows customization of campaign sequences and messages

**Integration Points**:
- Retrieves campaign configurations
- Updates message templates
- Modifies automation event timing
- Configures response handlers

**Code Example**:
```tsx
function CampaignEditor({ campaignId }) {
  const { campaign, saveCampaign, loading } = useCampaignEditor(campaignId);
  
  const updateEvent = (eventIndex, field, value) => {
    const updatedEvents = [...campaign.automationEvents];
    updatedEvents[eventIndex] = { 
      ...updatedEvents[eventIndex], 
      [field]: value 
    };
    
    saveCampaign({
      ...campaign,
      automationEvents: updatedEvents
    });
  };
  
  return (
    <div className="campaign-editor">
      <h2>Edit {campaign.name} Campaign</h2>
      
      <section>
        <h3>Automation Events</h3>
        {campaign.automationEvents.map((event, index) => (
          <EventEditor 
            key={index} 
            event={event} 
            onChange={(field, value) => updateEvent(index, field, value)} 
          />
        ))}
      </section>
      
      {/* Response handlers section */}
    </div>
  );
}
```

### 4. Conversation View

**Purpose**: Displays conversation history with prospects

**Integration Points**:
- Shows all messages exchanged with a prospect
- Indicates which messages were automated vs. manual
- Allows sending manual messages
- Shows which campaign and stage the prospect is currently in

**Code Example**:
```tsx
function ConversationView({ prospectId }) {
  const { conversation, prospect, sendMessage } = useProspectConversation(prospectId);
  const [newMessage, setNewMessage] = useState('');
  
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    await sendMessage(newMessage);
    setNewMessage('');
  };
  
  return (
    <div className="conversation-view">
      <div className="prospect-info">
        <h2>{prospect.firstName} {prospect.lastName}</h2>
        <div className="campaign-badge">
          Campaign: {prospect.currentCampaign}
        </div>
      </div>
      
      <div className="message-thread">
        {conversation.map(message => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            isAutomated={message.type === 'automated'} 
          />
        ))}
      </div>
      
      <div className="message-composer">
        <textarea 
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}
```

## Configuration Options

### Campaign Configuration

The SDR agent's behavior can be customized through campaign configuration:

```typescript
interface CampaignConfig {
  enabled: boolean;       // Whether the campaign is active
  officeName?: string;    // Office name for personalization
  timezone?: string;      // Timezone for scheduling
  testMode?: boolean;     // For testing without sending actual messages
  customFields?: Record<string, any>; // Additional configuration
}
```

Example of configuring the agent:

```typescript
// In your application initialization
const sdrAgent = new SDRAgent({
  officeName: "Bright Smile Dental",
  timezone: "America/New_York",
  testMode: process.env.NODE_ENV !== 'production'
});

// Set specific campaign configuration
sdrAgent.configureCampaign('leadGeneration', {
  enabled: true,
  customFields: {
    maxAttempts: 5,
    priorityLevel: 'high'
  }
});
```

### Message Templates

Campaign messages use template variables to personalize content:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{FirstName}}` | Prospect's first name | "John" |
| `{{LastName}}` | Prospect's last name | "Smith" |
| `{{OfficeName}}` | Dental office name | "Bright Smile Dental" |
| `{{AssigneeFirstName}}` | First name of assigned rep | "Sarah" |
| `{{AssigneeFullName}}` | Full name of assigned rep | "Sarah Johnson" |
| `{{AccountPhoneNumber}}` | Office phone number | "(555) 123-4567" |
| `{{wooai}}` | Dynamic time suggestion | "Wednesday at 2pm, 3pm, or 4pm" |
| `{{AppointmentDate}}` | Scheduled appointment date | "Thursday, March 15" |
| `{{AppointmentTime}}` | Scheduled appointment time | "3:00 PM" |

## Event Handling

The SDR Agent emits events that the UI can listen to:

```typescript
// Setting up event listeners in UI components
useEffect(() => {
  const subscriptions = [
    eventBus.subscribe('sdr:message-sent', handleMessageSent),
    eventBus.subscribe('sdr:campaign-changed', handleCampaignChanged),
    eventBus.subscribe('sdr:appointment-booked', handleAppointmentBooked)
  ];
  
  return () => {
    subscriptions.forEach(sub => sub.unsubscribe());
  };
}, []);
```

## Campaign Sequences and Business Logic

Each campaign type implements specific business logic for different stages of the prospect journey:

### Lead Generation Campaign

**Purpose**: For new leads who filled out a form or showed initial interest

**Sequence**:
1. Immediate thank you SMS
2. Follow-up email within 5 minutes
3. Voice call on day 1
4. Check-in SMS 30 minutes after call
5. Email and SMS on days 2-5

**Response Logic**:
- Expressions of interest → Offer appointment times
- Time selections → Book appointment
- Negative responses → Move to Holding campaign

### No Response Campaign

**Purpose**: For leads who didn't respond to initial outreach

**Sequence**:
1. Check-in SMS and voice call on day 1
2. Follow-up SMS and email on day 2
3. "Are you still looking" message on day 3
4. Final attempt on day 4

**Response Logic**: Similar to Lead Generation campaign

### No Show Campaign  

**Purpose**: For leads who booked but didn't show up for their appointment

**Sequence**:
1. Voice call and SMS on day 1 after missed appointment
2. Email and SMS on day 2 offering reschedule
3. Final voice call and SMS on day 3
4. Last chance email on day 4

**Response Logic**: 
- Reschedule requests → Offer new appointment times
- Confirmations → Book new appointment
- Negative responses → Move to Holding campaign

## Development Guidelines

### Adding a New Campaign Type

1. Create a new file in `src/ai/sdr/campaigns/` following existing patterns
2. Extend the base `Campaign` class
3. Define automation events and response handlers
4. Register the new campaign in the Campaign Manager
5. Add the UI components to support the new campaign

Example:

```typescript
// src/ai/sdr/campaigns/recall.campaign.ts
import { Campaign } from './base.campaign';
import { CampaignConfig } from '../interfaces/campaign.interfaces';

export class RecallCampaign extends Campaign {
  constructor(config: CampaignConfig = { enabled: true }) {
    super(config);
    this.name = "Recall";
    this.nextCampaign = "reEngagement";
    
    this.automationEvents = [
      // Define events for this campaign
    ];
    
    this.responseHandlers = [
      // Define response handlers
    ];
  }
}

// Register in campaign-manager.ts
this.campaigns = {
  // existing campaigns...
  recall: new RecallCampaign(this.config)
};
```

### Testing the Integration

1. **Unit Tests**: Test individual campaign classes and response handlers
2. **Integration Tests**: Test Campaign Manager with mock communication services
3. **UI Tests**: Test UI components with mock SDR Agent responses
4. **End-to-End Tests**: Test the full integration with test prospects

## Reporting and Analytics

The SDR Agent provides data for UI dashboards:

```typescript
// Retrieve campaign performance metrics
const metrics = await sdrAgent.getCampaignMetrics('leadGeneration');

// Example metrics returned
{
  totalProspects: 248,
  activeProspects: 156,
  completedCampaigns: 92,
  responseRate: 0.43, // 43%
  conversionRate: 0.18, // 18%
  appointmentsBooked: 45,
  appointmentsCompleted: 32,
  messagesSent: {
    sms: 724,
    email: 496,
    voiceCall: 248
  },
  averageResponses: 2.4, // per prospect
  // More metrics...
}
```

## Troubleshooting Common Issues

### Message Not Sent

**Possible causes**:
- Campaign is disabled
- Prospect is in an inactive state
- Communication service failure

**UI Solution**:
1. Check campaign status in Campaign Dashboard
2. Verify prospect status in Prospect Management
3. Check system logs for communication errors

### Prospect Not Moving Through Campaign

**Possible causes**:
- Response handlers not matching incoming messages
- Next campaign is disabled
- Campaign stage advancement issue

**UI Solution**:
1. Review conversation history to see if responses were recognized
2. Manually move prospect to next campaign stage if needed
3. Verify all campaigns are properly enabled

## Best Practices for UI-Agent Integration

1. **State Management**: Use a state management solution that integrates with the event bus
2. **Error Handling**: Display meaningful error messages when agent operations fail
3. **Optimistic Updates**: Update UI optimistically, then confirm with backend
4. **Caching**: Cache campaign configurations to reduce load times
5. **Batching**: Batch operations when managing multiple prospects