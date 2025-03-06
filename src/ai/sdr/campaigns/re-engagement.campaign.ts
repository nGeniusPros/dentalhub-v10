import { Campaign } from './base.campaign';
import { CampaignConfig } from '../interfaces/campaign.interfaces';

/**
 * Re-Engagement Campaign
 * 
 * For leads who haven't engaged in a while.
 * This campaign focuses on reconnecting with prospects who have gone
 * cold after previous engagement attempts.
 */
export class ReEngagementCampaign extends Campaign {
  constructor(config: CampaignConfig = { enabled: true }) {
    super(config);
    this.name = "Re-Engagement";
    this.nextCampaign = "holding";
    
    this.automationEvents = [
      // DAY 1
      {
        type: "email",
        name: "Free to talk",
        timing: "Send after opt in",
        subject: "Free to talk",
        message: "Are you free to talk {{wooai}}?"
      },
      
      // DAY 2
      {
        type: "ai_voice_call",
        name: "Voice Call 1",
        timing: "08:55 AM",
        message: "Hi {{FirstName}}, this is {{AssigneeFirstName}} with {{OfficeName}}. I'm reaching out because I noticed you've shown interest in our Enhanced Dental PPO Coverage in the past. We've recently updated our plans to offer even better savings - up to 60% on major dental procedures. Do you have a couple of minutes to discuss how this could benefit you? If now isn't a good time, would tomorrow at 2pm, 3pm, or 4pm work better for a quick call?"
      },
      {
        type: "sms",
        name: "Are You Interested",
        timing: "09:00 AM",
        message: "Hey {{FirstName}}, I just tried giving you a call to see if you are interested in our no-cost Enhanced PPO Dental Coverage. I'd love to help! Would {{wooai}} be a good time for us to connect?"
      },
      
      // DAY 3
      {
        type: "email",
        name: "Quick Question",
        timing: "10:00 AM",
        subject: "{{FirstName}}, quick question",
        message: "Hey {{FirstName}}, Did you know that achieving the smile of your dreams could be more affordable than you think? Our Enhanced Dental PPO Coverage is here to help with significant savings on all your dental care needs. Would tomorrow at 2pm, 3pm, or 4pm work for a quick call to discuss the benefits?"
      },
      {
        type: "sms",
        name: "Still Interested",
        timing: "10:05 AM",
        message: "Hey {{FirstName}}, I just sent you an email. If you are interested in Enhanced PPO Dental Coverage, I would love to help! Does {{wooai}} work for a quick call?"
      },
      {
        type: "sms",
        name: "Schedule A Call",
        timing: "09:05 AM",
        message: "Hey {{FirstName}}, sorry about that. I think I might have dialed your number by mistake. But I'm trying to see if we can set up a call {{wooai}} to go over your options?"
      },
      
      // DAY 4
      {
        type: "ai_voice_call",
        name: "Voice Call 2",
        timing: "09:00 AM",
        message: "Hi {{FirstName}}, it's {{AssigneeFirstName}} from {{OfficeName}} calling again about our Enhanced Dental PPO Coverage. I wanted to let you know that we're extending our special offer for just a few more days. This is a limited-time opportunity to secure better dental coverage at significantly reduced rates. I have a few spots available tomorrow at 2pm, 3pm, or 4pm - would any of those times work for a quick call to discuss how this could benefit you?"
      },
      
      // DAY 5
      {
        type: "email",
        name: "Did You Know",
        timing: "02:00 PM",
        subject: "{{FirstName}}, Did you know",
        message: "Hey {{FirstName}}, Did you know that achieving the smile of your dreams could be more affordable than you think? Our Enhanced Dental PPO Coverage is here to help with benefits like:\n\n• 100% coverage on preventive care\n• Up to 80% coverage on basic procedures\n• Up to 50% coverage on major procedures\n\nWould tomorrow at 2pm, 3pm, or 4pm work for a quick call to discuss these benefits?"
      },
      
      // DAY 6
      {
        type: "sms",
        name: "Free This Evening?",
        timing: "12:00 PM",
        message: "Hey {{FirstName}}, I hope all is well. Are you free to talk {{wooai}}?"
      },
      {
        type: "email",
        name: "No Luck",
        timing: "08:00 PM",
        subject: "{{FirstName}}",
        message: "Hey {{FirstName}}, I have been trying to get a hold of you for a while but have had no luck. If you are no longer interested in our services, please let me know. I love helping people improve their dental health and would still be happy to discuss how our Enhanced Dental PPO Coverage can benefit you. If you're interested, let's set up a call. I have availability tomorrow at 2pm, 3pm, or 4pm. Does any of those times work for you?"
      }
    ];
    
    this.responseHandlers = [
      {
        keywords: ["yes", "interested", "tell me more", "information"],
        action: "offer_times",
        reply: "Great! Would tomorrow at 2pm, 3pm, or 4pm work for a quick call to discuss our Enhanced Dental PPO Coverage options?"
      },
      {
        keywords: ["2pm", "3pm", "4pm", "tomorrow", "time works"],
        action: "book_appointment",
        reply: "Perfect! You're all set for a call on {{AppointmentDate}} at {{AppointmentTime}}. I'll give you a call then to discuss your Enhanced Dental PPO Coverage options. If anything comes up before then, feel free to reach out!"
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