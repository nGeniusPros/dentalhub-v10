import { Campaign } from './base.campaign';
import { CampaignConfig } from '../interfaces/campaign.interfaces';

/**
 * No Show Campaign
 * 
 * For leads who booked but didn't show up for their appointment.
 * This campaign focuses on re-engaging missed appointments and 
 * converting them into rescheduled appointments.
 */
export class NoShowCampaign extends Campaign {
  constructor(config: CampaignConfig = { enabled: true }) {
    super(config);
    this.name = "No Show";
    this.nextCampaign = "reEngagement";
    
    this.automationEvents = [
      // DAY 1
      {
        type: "ai_voice_call",
        name: "Voice Call 1",
        timing: "08:55 AM",
        message: "Hi {{FirstName}}, this is {{AssigneeFirstName}} with {{OfficeName}}. I'm calling about our scheduled appointment that we missed yesterday regarding your Enhanced Dental PPO Coverage. I wanted to check if everything's okay and see if we could reschedule. My schedule is still open tomorrow at 2pm, 3pm, or 4pm - would any of those times work for you? I'm looking forward to sharing how our enhanced coverage can save you money."
      },
      {
        type: "sms",
        name: "Missed You",
        timing: "09:00 AM",
        message: "Hey {{FirstName}}, {{AssigneeFirstName}} here. Just following up on your missed appointment for Enhanced Dental PPO Coverage call. Does {{wooai}} work to give you a quick call?"
      },
      
      // DAY 2
      {
        type: "email",
        name: "Should We Reschedule",
        timing: "10:00 AM",
        subject: "{{FirstName}}, should we reschedule?",
        message: "Hey {{FirstName}}, {{AssigneeFirstName}} here. Just following up on your missed call for Enhanced Dental PPO Coverage. Does {{wooai}} work for us to reschedule? I still have some availability this week."
      },
      {
        type: "sms",
        name: "What Day?",
        timing: "12:00 PM",
        message: "Hey {{FirstName}}, sorry we missed you! Would tomorrow at 2pm, 3pm, or 4pm work for you to reschedule your Enhanced Dental PPO Coverage call?"
      },
      
      // DAY 3
      {
        type: "voicemail_drop",
        name: "VM 2",
        timing: "09:00 AM",
        message: "Hey {{FirstName}}, it's {{AssigneeFirstName}} with {{OfficeName}}. I'm just following up one more time about your Enhanced Dental PPO Coverage appointment that you missed. We're still holding your spot, but I wanted to let you know that our schedule is filling up quickly. If you'd like to reschedule, please give me a call back at {{AccountPhoneNumber}}."
      },
      {
        type: "sms",
        name: "Holding Back",
        timing: "05:00 PM",
        message: "Hey {{FirstName}}, is there anything holding you back? Can we reschedule for {{wooai}}?"
      },
      
      // DAY 4
      {
        type: "email",
        name: "Keep It Open?",
        timing: "08:00 PM",
        subject: "{{FirstName}}, should I keep your spot?",
        message: "Hey {{FirstName}}, Appointments are filling up and I wanted to reach out to you one last time. Is there anything holding you back from using our Enhanced Dental PPO Coverage? I have openings tomorrow at 2pm, 3pm, or 4pm. Does any of those times work for you?"
      }
    ];
    
    this.responseHandlers = [
      {
        keywords: ["yes", "reschedule", "book", "appointment"],
        action: "offer_times",
        reply: "Great! Would tomorrow at 2pm, 3pm, or 4pm work for your rescheduled appointment?"
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