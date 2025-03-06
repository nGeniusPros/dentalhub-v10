import { Campaign } from './base.campaign';
import { CampaignConfig } from '../interfaces/campaign.interfaces';

/**
 * Cold Offer Campaign
 * 
 * For prospects from cold lists who have been validated.
 * This campaign focuses on converting validated cold leads into scheduled appointments.
 */
export class ColdOfferCampaign extends Campaign {
  constructor(config: CampaignConfig = { enabled: true }) {
    super(config);
    this.name = "Cold Offer";
    this.nextCampaign = "noResponse";
    
    this.automationEvents = [
      {
        type: "sms",
        name: "Initial Offer",
        timing: "09:00 AM",
        message: "Hey {{FirstName}}, {{AssigneeFirstName}} here from {{OfficeName}}. I came across your information and was impressed with your profile. Right now we're helping patients get access to exclusive dental care through our Enhanced PPO program. Would you be interested in saving up to 60% on your dental procedures? We currently have 5-10 spots available in your area."
      },
      {
        type: "ai_voice_call",
        name: "Initial Cold Call",
        timing: "11:00 AM",
        message: "Hello {{FirstName}}, this is {{AssigneeFirstName}} with {{OfficeName}}. I'm calling because we're currently helping patients in your area save up to 60% on dental procedures through our Enhanced PPO program. We have a limited number of spots available and I thought you might be interested. Do you have a moment to discuss how this could benefit you? If now isn't a good time, would tomorrow at 2pm, 3pm, or 4pm work better for a quick call?"
      },
      {
        type: "email",
        name: "Offer Details",
        timing: "10:00 AM",
        subject: "Exclusive Dental Savings Opportunity",
        message: "Hey {{FirstName}}, {{AssigneeFirstName}} here from {{OfficeName}}. I came across your information and thought you might be interested in our Enhanced Dental PPO program. \n\nOur patients are saving an average of 60% on dental procedures with our exclusive network of providers. Right now, we have a limited number of spots available in your area.\n\nWould tomorrow at 2pm, 3pm, or 4pm work for a quick call to discuss how this program could benefit you and your family?"
      }
    ];
    
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
    ];
  }
}