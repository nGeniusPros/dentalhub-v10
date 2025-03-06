import { Campaign } from './base.campaign';
import { CampaignConfig } from '../interfaces/campaign.interfaces';

/**
 * Holding Campaign
 * 
 * Simple storage campaign for inactive prospects.
 * This campaign serves as a holding area for prospects who are not
 * currently active in other campaigns but may be reactivated later.
 */
export class HoldingCampaign extends Campaign {
  constructor(config: CampaignConfig = { enabled: true }) {
    super(config);
    this.name = "Holding";
    this.nextCampaign = null;
    
    // No automated messages - this is a holding area for prospects
    this.automationEvents = [];
    
    this.responseHandlers = [
      {
        keywords: ["yes", "interested", "tell me more"],
        action: "move_campaign",
        targetCampaign: "reEngagement",
        reply: "Great to hear from you! I'd be happy to tell you more about our Enhanced Dental PPO Coverage options. Would tomorrow at 2pm, 3pm, or 4pm work for a quick call?"
      }
    ];
  }
}