/**
 * Test script for the Dental Practice Campaign Automation system
 * 
 * This script demonstrates the functionality of the SDR agent by:
 * 1. Creating a new SDR agent with custom office name
 * 2. Adding a new prospect to the system
 * 3. Simulating message exchanges with the prospect
 * 4. Showing campaign progression and appointment booking
 */

import { SdrAgent } from './sdr-agent';
import { Prospect } from './interfaces/campaign.interfaces';

// Create an SDR agent with custom office name
const agent = new SdrAgent({
  officeName: "Gentle Smile Dental"
});

console.log("\n========= SDR AGENT TEST =========\n");
console.log(`Created SDR agent for: ${agent.getCampaignManager().config.officeName}\n`);

// Create a test prospect
const prospect: Prospect = {
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
simulateMessage(agent, prospect.id, "Yes, I'm interested in learning more about the dental coverage");

// Simulate prospect scheduling an appointment
setTimeout(() => {
  simulateMessage(agent, prospect.id, "Tomorrow at 3pm works for me");
  
  // Check if appointment was booked
  setTimeout(() => {
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
  }, 500);
}, 500);

/**
 * Helper function to simulate a message from a prospect
 */
function simulateMessage(agent: SdrAgent, prospectId: string, message: string): void {
  console.log(`[PROSPECT] ${message}`);
  const response = agent.processIncomingMessage(prospectId, message);
  console.log(`[AI AGENT] ${response}\n`);
}