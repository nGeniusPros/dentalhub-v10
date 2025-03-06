/**
 * JavaScript Test Demo for the Dental Practice Campaign Automation system
 * 
 * This script creates a simple demo of the campaign system functionality
 */

// Simplified Campaign Base class
class Campaign {
  constructor(config = {}) {
    this.config = config;
    this.officeName = config.officeName || "Bright Smile Dental";
    this.name = "Base Campaign";
    this.nextCampaign = null;
    this.automationEvents = [];
    this.responseHandlers = [];
  }
  
  processMessage(message) {
    return message.replace(/{{OfficeName}}/g, this.officeName);
  }
}

// Lead Generation Campaign
class LeadGenerationCampaign extends Campaign {
  constructor(config = {}) {
    super(config);
    this.name = "Lead Generation";
    this.nextCampaign = "noResponse";
    
    this.automationEvents = [
      {
        type: "sms",
        name: "Thank You",
        timing: "send_after_opt_in",
        message: "Hey {{FirstName}}, this is {{AssigneeFirstName}} with {{OfficeName}}. Thanks for filling out our form for Enhanced Dental PPO Coverage! 😊"
      },
      {
        type: "email",
        name: "Covering My Bases",
        timing: "send_5_min_after_opt_in",
        subject: "{{FirstName}}, Thanks for your inquiry",
        message: "Hey {{FirstName}}, this is {{AssigneeFullName}} with {{OfficeName}}. Thanks for your interest in our Enhanced Dental PPO Coverage."
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
        reply: "Perfect! You're all set for a call on {{AppointmentDate}} at {{AppointmentTime}}. I'll give you a call then to discuss your Enhanced Dental PPO Coverage options."
      }
    ];
  }
}

// Campaign Manager
class CampaignManager {
  constructor(config = {}) {
    this.config = config;
    this.campaigns = {
      leadGeneration: new LeadGenerationCampaign(config)
    };
    
    this.prospects = new Map();
    this.appointments = new Map();
  }
  
  addProspect(prospect, campaignName = "leadGeneration") {
    const campaign = this.campaigns[campaignName];
    if (!campaign) return false;
    
    this.prospects.set(prospect.id, {
      data: prospect,
      currentCampaign: campaignName,
      stage: 0,
      history: [],
      tags: new Set()
    });
    
    console.log(`[Campaign Manager] Added prospect to ${campaignName} campaign`);
    return true;
  }
  
  processResponse(prospectId, message) {
    const prospectRecord = this.prospects.get(prospectId);
    if (!prospectRecord) return null;
    
    const campaign = this.campaigns[prospectRecord.currentCampaign];
    if (!campaign) return null;
    
    // Find matching response handler
    let matchedHandler = null;
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
        reply: "Thanks for your response! Would you like to hear more about our Enhanced Dental PPO Coverage options?"
      };
    }
    
    // Process the action
    if (matchedHandler.action === "book_appointment") {
      this.bookAppointment(prospectId, message);
    }
    
    // Personalize the reply
    const personalizedReply = this.personalizeMessage(matchedHandler.reply, prospectRecord.data);
    
    return {
      action: matchedHandler.action,
      reply: personalizedReply
    };
  }
  
  personalizeMessage(message, prospect) {
    let personalizedMessage = message;
    
    // Basic replacements
    personalizedMessage = personalizedMessage.replace(/{{FirstName}}/g, prospect.firstName || "there");
    personalizedMessage = personalizedMessage.replace(/{{OfficeName}}/g, this.config.officeName || "Bright Smile Dental");
    
    // Appointment details if available
    if (prospect.appointment) {
      personalizedMessage = personalizedMessage.replace(/{{AppointmentDate}}/g, prospect.appointment.date || "tomorrow");
      personalizedMessage = personalizedMessage.replace(/{{AppointmentTime}}/g, prospect.appointment.time || "the scheduled time");
    }
    
    return personalizedMessage;
  }
  
  sendNextEvent(prospectId) {
    const prospectRecord = this.prospects.get(prospectId);
    if (!prospectRecord) return false;
    
    const campaign = this.campaigns[prospectRecord.currentCampaign];
    if (!campaign || !campaign.automationEvents || campaign.automationEvents.length === 0) return false;
    
    // Get next event based on stage
    if (prospectRecord.stage >= campaign.automationEvents.length) {
      return false;
    }
    
    const event = campaign.automationEvents[prospectRecord.stage];
    
    // Personalize the message
    const personalizedMessage = this.personalizeMessage(event.message, prospectRecord.data);
    
    console.log(`[${campaign.name}] Sending ${event.type}: ${personalizedMessage}`);
    
    // Update stage
    prospectRecord.stage++;
    this.prospects.set(prospectId, prospectRecord);
    
    return true;
  }
  
  bookAppointment(prospectId, message) {
    const prospectRecord = this.prospects.get(prospectId);
    if (!prospectRecord) return false;
    
    // Extract time from message
    let time = "3:00 PM"; // Default time
    if (message.includes("2pm")) {
      time = "2:00 PM";
    } else if (message.includes("4pm")) {
      time = "4:00 PM";
    }
    
    // Set date to tomorrow
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const date = tomorrow.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    
    // Create appointment
    const appointment = {
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
    
    console.log(`[Campaign Manager] Booked appointment for ${prospectRecord.data.firstName} on ${date} at ${time}`);
    
    return appointment;
  }
}

// SDR Agent
class SdrAgent {
  constructor(config = {}) {
    this.campaignManager = new CampaignManager(config);
  }
  
  getCampaignManager() {
    return this.campaignManager;
  }
  
  addProspect(prospect, initialCampaign = 'leadGeneration') {
    console.log(`[SDR Agent] Adding new prospect: ${prospect.firstName} ${prospect.lastName}`);
    return this.campaignManager.addProspect(prospect, initialCampaign);
  }
  
  processIncomingMessage(prospectId, message) {
    console.log(`[SDR Agent] Processing message from ${prospectId}: "${message}"`);
    
    const response = this.campaignManager.processResponse(prospectId, message);
    if (!response) {
      console.log(`[SDR Agent] No response generated for prospect ${prospectId}`);
      return null;
    }
    
    console.log(`[SDR Agent] Responding with: "${response.reply}"`);
    return response.reply;
  }
}

// Run demo test
console.log("\n========= SDR AGENT TEST =========\n");

// Create an SDR agent with custom office name
const agent = new SdrAgent({
  officeName: "Gentle Smile Dental"
});
console.log(`Created SDR agent for: ${agent.getCampaignManager().config.officeName}\n`);

// Create a test prospect
const prospect = {
  id: 'test_prospect_001',
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@example.com',
  phone: '+15551234567',
  source: 'web_form'
};

// Add prospect to the system
console.log(`Adding prospect: ${prospect.firstName} ${prospect.lastName}`);
agent.addProspect(prospect, 'leadGeneration');

// Get prospect record to verify
const manager = agent.getCampaignManager();
const prospectRecord = manager.prospects.get(prospect.id);
console.log(`Prospect added to campaign: ${prospectRecord?.currentCampaign}\n`);

// Process first message in campaign
console.log("Sending first campaign message...");
manager.sendNextEvent(prospect.id);

// Simulate receiving a message from the prospect
console.log("\n----- PROSPECT RESPONSE SIMULATION -----\n");
console.log("[PROSPECT] Yes, I'm interested in learning more about the dental coverage");
const response1 = agent.processIncomingMessage(prospect.id, "Yes, I'm interested in learning more about the dental coverage");
console.log(`[AI AGENT] ${response1}\n`);

// Simulate prospect scheduling an appointment
console.log("[PROSPECT] Tomorrow at 3pm works for me");
const response2 = agent.processIncomingMessage(prospect.id, "Tomorrow at 3pm works for me");
console.log(`[AI AGENT] ${response2}\n`);

// Check final status
const updatedRecord = manager.prospects.get(prospect.id);
console.log("\n----- FINAL STATUS -----\n");

if (updatedRecord?.data.appointment) {
  console.log("✓ Appointment successfully booked!");
  console.log(`Date: ${updatedRecord.data.appointment.date}`);
  console.log(`Time: ${updatedRecord.data.appointment.time}`);
  console.log(`Service: ${updatedRecord.data.appointment.service}`);
  console.log(`Status: ${updatedRecord.data.appointment.status}`);
} else {
  console.log("✗ Appointment was not booked");
}

console.log(`\nCurrent campaign: ${updatedRecord?.currentCampaign}`);
console.log(`Current stage: ${updatedRecord?.stage}`);
console.log(`Tags: ${[...updatedRecord?.tags || []]}`);

console.log("\n========= TEST COMPLETED =========\n");