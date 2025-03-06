import { Campaign } from './base.campaign';
import { CampaignConfig } from '../interfaces/campaign.interfaces';

/**
 * Lead Generation Campaign
 * 
 * For new leads who filled out a form or showed initial interest.
 * This campaign focuses on converting initial interest into scheduled appointments.
 */
export class LeadGenerationCampaign extends Campaign {
  constructor(config: CampaignConfig = { enabled: true }) {
    super(config);
    this.name = "Lead Generation";
    this.nextCampaign = "noResponse";
    
    this.automationEvents = [
      // DAY CONTACT OPTS IN
      {
        type: "sms",
        name: "Thank You",
        timing: "send_after_opt_in",
        message: "Hey {{FirstName}}, this is {{AssigneeFirstName}} with {{OfficeName}}. I thought following up by text might be easier for you. Thanks for filling out our form for Enhanced Dental PPO Coverage! 😊"
      },
      {
        type: "email",
        name: "Covering My Bases",
        timing: "send_5_min_after_opt_in",
        subject: "{{FirstName}}, Thanks for your inquiry",
        message: "Hey {{FirstName}}, this is {{AssigneeFullName}} with {{OfficeName}}. I wanted to cover all my communication bases with you today. I hope you don't mind.\n\nThanks for your interest in our Enhanced Dental PPO Coverage. Would tomorrow at 2pm, 3pm, or 4pm work for a quick call to discuss how this could benefit you?"
      },
      
      // DAY 1
      {
        type: "ai_voice_call",
        name: "Voice Call 1",
        timing: "09:00 AM",
        message: "Hi {{FirstName}}, this is {{AssigneeFirstName}} with {{OfficeName}}. I'm calling about your recent inquiry regarding our Enhanced Dental PPO Coverage. I'd love to tell you about the exclusive benefits and savings available to you. Is now a good time to talk for a few minutes about how we can help improve your dental coverage? If not, would tomorrow at 2pm, 3pm, or 4pm work better for a quick call?"
      },
      {
        type: "sms",
        name: "Checking In",
        timing: "09:30 AM",
        message: "Hey {{FirstName}}. I just tried giving you a call. I wanted to check back in with you regarding Enhanced Dental PPO Coverage. I'd love to help! Would {{wooai}} be a good time for us to connect?"
      },
      
      // DAY 2
      {
        type: "email",
        name: "Checking Back In",
        timing: "10:00 AM",
        subject: "{{FirstName}}, Checking In",
        message: "Hey {{FirstName}}, Just wanted to follow up with you regarding Enhanced Dental PPO Coverage. Our plan can unlock exclusive dental benefits including:\n\n• 100% coverage for preventive care\n• Lower out-of-pocket costs\n• No waiting periods\n\nWould tomorrow at 2pm, 3pm, or 4pm work for a quick call to discuss?"
      },
      {
        type: "sms",
        name: "What Time Works Well",
        timing: "12:00 PM",
        message: "Hey {{FirstName}}, are you looking to get Enhanced Dental PPO Coverage? Schedule an appointment with us to discuss how Enhanced Dental PPO Coverage can unlock exclusive benefits. Does {{wooai}} work for a quick call?"
      },
      
      // DAY 3
      {
        type: "sms",
        name: "Still Looking",
        timing: "05:00 PM",
        message: "Hey {{FirstName}}. I hope your day is going well! Are you still looking for Enhanced Dental PPO Coverage? I am always happy to hear from you. 😊"
      },
      {
        type: "email",
        name: "Does Tomorrow Work",
        timing: "08:00 PM",
        subject: "{{FirstName}}, does tomorrow work?",
        message: "Hey {{FirstName}}, Are you looking to get Enhanced Dental PPO Coverage? Schedule an appointment with us to discuss how Enhanced Dental PPO Coverage can save you money while providing better dental care. Does tomorrow at 2pm, 3pm, or 4pm work for a quick call?"
      },
      
      // DAY 4
      {
        type: "ai_voice_call",
        name: "Voice Call 2",
        timing: "04:00 PM",
        message: "Hi {{FirstName}}, it's {{AssigneeFirstName}} again with {{OfficeName}}. I'm following up about the Enhanced Dental PPO Coverage we discussed. I wanted to let you know that spots are filling up quickly, and I wanted to make sure you have the opportunity to enroll before they're gone. Would you be interested in discussing this further? I have openings tomorrow at 2pm, 3pm, or 4pm - would any of those times work for a quick call?"
      },
      
      // DAY 5
      {
        type: "email",
        name: "Last Chance",
        timing: "06:30 PM",
        subject: "{{FirstName}}, last chance",
        message: "Hey {{FirstName}}, I hate to be a pest, but I wanted to follow up one last time. Are you free to talk {{wooai}}? {{AssigneeFullName}} {{AccountPhoneNumber}}"
      },
      {
        type: "sms",
        name: "One Last Time",
        timing: "10:00 AM",
        message: "Hey {{FirstName}}, please forgive me for being persistent, but I wanted to follow up one last time. Are you free to talk {{wooai}}?"
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