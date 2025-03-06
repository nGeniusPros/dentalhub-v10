import { CampaignConfig, CampaignType, Prospect } from './interfaces/campaign.interfaces';

/**
 * SDR Agent - Sales Development Representative AI Agent
 * Handles automated communications for dental practice leads
 */
export class SdrAgent {
  private campaignManager: {
    campaigns: Record<CampaignType, {
      name: string;
      nextCampaign: CampaignType | null;
      automationEvents: Array<{
        type: string;
        name: string;
        timing: string;
        message: string;
      }>;
      responseHandlers: Array<{
        keywords: string[];
        action: string;
        reply: string;
        targetCampaign?: CampaignType;
      }>;
    }>;
  };
  private config: CampaignConfig;

  constructor(config: CampaignConfig) {
    this.config = {
      ...config,
      officeName: config.officeName || "Bright Smile Dental"
    };
    
    // Initialize campaign manager (mock implementation for now)
    this.campaignManager = {
      campaigns: {
        leadGeneration: {
          name: "Lead Generation",
          nextCampaign: "noResponse",
          automationEvents: [
            {
              type: "sms",
              name: "Thank You",
              timing: "send_after_opt_in",
              message: "Hey {{FirstName}}, this is {{AssigneeFirstName}} with {{OfficeName}}. I thought following up by text might be easier for you. Thanks for filling out our form for Enhanced Dental PPO Coverage! 😊"
            }
          ],
          responseHandlers: []
        },
        noResponse: {
          name: "No Response",
          nextCampaign: "reEngagement",
          automationEvents: [],
          responseHandlers: []
        },
        noShow: {
          name: "No Show",
          nextCampaign: "reEngagement",
          automationEvents: [],
          responseHandlers: []
        },
        reEngagement: {
          name: "Re-Engagement",
          nextCampaign: "holding",
          automationEvents: [],
          responseHandlers: []
        },
        listValidation: {
          name: "List Validation",
          nextCampaign: "coldOffer",
          automationEvents: [],
          responseHandlers: []
        },
        coldOffer: {
          name: "Cold Offer",
          nextCampaign: "noResponse",
          automationEvents: [],
          responseHandlers: []
        },
        powerHour: {
          name: "Power Hour",
          nextCampaign: "holding",
          automationEvents: [],
          responseHandlers: []
        },
        holding: {
          name: "Holding",
          nextCampaign: null,
          automationEvents: [],
          responseHandlers: []
        }
      }
    };
  }

  /**
   * Get the campaign manager instance
   */
  public getCampaignManager() {
    return this.campaignManager;
  }

  /**
   * Add a new prospect to the system
   */
  public addProspect(prospect: Prospect, campaignName: CampaignType = 'listValidation') {
    console.log(`Adding prospect ${prospect.firstName} to campaign ${campaignName}`);
    return true;
  }

  /**
   * Process a response from a prospect
   */
  public processResponse(prospectId: string, message: string) {
    console.log(`Processing response from prospect ${prospectId}: ${message}`);
    return {
      action: 'default_reply' as const,
      reply: 'Thank you for your response!'
    };
  }

  /**
   * Activate the Power Hour campaign for prospects in holding
   */
  public activatePowerHour(count: number = 25) {
    console.log(`Activating Power Hour for ${count} prospects`);
    return count;
  }

  /**
   * Process no-shows and move them to the no-show campaign
   */
  public processNoShows() {
    console.log('Processing no-shows');
    return 0;
  }

  /**
   * Update the agent configuration
   */
  public updateConfig(config: Partial<CampaignConfig>) {
    this.config = {
      ...this.config,
      ...config
    };
    return this.config;
  }
}