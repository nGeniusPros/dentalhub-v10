/**
 * Dental Practice Campaign Automations
 * 
 * Implementation of WooSender-style campaign automations for a dental practice
 * to drive prospects toward booking appointments.
 */

// ==========================================================
// BASE CAMPAIGN CLASS
// ==========================================================
export class Campaign {
  config: CampaignConfig;
  officeName: string;
  name: string = 'Base Campaign';
  nextCampaign: string | null = null;
  automationEvents: AutomationEvent[] = [];
  responseHandlers: ResponseHandler[] = [];
  
  constructor(config: CampaignConfig = {}) {
    this.config = config;
    this.officeName = config.officeName || "Bright Smile Dental";
  }
  
  // Replace office name placeholder in message
  processMessage(message: string): string {
    return message.replace(/{{OfficeName}}/g, this.officeName);
  }
}

// ==========================================================
// LEAD GENERATION CAMPAIGN
// For new leads who filled out a form or showed initial interest
// ==========================================================
export class LeadGenerationCampaign extends Campaign {
  constructor(config: CampaignConfig = {}) {
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

// ==========================================================
// NO RESPONSE CAMPAIGN
// For leads who didn't respond to the initial outreach
// ==========================================================
export class NoResponseCampaign extends Campaign {
  constructor(config: CampaignConfig = {}) {
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

// ==========================================================
// NO SHOW CAMPAIGN
// For leads who booked but didn't show up for their appointment
// ==========================================================
export class NoShowCampaign extends Campaign {
  constructor(config: CampaignConfig = {}) {
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

// ==========================================================
// RE-ENGAGEMENT CAMPAIGN
// For leads who haven't engaged in a while
// ==========================================================
export class ReEngagementCampaign extends Campaign {
  constructor(config: CampaignConfig = {}) {
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

// ==========================================================
// LIST VALIDATION CAMPAIGN
// For validating contact information from cold lists
// ==========================================================
export class ListValidationCampaign extends Campaign {
  constructor(config: CampaignConfig = {}) {
    super(config);
    this.name = "List Validation";
    this.nextCampaign = "coldOffer";
    this.automationEvents = [
      // Day contact opts in
      {
        type: "sms",
        name: "Confirm their name SMS",
        timing: "Send after opt in",
        message: "Hey is this {{FirstName}}? Are you there? Is this {{FirstName}}'s number?"
      },
      
      // Day 1
      {
        type: "email",
        name: "Is this your email?",
        timing: "06:00 AM",
        subject: "{{FirstName}}, quick question",
        message: "Hey {{FirstName}}, I hope this email finds you well. I'm currently working with dental patients to help them with a cosmetic dental grant. Why consider a cosmetic dental grant? It can provide significant savings on procedures like veneers, crowns, and implants. Is this your current email address?"
      },
      
      // Day 2
      {
        type: "email",
        name: "Did You Get This",
        timing: "10:00 AM",
        subject: "{{FirstName}}, Did you get this?",
        message: "Hey {{FirstName}}, I hope this email finds you well. I'm currently working with patients on helping them with cosmetic dental grants. Why consider cosmetic dental treatment? It can significantly improve your confidence and overall appearance. Did you receive my previous message?"
      },
      {
        type: "ai_voice_call",
        name: "Verification Call",
        timing: "12:00 PM",
        message: "Hello, I'm calling for {{FirstName}}. This is {{AssigneeFirstName}} with {{OfficeName}}. We're reaching out to eligible individuals in your area about our cosmetic dental grant program. I just need to verify that I'm speaking with {{FirstName}}. Is this {{FirstName}}? [If yes] Great! I'll send you some information about our dental grant program shortly that could help you save significantly on cosmetic dental procedures. [If no] I apologize for the confusion. Thank you for your time."
      },
      
      // Day 3
      {
        type: "email",
        name: "Are You Still",
        timing: "08:00 AM",
        subject: "{{FirstName}}?",
        message: "Hey {{FirstName}}, I hope this email finds you well. I'm currently working with dental patients on helping them with cosmetic dental grants. Why consider cosmetic dental treatments? Because a beautiful smile can open doors both personally and professionally."
      },
      {
        type: "sms",
        name: "Compliance Text Message",
        timing: "05:00 PM",
        message: "Hey, this is {{AssigneeFullName}} with {{OfficeName}}. Is this {{FirstName}}? If this is not, please respond back with NO."
      }
    ];
    
    this.responseHandlers = [
      {
        keywords: ["yes", "yeah", "correct", "speaking", "this is", "right"],
        action: "move_campaign",
        targetCampaign: "coldOffer",
        reply: "Great! Thanks for confirming. I'll send you some information about our dental services shortly."
      },
      {
        keywords: ["no", "wrong", "not", "who", "not me"],
        action: "mark_invalid",
        reply: "I apologize for the confusion. I'll update our records. Have a great day!"
      }
    ];
  }
}

// ==========================================================
// COLD OFFER CAMPAIGN
// For prospects from cold lists who have been validated
// ==========================================================
export class ColdOfferCampaign extends Campaign {
  constructor(config: CampaignConfig = {}) {
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
        timing: "02:00 PM",
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

// ==========================================================
// POWER HOUR CAMPAIGN
// For intense follow-up with selected holding prospects
// ==========================================================
export class PowerHourCampaign extends Campaign {
  constructor(config: CampaignConfig = {}) {
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

// ==========================================================
// HOLDING CAMPAIGN
// Simple storage campaign for inactive prospects
// ==========================================================
export class HoldingCampaign extends Campaign {
  constructor(config: CampaignConfig = {}) {
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

// ==========================================================
// CAMPAIGN MANAGER
// Orchestrates all campaigns and prospect movement
// ==========================================================
export class CampaignManager {
  campaigns: Record<string, Campaign>;
  prospects: Map<string, ProspectRecord>;
  appointments: Map<string, Appointment>;

  constructor(config: CampaignConfig = {}) {
    // Set default configuration with customizable office name
    const mergedConfig = {
      officeName: "Bright Smile Dental",
      ...config
    };
    
    this.campaigns = {
      leadGeneration: new LeadGenerationCampaign(mergedConfig),
      noResponse: new NoResponseCampaign(mergedConfig),
      noShow: new NoShowCampaign(mergedConfig),
      reEngagement: new ReEngagementCampaign(mergedConfig),
      listValidation: new ListValidationCampaign(mergedConfig),
      coldOffer: new ColdOfferCampaign(mergedConfig),
      powerHour: new PowerHourCampaign(mergedConfig),
      holding: new HoldingCampaign(mergedConfig)
    };
    
    this.prospects = new Map<string, ProspectRecord>();
    this.appointments = new Map<string, Appointment>();
  }
  
  addProspect(prospect: PatientData, campaignName: string = "listValidation"): boolean {
    // Determine appropriate starting campaign based on lead source
    const campaign = this.campaigns[campaignName];
    if (!campaign) return false;
    
    // Add to prospect tracking
    this.prospects.set(prospect.id, {
      data: prospect,
      currentCampaign: campaignName,
      stage: 0,
      history: [],
      tags: new Set<string>()
    });
    
    // Start first campaign event
    this.sendNextEvent(prospect.id);
    return true;
  }
  
  processResponse(prospectId: string, message: string): ResponseResult | null {
    const prospectRecord = this.prospects.get(prospectId);
    if (!prospectRecord) return null;
    
    const campaign = this.campaigns[prospectRecord.currentCampaign];
    if (!campaign) return null;
    
    // Find matching response handler
    let matchedHandler: ResponseHandler | null = null;
    for (const handler of campaign.responseHandlers) {
      const matches = handler.keywords.some(keyword => 
        message.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (matches) {
        matchedHandler = handler;
        break;
      }
    }
    
    // Use default handler if no match
    if (!matchedHandler) {
      return {
        action: "default_reply",
        reply: "Thanks for your response! Would you like to hear more about our Enhanced Dental PPO Coverage options or schedule a quick call?"
      };
    }
    
    // Process the action
    if (matchedHandler.action === "move_campaign" && matchedHandler.targetCampaign) {
      this.moveToNextCampaign(prospectId, matchedHandler.targetCampaign);
    } else if (matchedHandler.action === "book_appointment") {
      this.bookAppointment(prospectId, message);
    }
    
    // Personalize the reply
    const personalizedReply = this.personalizeMessage(matchedHandler.reply, prospectRecord.data);
    
    return {
      action: matchedHandler.action,
      reply: personalizedReply,
      targetCampaign: matchedHandler.targetCampaign || null
    };
  }
  
  personalizeMessage(message: string, prospect: PatientData): string {
    // Replace placeholders with prospect data
    let personalizedMessage = message;
    
    // Basic replacements
    personalizedMessage = personalizedMessage.replace(/{{FirstName}}/g, prospect.firstName || "there");
    personalizedMessage = personalizedMessage.replace(/{{LastName}}/g, prospect.lastName || "");
    personalizedMessage = personalizedMessage.replace(/{{OfficeName}}/g, this.campaigns.leadGeneration.officeName || "Bright Smile Dental");
    
    // WooAI time suggestion (dynamic time options - typically 3 choices)
    if (personalizedMessage.includes("{{wooai}}")) {
      const timeOptions = this.generateTimeOptions();
      personalizedMessage = personalizedMessage.replace(/{{wooai}}/g, timeOptions);
    }
    
    // Appointment details if available
    if (prospect.appointment) {
      personalizedMessage = personalizedMessage.replace(/{{AppointmentDate}}/g, prospect.appointment.date || "tomorrow");
      personalizedMessage = personalizedMessage.replace(/{{AppointmentTime}}/g, prospect.appointment.time || "the scheduled time");
    }
    
    // Replace representation fields if needed
    personalizedMessage = personalizedMessage.replace(/{{AssigneeFirstName}}/g, prospect.assigneeFirstName || "Your representative");
    personalizedMessage = personalizedMessage.replace(/{{AssigneeFullName}}/g, prospect.assigneeFullName || "Your representative");
    personalizedMessage = personalizedMessage.replace(/{{AccountPhoneNumber}}/g, prospect.accountPhone || "");
    
    return personalizedMessage;
  }
  
  generateTimeOptions(): string {
    // Generate 3 time options for the prospect to choose from
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const dayName = tomorrow.toLocaleDateString('en-US', { weekday: 'long' });
    return `${dayName} at 2pm, 3pm, or 4pm`;
  }
  
  sendNextEvent(prospectId: string): boolean {
    const prospectRecord = this.prospects.get(prospectId);
    if (!prospectRecord) return false;
    
    const campaign = this.campaigns[prospectRecord.currentCampaign];
    if (!campaign || !campaign.automationEvents || campaign.automationEvents.length === 0) return false;
    
    // Get next event based on stage
    if (prospectRecord.stage >= campaign.automationEvents.length) {
      // End of campaign, move to next campaign if defined
      if (campaign.nextCampaign) {
        this.moveToNextCampaign(prospectId, campaign.nextCampaign);
        return true;
      }
      return false;
    }
    
    const event = campaign.automationEvents[prospectRecord.stage];
    
    // Send the event (in a real system, this would trigger SMS, email, or AI voice calls)
    const personalizedMessage = this.personalizeMessage(event.message, prospectRecord.data);
    
    if (event.type === "ai_voice_call") {
      console.log(`[${campaign.name}] Initiating AI Voice Call to ${prospectRecord.data.firstName} from ${campaign.officeName}: ${personalizedMessage}`);
      // In a real system, this would trigger an AI-powered outbound call
      // The AI would handle the conversation interactively based on prospect responses
    } else {
      console.log(`[${campaign.name}] Sending ${event.type} to ${prospectRecord.data.firstName} from ${campaign.officeName}: ${personalizedMessage}`);
    }
    
    // Update stage
    prospectRecord.stage++;
    this.prospects.set(prospectId, prospectRecord);
    
    // Schedule next event if available
    // In a real system, this would use setTimeout or a task scheduler
    return true;
  }
  
  moveToNextCampaign(prospectId: string, nextCampaignName: string): boolean {
    const prospectRecord = this.prospects.get(prospectId);
    if (!prospectRecord) return false;
    
    const nextCampaign = this.campaigns[nextCampaignName];
    if (!nextCampaign) return false;
    
    // Record history
    prospectRecord.history.push({
      campaign: prospectRecord.currentCampaign,
      timestamp: new Date()
    });
    
    // Update to new campaign
    prospectRecord.currentCampaign = nextCampaignName;
    prospectRecord.stage = 0;
    
    this.prospects.set(prospectId, prospectRecord);
    
    // Start first event in new campaign
    this.sendNextEvent(prospectId);
    return true;
  }
  
  bookAppointment(prospectId: string, message: string): Appointment | false {
    const prospectRecord = this.prospects.get(prospectId);
    if (!prospectRecord) return false;
    
    // Extract time from message (basic implementation)
    let time = "3:00 PM"; // Default time
    if (message.includes("2pm") || message.includes("2 pm")) {
      time = "2:00 PM";
    } else if (message.includes("4pm") || message.includes("4 pm")) {
      time = "4:00 PM";
    }
    
    // Set date to tomorrow
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const date = tomorrow.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    
    // Create appointment
    const appointment: Appointment = {
      id: `apt_${Date.now()}`,
      prospectId: prospectId,
      date: date,
      time: time,
      status: 'scheduled',
      service: 'Enhanced Dental PPO Coverage Consultation'
    };
    
    // Save appointment
    this.appointments.set(appointment.id, appointment);
    
    // Update prospect record
    prospectRecord.data.appointment = appointment;
    prospectRecord.tags.add('appointment_scheduled');
    
    this.prospects.set(prospectId, prospectRecord);
    // Send reminder after booking
    this.sendAppointmentReminders(prospectId);
    this.sendAppointmentReminders(prospectId, appointment);
    
    return appointment;
  }
  
  sendAppointmentReminders(prospectId: string): void {
    // In a real system, these would be scheduled
    // 24-hour reminder
    console.log(`[Reminder] 24-hour reminder scheduled for ${prospectId}`);
    
    // 2-hour reminder
    console.log(`[Reminder] 2-hour reminder scheduled for ${prospectId}`);
    
    // 15-minute reminder
    console.log(`[Reminder] 15-minute reminder scheduled for ${prospectId}`);
  }
  
  activatePowerHour(count: number = 25): number {
    // Move prospects from holding to power hour
    const holdingProspects = [...this.prospects.entries()]
      .filter(([_, record]) => record.currentCampaign === 'holding')
      .slice(0, count);
    
    let movedCount = 0;
    for (const [id, _] of holdingProspects) {
      if (this.moveToNextCampaign(id, 'powerHour')) {
        movedCount++;
      }
    }
    
    console.log(`[Power Hour] Activated for ${movedCount} prospects`);
    return movedCount;
  }
  
  checkNoShows(): number {
    // Find appointments that were missed
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const noShows = [...this.appointments.values()]
      .filter(apt => {
        const aptDate = new Date(apt.date);
        return (
          apt.status === 'scheduled' &&
          aptDate < yesterday
        );
      });
    
    // Move no-shows to the no-show campaign
    for (const appointment of noShows) {
      appointment.status = 'no-show';
      this.appointments.set(appointment.id, appointment);
      
      this.moveToNextCampaign(appointment.prospectId, 'noShow');
    }
    
    console.log(`[No-Shows] Processed ${noShows.length} no-shows`);
    return noShows.length;
  }
}

// Types
export interface CampaignConfig {
  officeName?: string;
  enabled?: boolean;
  representationType?: 'office' | 'provider' | 'team';
  providerName?: string;
  providerRole?: string;
  providerFirstName?: string;
  providerLastName?: string;
  [key: string]: unknown;
}

export interface PatientData {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  accountPhone?: string;
  assigneeFirstName?: string;
  assigneeFullName?: string;
  appointment?: Appointment;
  [key: string]: unknown;
}

export interface AutomationEvent {
  type: 'sms' | 'email' | 'ai_voice_call' | 'voicemail_drop';
  name: string;
  timing: string;
  message: string;
  subject?: string;
}

export interface ResponseHandler {
  keywords: string[];
  action: 'offer_times' | 'book_appointment' | 'move_campaign' | 'mark_invalid' | 'default_reply';
  reply: string;
  targetCampaign?: string;
}

export interface Appointment {
  id: string;
  prospectId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'no-show' | 'cancelled';
  service: string;
}

export interface ProspectRecord {
  data: PatientData;
  currentCampaign: string;
  stage: number;
  history: CampaignHistory[];
  tags: Set<string>;
}

export interface CampaignHistory {
  campaign: string;
  timestamp: Date;
}

export interface ResponseResult {
  action: string;
  reply: string;
  targetCampaign?: string | null;
}

// Example usage function - can be uncommented for testing
/*
function runExample() {
  // Create campaign manager with custom office name
  const manager = new CampaignManager({
    officeName: "Gentle Dental Care"
  });
  
  // Add a prospect from a cold list
  const coldProspect: PatientData = {
    id: 'prospect_123',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '+15551234567',
    accountPhone: '+15559876543',
    source: 'cold_list'
  };
  
  manager.addProspect(coldProspect, 'listValidation');
  
  // Simulate prospect journey through campaigns
  setTimeout(() => {
    console.log("\n[PROSPECT] Responding to validation message...");
    const response = manager.processResponse('prospect_123', 'Yes, this is John');
    console.log(`[AI] ${response?.reply}`);
    
    setTimeout(() => {
      console.log("\n[PROSPECT] Responding to cold offer...");
      const response = manager.processResponse('prospect_123', 'Yes, I\'m interested in learning more about the dental coverage');
      console.log(`[AI] ${response?.reply}`);
      
      setTimeout(() => {
        console.log("\n[PROSPECT] Selecting an appointment time...");
        const response = manager.processResponse('prospect_123', 'Tomorrow at 3pm works for me');
        console.log(`[AI] ${response?.reply}`);
        
        // Check the prospect's current status
        const prospect = manager.prospects.get('prospect_123');
        console.log("\n[SYSTEM] Prospect journey complete:");
        console.log(`Office: ${manager.campaigns.leadGeneration.officeName}`);
        console.log(`Current campaign: ${prospect?.currentCampaign}`);
        console.log(`Has appointment: ${prospect?.data.appointment ? 'Yes' : 'No'}`);
        if (prospect?.data.appointment) {
          console.log(`Appointment: ${prospect.data.appointment.date} at ${prospect.data.appointment.time}`);
        }
        console.log(`Tags: ${[...prospect?.tags || []].join(', ')}`);
      }, 1000);
    }, 1000);
  }, 1000);
}
*/
