import { 
  AutomationEvent, 
  ResponseHandler, 
  CampaignType, 
  CampaignConfig 
} from '../interfaces/campaign.interfaces';

/**
 * Base Campaign Class
 * 
 * Provides core functionality for all campaign types.
 * All specialized campaign types extend this base class.
 */
export class Campaign {
  /** Unique name identifier for the campaign */
  name: string;
  
  /** Array of communication events in the campaign sequence */
  automationEvents: AutomationEvent[];
  
  /** Handlers for processing prospect responses */
  responseHandlers: ResponseHandler[];
  
  /** The next campaign to move prospects to when this one completes */
  nextCampaign: CampaignType | null;
  
  /** Campaign configuration settings */
  config: CampaignConfig;
  
  /** The name of the dental office */
  officeName: string;

  /**
   * Create a new campaign instance
   * @param config Configuration options
   */
  constructor(config: CampaignConfig = { enabled: true }) {
    this.config = config;
    this.officeName = config.officeName?.toString() || "Bright Smile Dental";
    this.name = "Base Campaign";
    this.nextCampaign = null;
    this.automationEvents = [];
    this.responseHandlers = [];
  }
  
  /**
   * Replace office name placeholder in message
   * @param message Message template with placeholders
   * @returns Processed message with office name replaced
   */
  processMessage(message: string): string {
    return message.replace(/{{OfficeName}}/g, this.officeName);
  }
}