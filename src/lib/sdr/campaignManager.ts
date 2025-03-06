import { 
  Campaign, 
  PatientData,
  CampaignTypes,
  AutomationEvent,
  CampaignConfig
} from './campaigns';

/**
 * CampaignManager
 * 
 * Manages dental practice campaign automations and integrates with the
 * Communications Dashboard to ensure all communications are properly recorded.
 */
export class CampaignManager {
  constructor(config: CampaignManagerConfig = {}) {
    // Set default configuration with customizable office name
    this.config = {
      officeName: "Bright Smile Dental",
      ...config
    };
    
    // Initialize campaigns with configuration
    this.initializeCampaigns();
    
    this.prospects = new Map();
    this.appointments = new Map();
  }
  
  private config: CampaignManagerConfig;
  private campaigns: Record<string, Campaign> = {};
  private prospects: Map<string, ProspectRecord>;
  private appointments: Map<string, AppointmentRecord>;
  private communicationContext: CommunicationContext | null = null;
  
  // Set communication context from React component
  setCommunicationContext(context: CommunicationContext) {
    this.communicationContext = context;
  }
  
  // Initialize all campaign types with the current configuration
  private initializeCampaigns() {
    this.campaigns = {
      leadGeneration: new CampaignTypes.leadGeneration(this.config),
      noResponse: new CampaignTypes.noResponse(this.config),
      noShow: new CampaignTypes.noShow(this.config),
      reEngagement: new CampaignTypes.reEngagement(this.config),
      listValidation: new CampaignTypes.listValidation(this.config),
      coldOffer: new CampaignTypes.coldOffer(this.config),
      powerHour: new CampaignTypes.powerHour(this.config),
      holding: new CampaignTypes.holding(this.config)
    };
  }
  
  // Add a prospect to a campaign
  addProspect(prospect: PatientData, campaignName: string = "listValidation"): boolean {
    // Determine appropriate starting campaign based on lead source
    const campaign = this.campaigns[campaignName];
    if (!campaign) return false;
    
    // Add to prospect tracking
    this.prospects.set(prospect.id, {
      data: prospect,
      currentCampaign: campaignName,
      stage: 0,
      history: [],
      tags: new Set()
    });
    
    // Start first campaign event
    this.scheduleNextEvent(prospect.id);
    return true;
  }
  
  // Process a response from a prospect
  processResponse(prospectId: string, message: string): ResponseResult | null {
    const prospectRecord = this.prospects.get(prospectId);
    if (!prospectRecord) return null;
    
    const campaign = this.campaigns[prospectRecord.currentCampaign];
    if (!campaign) return null;
    
    // Find matching response handler
    let matchedHandler = null;
    for (const handler of campaign.responseHandlers) {
      const matches = handler.keywords.some(keyword => 
        message.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (matches) {
        matchedHandler = handler;
        break;
      }
    }
    
    // Use default handler if no match
    if (!matchedHandler) {
      return {
        action: "default_reply",
        reply: this.personalizeMessage(
          "Thanks for your response! Would you like to hear more about our Enhanced Dental PPO Coverage options or schedule a quick call?",
          prospectRecord.data
        ),
        targetCampaign: null
      };
    }
    
    // Process the action
    if (matchedHandler.action === "move_campaign" && matchedHandler.targetCampaign) {
      this.moveToNextCampaign(prospectId, matchedHandler.targetCampaign);
    } else if (matchedHandler.action === "book_appointment") {
      this.bookAppointment(prospectId, message);
    }
    
    // Personalize the reply
    const personalizedReply = this.personalizeMessage(
      matchedHandler.reply,
      prospectRecord.data
    );
    
    // Record the outbound message in the communications dashboard
    this.recordCommunication({
      patientId: prospectId,
      type: 'sms',
      direction: 'outbound',
      content: personalizedReply,
      patientName: `${prospectRecord.data.firstName || ''} ${prospectRecord.data.lastName || ''}`.trim(),
      patientPhone: prospectRecord.data.phone || '',
      patientEmail: prospectRecord.data.email
    });
    
    return {
      action: matchedHandler.action,
      reply: personalizedReply,
      targetCampaign: matchedHandler.targetCampaign || null
    };
  }
  
  // Personalize message for a prospect
  private personalizeMessage(message: string, prospect: PatientData): string {
    const campaign = this.getCampaignForProspect(prospect.id);
    if (!campaign) return message;
    
    return campaign.processMessage(message, prospect);
  }
  
  // Get the campaign for a prospect
  private getCampaignForProspect(prospectId: string): Campaign | null {
    const prospectRecord = this.prospects.get(prospectId);
    if (!prospectRecord) return null;
    
    return this.campaigns[prospectRecord.currentCampaign] || null;
  }
  
  // Schedule the next event for a prospect
  scheduleNextEvent(prospectId: string): boolean {
    const prospectRecord = this.prospects.get(prospectId);
    if (!prospectRecord) return false;
    
    const campaign = this.campaigns[prospectRecord.currentCampaign];
    if (!campaign || !campaign.automationEvents || campaign.automationEvents.length === 0) return false;
    
    // Check if campaign is enabled
    if (campaign.config.enabled === false) return false;
    
    // Get next event based on stage
    if (prospectRecord.stage >= campaign.automationEvents.length) {
      // End of campaign, move to next campaign if defined
      if (campaign.nextCampaign) {
        this.moveToNextCampaign(prospectId, campaign.nextCampaign);
        return true;
      }
      return false;
    }
    
    const event = campaign.automationEvents[prospectRecord.stage];
    
    // Send the event through the appropriate communication channel
    this.sendCommunication(prospectId, event);
    
    // Update stage
    prospectRecord.stage++;
    this.prospects.set(prospectId, prospectRecord);
    
    return true;
  }
  
  // Send communication through the appropriate channel and record in dashboard
  private async sendCommunication(prospectId: string, event: AutomationEvent): Promise<void> {
    if (!this.communicationContext) {
      console.error("Communication context not available. Message not sent.");
      return;
    }
    
    const prospectRecord = this.prospects.get(prospectId);
    if (!prospectRecord) return;
    
    const prospect = prospectRecord.data;
    const personalizedMessage = this.personalizeMessage(event.message, prospect);
    
    // Record in Communications Dashboard
    const communicationData: CommunicationData = {
      patientId: prospectId,
      patientName: `${prospect.firstName || ''} ${prospect.lastName || ''}`.trim(),
      patientPhone: prospect.phone || '',
      patientEmail: prospect.email,
      type: this.mapCommunicationType(event.type),
      direction: 'outbound',
      content: personalizedMessage
    };
    
    try {
      // Send through appropriate channel
      switch(event.type) {
        case 'sms':
          if (prospect.phone) {
            const smsRequest = {
              to: prospect.phone,
              body: personalizedMessage
            };
            await this.communicationContext.sendSMS(smsRequest);
          }
          break;
          
        case 'ai_voice_call':
          if (prospect.phone) {
            const callRequest = {
              phoneNumber: prospect.phone,
              patientInfo: {
                name: `${prospect.firstName || ''} ${prospect.lastName || ''}`.trim(),
                id: prospect.id
              }
            };
            await this.communicationContext.initiateRetellCall(callRequest);
          }
          break;
          
        case 'email':
          // Email would be handled by email service integrated with Communications Dashboard
          console.log(`[${event.name}] Email to ${prospect.email}: ${personalizedMessage}`);
          break;
          
        case 'voicemail_drop':
          // Voicemail drops would be handled by voice service
          console.log(`[${event.name}] Voicemail to ${prospect.phone}: ${personalizedMessage}`);
          break;
      }
      
      // Record the communication
      this.recordCommunication(communicationData);
      
    } catch (error) {
      console.error(`Error sending ${event.type} communication:`, error);
    }
  }
  
  // Convert internal communication type to dashboard type
  private mapCommunicationType(type: string): 'sms' | 'call' | 'email' | 'voicemail_drop' {
    switch(type) {
      case 'ai_voice_call':
      case 'voicemail_drop':
        return 'call';
      case 'email':
        return 'email';
      case 'sms':
      default:
        return 'sms';
    }
  }
  
  // Record communication in the dashboard
  private recordCommunication(data: CommunicationData): void {
    if (!this.communicationContext) {
      console.error("Communication context not available. Communication not recorded.");
      return;
    }
    
    // Add to communications dashboard
    if (typeof this.communicationContext.recordCommunication === 'function') {
      this.communicationContext.recordCommunication({
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        patientId: data.patientId,
        patientName: data.patientName,
        patientPhone: data.patientPhone || '',
        patientEmail: data.patientEmail,
        type: data.type,
        direction: data.direction,
        content: data.content,
        timestamp: new Date().toISOString(),
        status: data.direction === 'outbound' ? 'sent' : 'received',
        read: data.direction === 'outbound',
        fromSdrAgent: true
      });
    } else {
      console.warn("recordCommunication method not available in communication context");
      console.log("Communication would be recorded:", data);
    }
  }
  
  // Move a prospect to the next campaign
  moveToNextCampaign(prospectId: string, nextCampaignName: string): boolean {
    const prospectRecord = this.prospects.get(prospectId);
    if (!prospectRecord) return false;
    
    const nextCampaign = this.campaigns[nextCampaignName];
    if (!nextCampaign) return false;
    
    // Record history
    prospectRecord.history.push({
      campaign: prospectRecord.currentCampaign,
      timestamp: new Date().toISOString()
    });
    
    // Update to new campaign
    prospectRecord.currentCampaign = nextCampaignName;
    prospectRecord.stage = 0;
    
    this.prospects.set(prospectId, prospectRecord);
    
    // Start first event in new campaign
    this.scheduleNextEvent(prospectId);
    return true;
  }
  
  // Book an appointment for a prospect
  bookAppointment(prospectId: string, message: string): AppointmentRecord | false {
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
    const appointment: AppointmentRecord = {
      id: `apt_${Date.now()}`,
      prospectId: prospectId,
      date: date,
      time: time,
      status: 'scheduled',
      service: 'Enhanced Dental PPO Coverage Consultation'
    };
    
    // Save appointment
    this.appointments.set(appointment.id, appointment);
    
    // Update prospect record
    prospectRecord.data.appointment = appointment;
    prospectRecord.tags.add('appointment_scheduled');
    
    this.prospects.set(prospectId, prospectRecord);
    
    // Send reminders after booking
    this.scheduleAppointmentReminders(prospectId, appointment);
    
    return appointment;
  }
  
  // Schedule all appointment reminders
  private scheduleAppointmentReminders(prospectId: string, appointment: AppointmentRecord): void {
    // Schedule 24-hour reminder
    this.scheduleReminder(prospectId, appointment, '24-hour');
    
    // Schedule 2-hour reminder
    this.scheduleReminder(prospectId, appointment, '2-hour');
    
    // Schedule 15-minute reminder
    this.scheduleReminder(prospectId, appointment, '15-minute');
  }
  
  // Schedule a single reminder
  private scheduleReminder(prospectId: string, appointment: AppointmentRecord, type: string): void {
    const prospectRecord = this.prospects.get(prospectId);
    if (!prospectRecord) return;
    
    // In a real implementation, this would schedule the reminder through a task scheduler
    console.log(`[Reminder] ${type} reminder scheduled for ${prospectId} - ${appointment.date} at ${appointment.time}`);
    
    // Example content for reminders
    let reminderMessage = "";
    
    switch(type) {
      case '24-hour':
        reminderMessage = `Hi ${prospectRecord.data.firstName}, this is a reminder about your appointment tomorrow at ${appointment.time} to discuss Enhanced Dental PPO Coverage options. Please let us know if you need to reschedule.`;
        break;
      case '2-hour':
        reminderMessage = `Hi ${prospectRecord.data.firstName}, your appointment to discuss Enhanced Dental PPO Coverage is coming up in 2 hours at ${appointment.time}. We're looking forward to speaking with you!`;
        break;
      case '15-minute':
        reminderMessage = `Hi ${prospectRecord.data.firstName}, your appointment to discuss Enhanced Dental PPO Coverage is in 15 minutes. We'll be calling you shortly at this number.`;
        break;
    }
    
    // Record the reminder message in Communications Dashboard
    this.recordCommunication({
      patientId: prospectId,
      patientName: `${prospectRecord.data.firstName || ''} ${prospectRecord.data.lastName || ''}`.trim(),
      patientPhone: prospectRecord.data.phone || '',
      patientEmail: prospectRecord.data.email,
      type: 'sms',
      direction: 'outbound',
      content: reminderMessage
    });
  }
  
  // Activate Power Hour for prospects in holding
  activatePowerHour(count: number = 25): number {
    // Move prospects from holding to power hour
    const holdingProspects = [...this.prospects.entries()]
      .filter(([, record]) => record.currentCampaign === 'holding')
      .slice(0, count);
    
    let movedCount = 0;
    for (const [id] of holdingProspects) {
      if (this.moveToNextCampaign(id, 'powerHour')) {
        movedCount++;
      }
    }
    
    console.log(`[Power Hour] Activated for ${movedCount} prospects`);
    return movedCount;
  }
  
  // Check for no-shows and move them to the no-show campaign
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
    
    console.log(`[No-Shows] Processed ${noShows.length} no-shows`);
    return noShows.length;
  }
}

// Types for Campaign Manager
export interface CampaignManagerConfig extends CampaignConfig {
  // Campaign manager-specific config options
  enableScheduling?: boolean;
  reminderIntervals?: number[];
  maxProspectsPerCampaign?: number;
}

export interface ProspectRecord {
  data: PatientData;
  currentCampaign: string;
  stage: number;
  history: {
    campaign: string;
    timestamp: string;
  }[];
  tags: Set<string>;
}

export interface AppointmentRecord {
  id: string;
  prospectId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'no-show' | 'cancelled';
  service: string;
}

export interface ResponseResult {
  action: string;
  reply: string;
  targetCampaign: string | null;
}

export interface CommunicationData {
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  type: 'sms' | 'call' | 'email' | 'voicemail_drop';
  direction: 'inbound' | 'outbound';
  content: string;
}

export interface CommunicationContext {
  sendSMS: (request: { to: string; body: string }) => Promise<void>;
  initiateRetellCall: (request: {
    phoneNumber: string;
    patientInfo: {
      name: string;
      id: string
    }
  }) => Promise<void>;
  recordCommunication: (data: {
    id: string;
    patientId: string;
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    type: 'sms' | 'call' | 'email' | 'voicemail_drop';
    direction: 'inbound' | 'outbound';
    content: string;
    timestamp: string;
    status: 'sent' | 'received' | 'pending' | 'failed';
    read: boolean;
    fromSdrAgent: boolean;
  }) => void;
}