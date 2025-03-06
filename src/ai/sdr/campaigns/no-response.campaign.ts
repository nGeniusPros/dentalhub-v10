import { Campaign } from './base.campaign';
import { CampaignConfig } from '../interfaces/campaign.interfaces';

/**
 * No Response Campaign
 * 
 * For leads who didn't respond to the initial outreach.
 * This campaign focuses on re-engaging prospects who showed
 * initial interest but didn't respond to follow-ups.
 */
export class NoResponseCampaign extends Campaign {
  constructor(config: CampaignConfig = { enabled: true }) {
    super(config);
    this.name = "No Response";
    this.nextCampaign = "reEngagement";
    
    this.automationEvents = [
      // DAY 1
      {
        type: "sms",
        name: "Checking Back In",
        timing: "09:00 AM",
        message: "Hey {{FirstName}}, I wanted to check back in with you regarding Enhanced Dental PPO Coverage. I'd love to help! Would {{wooai}} work to discuss?"
      },
      {
        type: "ai_voice_call",
        name: "Voice Call 1",
        timing: "09:00 AM",
        message: "Hi {{FirstName}}, this is {{AssigneeFirstName}} with {{OfficeName}}. I'm calling to follow up on our Enhanced Dental PPO Coverage. Many of our members are saving up to 60% on their dental procedures with our plan. I wanted to see if you have any questions I could answer. Would now be a good time to chat for a few minutes? If not, would tomorrow at 2pm, 3pm, or 4pm work better for a quick call?"
      },
      
      // DAY 2
      {
        type: "sms",
        name: "What time works well",
        timing: "10:00 AM",
        message: "Hey {{FirstName}}, just checking back in. Does {{wooai}} work well for us to discuss Enhanced Dental PPO Coverage?"
      },
      {
        type: "email",
        name: "Still Interested",
        timing: "07:00 PM",
        subject: "{{FirstName}}, checking back in",
        message: "Hey {{FirstName}}, just wanted to follow up with you regarding Enhanced Dental PPO Coverage. Did you know dental PPO coverage hasn't increased since 2016? I'd be happy to explain how our enhanced coverage can save you money while providing better care. Does tomorrow at 2pm, 3pm, or 4pm work for a call?"
      },
      
      // DAY 3
      {
        type: "sms",
        name: "Are you still looking",
        timing: "12:30 PM",
        message: "Hey {{FirstName}}. I hope your day is going well. Are you still looking for Enhanced Dental PPO Coverage? Always happy to hear from you. 😊"
      },
      {
        type: "email",
        name: "Does Tomorrow Work",
        timing: "08:30 PM",
        subject: "{{FirstName}}, does tomorrow work?",
        message: "Hey {{FirstName}}, You made a smart decision reaching out to us. Will {{wooai}} work to talk about Enhanced Dental PPO Coverage? Please let me know."
      },
      
      // DAY 4
      {
        type: "sms",
        name: "Free to talk",
        timing: "06:30 PM",
        message: "Hey {{FirstName}}, haven't heard back. Are you free to talk {{wooai}}?"
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