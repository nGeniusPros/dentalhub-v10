import { Campaign } from './base.campaign';
import { CampaignConfig } from '../interfaces/campaign.interfaces';

/**
 * Power Hour Campaign
 * 
 * For intense follow-up with selected holding prospects.
 * This campaign focuses on a high-touch, time-limited approach
 * to convert prospects who have been in the holding campaign.
 */
export class PowerHourCampaign extends Campaign {
  constructor(config: CampaignConfig = { enabled: true }) {
    super(config);
    this.name = "Power Hour";
    this.nextCampaign = "holding";
    
    this.automationEvents = [
      {
        type: "ai_voice_call",
        name: "Urgent Voice Call",
        timing: "immediate",
        message: "Hello {{FirstName}}, this is {{AssigneeFirstName}} with {{OfficeName}}. I'm calling with an urgent opportunity - this month we're offering a special promotion for our Enhanced Dental PPO Coverage with significant savings on all dental procedures. We have only 5 spots remaining in your area, and since you expressed interest previously, I wanted to give you priority access before they're filled. Do you have a moment to discuss how this coverage could benefit you? If now isn't a good time, I have openings today at 2pm, 3pm, or 4pm - would any of those times work for a quick call?"
      },
      {
        type: "sms",
        name: "Limited Time Offer",
        timing: "5_min_after_call",
        message: "Hey {{FirstName}}, I just tried giving you a call. I'm reaching out because we have a limited-time Enhanced Dental PPO Coverage offer available. Only 5 spots left in your area! Would {{wooai}} work for a quick call to secure your coverage before it's gone?"
      }
    ];
    
    this.responseHandlers = [
      {
        keywords: ["yes", "interested", "tell me more", "spots", "offer", "limited"],
        action: "offer_times",
        reply: "Great! Would today at 2pm, 3pm, or 4pm work for a quick call? We need to act fast as these spots are filling quickly!"
      },
      {
        keywords: ["2pm", "3pm", "4pm", "today", "time works"],
        action: "book_appointment",
        reply: "Perfect! You're all set for a call today at {{AppointmentTime}}. I'll give you a call then to secure your Enhanced Dental PPO Coverage. If anything comes up before then, feel free to reach out!"
      },
      {
        keywords: ["no", "not interested", "stop", "unsubscribe"],
        action: "move_campaign",
        targetCampaign: "holding",
        reply: "I understand. If you change your mind about improving your dental coverage, feel free to reach out anytime!"
      }
    ];
  }
}