import { CampaignManager } from './campaign-manager';
import { SdrAiService } from './sdr-ai-service';
import {
  Prospect,
  CampaignType,
  EventType,
  CampaignConfig,
  ResponseResult
} from './interfaces/campaign.interfaces';

/**
 * SDR Agent
 * 
 * Main interface for the Sales Development Representative automation system.
 * This class handles processing incoming messages, scheduling outgoing communications,
 * and managing the flow of prospects through campaign sequences.
 */
export class SdrAgent {
  private campaignManager: CampaignManager;
  private aiService: SdrAiService;
  private messageQueue: Map<string, Array<{type: EventType, content: string, scheduledTime: Date}>>;
  private isProcessing: boolean = false;
  private useAI: boolean = true;

  /**
   * Create a new SDR Agent instance
   * @param config Configuration for the campaign system
   */
  constructor(config: CampaignConfig = { enabled: true }) {
    this.campaignManager = new CampaignManager(config);
    this.aiService = new SdrAiService();
    this.messageQueue = new Map();
    
    // Use AI by default unless explicitly disabled
    this.useAI = config.enableAI !== false;
    
    console.log(`[SDR Agent] Initialized with AI ${this.useAI ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get the campaign manager instance
   * @returns The current campaign manager
   */
  getCampaignManager(): CampaignManager {
    return this.campaignManager;
  }

  /**
   * Add a new prospect to the system
   * @param prospect Prospect information
   * @param initialCampaign The campaign to start the prospect in
   * @returns Success status
   */
  addProspect(prospect: Prospect, initialCampaign: CampaignType = 'listValidation'): boolean {
    console.log(`[SDR Agent] Adding new prospect: ${prospect.firstName} ${prospect.lastName}`);
    return this.campaignManager.addProspect(prospect, initialCampaign);
  }

  /**
   * Process an incoming message from a prospect
   * @param prospectId ID of the sending prospect
   * @param message Content of the message
   * @param forceAI Force using AI for response generation
   * @returns Response message or null if processing failed
   */
  async processIncomingMessage(
    prospectId: string,
    message: string,
    forceAI: boolean = false
  ): Promise<string | null> {
    console.log(`[SDR Agent] Processing message from ${prospectId}: "${message}"`);
    
    // Get the prospect record for context
    const prospectRecord = this.campaignManager.prospects.get(prospectId);
    if (!prospectRecord) {
      console.error(`[SDR Agent] Cannot process message - prospect ${prospectId} not found`);
      return null;
    }
    
    // Try rule-based response first, unless AI is forced
    let response: ResponseResult | null = null;
    if (!forceAI) {
      response = this.campaignManager.processResponse(prospectId, message);
    }
    
    // If no rule-based response or AI is forced, use AI
    if ((!response || response.action === 'default_reply') && (this.useAI || forceAI)) {
      try {
        console.log(`[SDR Agent] Using AI to generate response for ${prospectId}`);
        response = await this.aiService.generateResponse(prospectId, message, prospectRecord);
        
        // Process actions from AI response
        if (response.action === 'move_campaign' && response.targetCampaign) {
          this.campaignManager.moveToNextCampaign(prospectId, response.targetCampaign);
        } else if (response.action === 'book_appointment') {
          this.campaignManager.bookAppointment(prospectId, message);
        }
      } catch (error) {
        console.error(`[SDR Agent] AI response generation failed:`, error);
        // Fall back to default response if AI fails
        response = {
          action: 'default_reply',
          reply: "Thanks for your message! I'd be happy to tell you more about our Enhanced Dental PPO Coverage. Would you prefer a call tomorrow at 2pm, 3pm, or 4pm?"
        };
      }
    }
    
    // If still no response, return null
    if (!response) {
      console.log(`[SDR Agent] No response generated for prospect ${prospectId}`);
      return null;
    }
    
    console.log(`[SDR Agent] Responding with: "${response.reply}"`);
    return response.reply;
  }

  /**
   * Schedule the next communications for all active prospects
   */
  scheduleNextCommunications(): void {
    console.log(`[SDR Agent] Scheduling next communications for all prospects`);
    
    // In a real implementation, this would check all prospects and schedule
    // their next communications based on campaign timing rules
    for (const [prospectId] of this.campaignManager.prospects.entries()) {
      this.campaignManager.sendNextEvent(prospectId);
    }
  }

  /**
   * Process the message queue, sending any scheduled communications
   */
  async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    console.log(`[SDR Agent] Processing message queue`);
    
    try {
      const now = new Date();
      
      // Check each prospect's queue
      for (const [prospectId, messages] of this.messageQueue.entries()) {
        // Find messages scheduled for now or earlier
        const messagesToSend = messages.filter(msg => msg.scheduledTime <= now);
        
        // Send each message
        for (const message of messagesToSend) {
          await this.sendCommunication(prospectId, message.type, message.content);
        }
        
        // Remove sent messages from queue
        this.messageQueue.set(
          prospectId, 
          messages.filter(msg => msg.scheduledTime > now)
        );
      }
    } finally {
      this.isProcessing = false;
    }
  }
  
  /**
   * Send a communication through the appropriate channel
   * @param prospectId Recipient prospect ID
   * @param type Type of communication (sms, email, voice call)
   * @param content Message content
   */
  private async sendCommunication(
    prospectId: string, 
    type: EventType, 
    content: string
  ): Promise<void> {
    const prospect = this.campaignManager.prospects.get(prospectId)?.data;
    if (!prospect) {
      console.error(`[SDR Agent] Cannot send ${type} - prospect ${prospectId} not found`);
      return;
    }
    
    switch (type) {
      case 'sms':
        console.log(`[SDR Agent] Sending SMS to ${prospect.phone}: "${content}"`);
        // In a real implementation, this would call an SMS service
        // await this.smsService.send(prospect.phone, content);
        break;
        
      case 'email':
        console.log(`[SDR Agent] Sending email to ${prospect.email}: "${content}"`);
        // In a real implementation, this would call an email service
        // await this.emailService.send(prospect.email, "Subject", content);
        break;
        
      case 'ai_voice_call':
        console.log(`[SDR Agent] Initiating AI voice call to ${prospect.phone}`);
        // In a real implementation, this would trigger an AI voice call
        // await this.voiceService.initiateCall(prospect.phone, content);
        break;
        
      case 'voicemail_drop':
        console.log(`[SDR Agent] Dropping voicemail to ${prospect.phone}`);
        // In a real implementation, this would send a voicemail
        // await this.voiceService.dropVoicemail(prospect.phone, content);
        break;
        
      default:
        console.error(`[SDR Agent] Unknown communication type: ${type}`);
    }
  }

  /**
   * Process prospects who didn't show up for their appointments
   * @returns Number of no-shows processed
   */
  processNoShows(): number {
    console.log(`[SDR Agent] Processing no-shows`);
    return this.campaignManager.checkNoShows();
  }

  /**
   * Activate Power Hour campaign for selected prospects
   * @param count Number of prospects to include
   * @returns Number of prospects moved to Power Hour
   */
  activatePowerHour(count: number = 25): number {
    console.log(`[SDR Agent] Activating Power Hour for up to ${count} prospects`);
    return this.campaignManager.activatePowerHour(count);
  }
}