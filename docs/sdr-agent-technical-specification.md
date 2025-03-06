# SDR Agent Technical Specification

## Overview

This technical specification provides detailed implementation guidance for the Sales Development Representative (SDR) agent in the DentalHub system. The SDR agent will manage automated communication campaigns for dental practices to nurture leads and drive prospects toward booking appointments.

## Class Structure

### 1. Base Campaign Class

```typescript
class Campaign {
  protected config: CampaignConfig;
  protected officeName: string;
  
  constructor(config: CampaignConfig = {}) {
    this.config = config;
    this.officeName = config.officeName || "Bright Smile Dental";
  }
  
  // Replace placeholder variables in messages
  protected processMessage(message: string, prospect: Prospect): string {
    let processedMessage = message;
    
    // Replace office name
    processedMessage = processedMessage.replace(/{{OfficeName}}/g, this.officeName);
    
    // Replace prospect information
    processedMessage = processedMessage.replace(/{{FirstName}}/g, prospect.firstName || "there");
    processedMessage = processedMessage.replace(/{{LastName}}/g, prospect.lastName || "");
    
    // More replacements as needed...
    
    return processedMessage;
  }
}
```

### 2. Specialized Campaign Classes

Each campaign type will extend the base Campaign class:

```typescript
class LeadGenerationCampaign extends Campaign {
  public name: string;
  public nextCampaign: string;
  public automationEvents: AutomationEvent[];
  public responseHandlers: ResponseHandler[];
  
  constructor(config: CampaignConfig = {}) {
    super(config);
    this.name = "Lead Generation";
    this.nextCampaign = "noResponse";
    
    // Define automation events as provided in the business logic
    this.automationEvents = [
      {
        type: "sms",
        name: "Thank You",
        timing: "send_after_opt_in",
        message: "Hey {{FirstName}}, this is {{AssigneeFirstName}} with {{OfficeName}}. I thought following up by text might be easier for you. Thanks for filling out our form for Enhanced Dental PPO Coverage! 😊"
      },
      // More events as defined in the business logic...
    ];
    
    // Define response handlers as provided in the business logic
    this.responseHandlers = [
      {
        keywords: ["yes", "interested", "tell me more", "information"],
        action: "offer_times",
        reply: "Great! Would tomorrow at 2pm, 3pm, or 4pm work for a quick call to discuss our Enhanced Dental PPO Coverage options?"
      },
      // More handlers as defined in the business logic...
    ];
  }
}
```

Similar implementations would be created for:
- NoResponseCampaign
- NoShowCampaign
- ReEngagementCampaign
- ListValidationCampaign
- ColdOfferCampaign
- PowerHourCampaign
- HoldingCampaign

### 3. Campaign Manager

```typescript
class CampaignManager {
  private campaigns: Record<string, Campaign>;
  private prospects: Map<string, ProspectRecord>;
  private appointments: Map<string, Appointment>;
  private config: CampaignManagerConfig;
  
  constructor(config: CampaignManagerConfig = {}) {
    this.config = {
      officeName: "Bright Smile Dental",
      ...config
    };
    
    // Initialize all campaign types
    this.campaigns = {
      leadGeneration: new LeadGenerationCampaign(this.config),
      noResponse: new NoResponseCampaign(this.config),
      noShow: new NoShowCampaign(this.config),
      reEngagement: new ReEngagementCampaign(this.config),
      listValidation: new ListValidationCampaign(this.config),
      coldOffer: new ColdOfferCampaign(this.config),
      powerHour: new PowerHourCampaign(this.config),
      holding: new HoldingCampaign(this.config)
    };
    
    this.prospects = new Map();
    this.appointments = new Map();
  }
  
  // Add a prospect to a campaign
  public addProspect(prospect: Prospect, campaignName: string = "listValidation"): boolean {
    // Implementation as provided in the business logic
  }
  
  // Process a response from a prospect
  public processResponse(prospectId: string, message: string): ResponseResult | null {
    // Implementation as provided in the business logic
  }
  
  // Other methods from the business logic...
}
```

### 4. SDR Agent

```typescript
export class SDRAgent {
  private campaignManager: CampaignManager;
  private communicationService: any; // Reference to the app's communication service
  
  constructor(config: SDRAgentConfig = {}) {
    this.campaignManager = new CampaignManager({
      officeName: config.officeName || "Bright Smile Dental"
    });
    
    // Initialize communication service reference
    this.communicationService = communicationService;
  }
  
  /**
   * Add a new prospect to the system and start them on a campaign
   */
  public addProspect(prospect: Prospect, campaignName?: string): boolean {
    return this.campaignManager.addProspect(prospect, campaignName);
  }
  
  /**
   * Process an incoming message from a prospect
   */
  public async processIncomingMessage(prospectId: string, message: string): Promise<void> {
    const result = this.campaignManager.processResponse(prospectId, message);
    
    if (result) {
      // Send the reply using the communication service
      await this.sendMessage(prospectId, result.reply);
      
      // Perform any additional actions based on the result
      if (result.action === "move_campaign" && result.targetCampaign) {
        // Log the campaign move
        console.log(`Moving prospect ${prospectId} to campaign: ${result.targetCampaign}`);
      }
    }
  }
  
  /**
   * Send a message to a prospect
   */
  private async sendMessage(prospectId: string, message: string): Promise<void> {
    const prospect = this.getProspect(prospectId);
    
    if (!prospect) return;
    
    try {
      // Use the communication service to send the message
      await this.communicationService.sms.send({
        to: prospect.phone,
        body: message
      });
      
      // Log the sent message
      console.log(`Sent message to ${prospectId}: ${message}`);
    } catch (error) {
      console.error(`Error sending message to ${prospectId}:`, error);
    }
  }
  
  /**
   * Get a prospect's record
   */
  private getProspect(prospectId: string): Prospect | undefined {
    const record = this.campaignManager.getProspect(prospectId);
    return record?.data;
  }
  
  /**
   * Activate power hour mode to intensively follow up with prospects
   */
  public activatePowerHour(count?: number): number {
    return this.campaignManager.activatePowerHour(count);
  }
  
  /**
   * Check for no-shows and move them to the appropriate campaign
   */
  public checkNoShows(): number {
    return this.campaignManager.checkNoShows();
  }
}
```

## TypeScript Interfaces

```typescript
// Configuration interfaces
export interface CampaignConfig {
  officeName?: string;
  [key: string]: any;
}

export interface CampaignManagerConfig extends CampaignConfig {}

export interface SDRAgentConfig extends CampaignConfig {}

// Prospect interfaces
export interface Prospect {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source?: string;
  appointment?: Appointment;
  [key: string]: any;
}

export interface ProspectRecord {
  data: Prospect;
  currentCampaign: string;
  stage: number;
  history: CampaignHistoryEntry[];
  tags: Set<string>;
}

export interface CampaignHistoryEntry {
  campaign: string;
  timestamp: Date;
}

// Event and handler interfaces
export interface AutomationEvent {
  type: "sms" | "email" | "ai_voice_call" | "voicemail_drop";
  name: string;
  timing: string;
  message: string;
  subject?: string; // For email events
}

export interface ResponseHandler {
  keywords: string[];
  action: "offer_times" | "book_appointment" | "move_campaign" | "mark_invalid" | "default_reply";
  reply: string;
  targetCampaign?: string; // For move_campaign action
}

export interface ResponseResult {
  action: string;
  reply: string;
  targetCampaign?: string;
}

// Appointment interface
export interface Appointment {
  id: string;
  prospectId: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "no-show" | "cancelled";
  service: string;
}

// Campaign type enum
export enum CampaignType {
  LEAD_GENERATION = "leadGeneration",
  NO_RESPONSE = "noResponse",
  NO_SHOW = "noShow",
  RE_ENGAGEMENT = "reEngagement",
  LIST_VALIDATION = "listValidation",
  COLD_OFFER = "coldOffer",
  POWER_HOUR = "powerHour",
  HOLDING = "holding"
}
```

## Integration with Communication Services

The SDR agent will use the existing communication services in the application:

```typescript
// src/ai/sdr/sdr.agent.ts
import communicationService from '../../lib/api/communicationService';

// Inside the SDRAgent class
private async sendSMS(to: string, message: string): Promise<void> {
  try {
    await communicationService.sms.send({
      to,
      body: message
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
}

private async sendEmail(to: string, subject: string, message: string): Promise<void> {
  try {
    await communicationService.email.send({
      to,
      subject,
      body: message
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

private async initiateVoiceCall(to: string, message: string): Promise<void> {
  try {
    await communicationService.retell.initiateRetellCall({
      to,
      script: message
    });
  } catch (error) {
    console.error('Error initiating voice call:', error);
  }
}
```

## Database Schema Considerations

The SDR agent will need to store prospect and campaign data. Here's a suggested database schema:

### Prospects Table
- id (Primary Key)
- first_name
- last_name
- email
- phone
- source
- created_at
- updated_at

### ProspectCampaigns Table
- id (Primary Key)
- prospect_id (Foreign Key)
- campaign_type
- current_stage
- status
- created_at
- updated_at

### CampaignHistory Table
- id (Primary Key)
- prospect_id (Foreign Key)
- campaign_type
- start_date
- end_date
- exit_reason

### Appointments Table
- id (Primary Key)
- prospect_id (Foreign Key)
- date
- time
- status
- service
- created_at
- updated_at

## Implementation Strategy

1. **Phase 1**: Implement core campaign classes and campaign manager
2. **Phase 2**: Create the SDR agent and integrate with communication services
3. **Phase 3**: Build UI components for campaign management
4. **Phase 4**: Add analytics and reporting
5. **Phase 5**: Implement A/B testing and optimization features

## Example Usage

```typescript
// Example usage in the application
import { SDRAgent } from '../ai/sdr/sdr.agent';

// Create the SDR agent
const sdrAgent = new SDRAgent({
  officeName: "Bright Smile Dental"
});

// Add a new prospect
const prospect = {
  id: 'prospect_123',
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@example.com',
  phone: '+15551234567',
  source: 'website_form'
};

// Add to lead generation campaign
sdrAgent.addProspect(prospect, 'leadGeneration');

// Process an incoming response
sdrAgent.processIncomingMessage('prospect_123', 'Yes, I\'m interested in learning more');

// Activate power hour for up to 25 prospects
sdrAgent.activatePowerHour(25);

// Check for no-shows
sdrAgent.checkNoShows();
```

## Next Steps and Recommendations

1. Review this technical specification with the development team
2. Identify any dependencies or existing code that needs to be modified
3. Develop unit tests for all components
4. Create a migration plan for existing prospects in the system
5. Define analytics requirements for campaign performance tracking
6. Consider future enhancements:
   - AI-driven message personalization
   - Dynamic timing based on prospect engagement
   - Integration with calendar systems for direct scheduling