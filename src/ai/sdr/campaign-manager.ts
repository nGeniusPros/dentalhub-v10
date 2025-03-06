import {
  Prospect,
  Appointment,
  ResponseResult,
  ProspectRecord,
  CampaignType,
  CampaignConfig
} from './interfaces/campaign.interfaces';
import { Campaign } from './campaigns/base.campaign';
import { LeadGenerationCampaign } from './campaigns/lead-generation.campaign';
import { NoResponseCampaign } from './campaigns/no-response.campaign';
import { NoShowCampaign } from './campaigns/no-show.campaign';
import { ReEngagementCampaign } from './campaigns/re-engagement.campaign';
import { ListValidationCampaign } from './campaigns/list-validation.campaign';
import { ColdOfferCampaign } from './campaigns/cold-offer.campaign';
import { PowerHourCampaign } from './campaigns/power-hour.campaign';
import { HoldingCampaign } from './campaigns/holding.campaign';

/**
 * Campaign Manager
 * 
 * Orchestrates all campaigns and prospect movement.
 * Manages the flow of prospects through different campaigns
 * based on their interactions and responses.
 */
export class CampaignManager {
  campaigns: Record<CampaignType, Campaign>;
  prospects: Map<string, ProspectRecord>;
  appointments: Map<string, Appointment>;
  config: CampaignConfig;

  constructor(config: CampaignConfig = { enabled: true }) {
    // Set default configuration with customizable office name
    this.config = {
      officeName: "Bright Smile Dental",
      ...config
    };
    
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
  
  /**
   * Add a new prospect to the system
   * @param prospect Prospect information
   * @param campaignName Initial campaign to place prospect in (defaults to list validation)
   * @returns Boolean indicating success
   */
  addProspect(prospect: Prospect, campaignName: CampaignType = "listValidation"): boolean {
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
    this.sendNextEvent(prospect.id);
    return true;
  }
  
  /**
   * Process a response from a prospect
   * @param prospectId ID of the prospect who responded
   * @param message Content of the message from the prospect
   * @returns Response result or null if prospect not found
   */
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
        reply: "Thanks for your response! Would you like to hear more about our Enhanced Dental PPO Coverage options or schedule a quick call?"
      };
    }
    
    // Process the action
    if (matchedHandler.action === "move_campaign" && matchedHandler.targetCampaign) {
      this.moveToNextCampaign(prospectId, matchedHandler.targetCampaign);
    } else if (matchedHandler.action === "book_appointment") {
      this.bookAppointment(prospectId, message);
    }
    
    // Personalize the reply
    const personalizedReply = this.personalizeMessage(matchedHandler.reply, prospectRecord.data);
    
    return {
      action: matchedHandler.action,
      reply: personalizedReply,
      targetCampaign: matchedHandler.targetCampaign || undefined
    };
  }
  
  /**
   * Replace placeholders in a message with prospect-specific data
   * @param message Message template with placeholders
   * @param prospect Prospect data to substitute
   * @returns Personalized message
   */
  personalizeMessage(message: string, prospect: Prospect): string {
    // Replace placeholders with prospect data
    let personalizedMessage = message;
    
    // Basic replacements
    personalizedMessage = personalizedMessage.replace(/{{FirstName}}/g, prospect.firstName || "there");
    personalizedMessage = personalizedMessage.replace(/{{LastName}}/g, prospect.lastName || "");
    personalizedMessage = personalizedMessage.replace(/{{OfficeName}}/g, this.config.officeName?.toString() || "Bright Smile Dental");
    
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
  
  /**
   * Generate time options for appointment scheduling
   * @returns String with formatted time options
   */
  generateTimeOptions(): string {
    // Generate 3 time options for the prospect to choose from
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const dayName = tomorrow.toLocaleDateString('en-US', { weekday: 'long' });
    return `${dayName} at 2pm, 3pm, or 4pm`;
  }
  
  /**
   * Send the next event in a prospect's current campaign
   * @param prospectId ID of the prospect
   * @returns Boolean indicating success
   */
  sendNextEvent(prospectId: string): boolean {
    const prospectRecord = this.prospects.get(prospectId);
    if (!prospectRecord) return false;
    
    const campaign = this.campaigns[prospectRecord.currentCampaign];
    if (!campaign || !campaign.automationEvents || campaign.automationEvents.length === 0) return false;
    
    // Get next event based on stage
    if (prospectRecord.stage >= campaign.automationEvents.length) {
      // End of campaign, move to next campaign if defined
      if (campaign.nextCampaign) {
        this.moveToNextCampaign(prospectId, campaign.nextCampaign as CampaignType);
        return true;
      }
      return false;
    }
    
    const event = campaign.automationEvents[prospectRecord.stage];
    
    // Send the event (in a real system, this would trigger SMS, email, or AI voice calls)
    const personalizedMessage = this.personalizeMessage(event.message, prospectRecord.data);
    
    if (event.type === "ai_voice_call") {
      console.log(`[${campaign.name}] Initiating AI Voice Call to ${prospectRecord.data.firstName} from ${this.config.officeName}: ${personalizedMessage}`);
      // In a real system, this would trigger an AI-powered outbound call
      // The AI would handle the conversation interactively based on prospect responses
    } else {
      console.log(`[${campaign.name}] Sending ${event.type} to ${prospectRecord.data.firstName} from ${this.config.officeName}: ${personalizedMessage}`);
    }
    
    // Update stage
    prospectRecord.stage++;
    this.prospects.set(prospectId, prospectRecord);
    
    // Schedule next event if available
    // In a real system, this would use setTimeout or a task scheduler
    return true;
  }
  
  /**
   * Move a prospect to a different campaign
   * @param prospectId ID of the prospect to move
   * @param nextCampaignName Name of the campaign to move to
   * @returns Boolean indicating success
   */
  moveToNextCampaign(prospectId: string, nextCampaignName: CampaignType): boolean {
    const prospectRecord = this.prospects.get(prospectId);
    if (!prospectRecord) return false;
    
    const nextCampaign = this.campaigns[nextCampaignName];
    if (!nextCampaign) return false;
    
    // Record history
    prospectRecord.history.push({
      campaign: prospectRecord.currentCampaign,
      timestamp: new Date()
    });
    
    // Update to new campaign
    prospectRecord.currentCampaign = nextCampaignName;
    prospectRecord.stage = 0;
    
    this.prospects.set(prospectId, prospectRecord);
    
    // Start first event in new campaign
    this.sendNextEvent(prospectId);
    return true;
  }
  
  /**
   * Book an appointment based on prospect message
   * @param prospectId ID of the prospect
   * @param message Message containing time preference
   * @returns The created appointment or false if failed
   */
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
    const appointment: Appointment = {
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
    
    // Send reminder after booking
    this.sendAppointmentReminders(prospectId, appointment);
    
    return appointment;
  }
  
  /**
   * Send reminders for an upcoming appointment
   * @param prospectId ID of the prospect
   * @param appointment Appointment details
   */
  sendAppointmentReminders(prospectId: string, appointment: Appointment): void {
    // In a real system, these would be scheduled
    // 24-hour reminder
    console.log(`[Reminder] 24-hour reminder scheduled for ${prospectId} on ${appointment.date} at ${appointment.time}`);
    
    // 2-hour reminder
    console.log(`[Reminder] 2-hour reminder scheduled for ${prospectId} for ${appointment.service}`);
    
    // 15-minute reminder
    console.log(`[Reminder] 15-minute reminder scheduled for ${prospectId}, appointment ID: ${appointment.id}`);
  }
  
  /**
   * Activate Power Hour campaign for selected holding prospects
   * @param count Number of prospects to move to power hour
   * @returns Number of prospects moved
   */
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
  
  /**
   * Check for appointments that were missed and move to no-show campaign
   * @returns Number of no-shows processed
   */
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