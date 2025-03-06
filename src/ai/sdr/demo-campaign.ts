import { CampaignManager } from './campaign-manager';
import { Prospect } from './interfaces/campaign.interfaces';

/**
 * Dental Practice Campaign Automations Demo
 * 
 * This file demonstrates the usage of the campaign automation system
 * with a simulated prospect journey from initial contact to appointment booking.
 */

/**
 * Run a demonstration of the campaign automation system
 */
export function runDemonstration(): void {
  console.log("\n========= DENTAL PRACTICE CAMPAIGN AUTOMATION DEMO =========\n");
  
  // Create campaign manager with custom office name
  const manager = new CampaignManager({
    officeName: "Gentle Dental Care"
  });
  
  console.log(`Campaign Manager initialized for "${manager.config.officeName}"\n`);
  
  // Add a prospect from a cold list
  const coldProspect: Prospect = {
    id: 'prospect_123',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '+15551234567',
    source: 'cold_list'
  };
  
  console.log(`Adding prospect: ${coldProspect.firstName} ${coldProspect.lastName} (${coldProspect.email})`);
  manager.addProspect(coldProspect, 'listValidation');
  
  // Display initial campaign
  const initialRecord = manager.prospects.get(coldProspect.id);
  console.log(`Initial campaign: ${initialRecord?.currentCampaign}\n`);
  
  // Simulate a validation response
  simulateResponse(manager, coldProspect.id, "Yes, this is John", 1000, () => {
    // Simulate a cold offer response
    simulateResponse(manager, coldProspect.id, "Yes, I'm interested in learning more about the dental coverage", 1000, () => {
      // Simulate booking an appointment
      simulateResponse(manager, coldProspect.id, "Tomorrow at 3pm works for me", 1000, () => {
        // Check the prospect's current status
        const prospect = manager.prospects.get(coldProspect.id);
        if (prospect) {
          console.log("\n========= PROSPECT JOURNEY SUMMARY =========\n");
          console.log(`Office: ${manager.config.officeName}`);
          console.log(`Current campaign: ${prospect.currentCampaign}`);
          console.log(`Campaign stage: ${prospect.stage}`);
          console.log(`Journey history: ${prospect.history.map(h => h.campaign).join(' → ')}`);
          console.log(`Has appointment: ${prospect.data.appointment ? 'Yes' : 'No'}`);
          
          if (prospect.data.appointment) {
            console.log(`Appointment: ${prospect.data.appointment.date} at ${prospect.data.appointment.time}`);
            console.log(`Service: ${prospect.data.appointment.service}`);
            console.log(`Status: ${prospect.data.appointment.status}`);
          }
          
          console.log(`Tags: ${[...prospect.tags].join(', ')}`);
          console.log("\n==============================================\n");
        }
      });
    });
  });
}

/**
 * Helper function to simulate a prospect response with a delay
 */
function simulateResponse(
  manager: CampaignManager, 
  prospectId: string, 
  message: string, 
  delay: number,
  callback: () => void
): void {
  setTimeout(() => {
    console.log(`\n[PROSPECT] Responding: "${message}"`);
    const response = manager.processResponse(prospectId, message);
    
    if (response) {
      console.log(`[AI] ${response.action}: "${response.reply}"`);
      if (response.targetCampaign) {
        console.log(`[SYSTEM] Moving to campaign: ${response.targetCampaign}`);
      }
    } else {
      console.log("[SYSTEM] Error: No response generated");
    }
    
    callback();
  }, delay);
}

/**
 * Simulate processing no-shows
 */
export function simulateNoShows(manager: CampaignManager): void {
  console.log("\n========= NO-SHOW PROCESSING DEMO =========\n");
  
  // Add a prospect with a scheduled appointment
  const prospect: Prospect = {
    id: 'prospect_456',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    phone: '+15559876543',
    source: 'web_form'
  };
  
  manager.addProspect(prospect, 'leadGeneration');
  
  // Simulate booking an appointment
  const response = manager.processResponse(prospect.id, '3pm tomorrow works great');
  console.log(`Booking response: ${response?.reply}`);
  
  // Set the appointment date to yesterday
  const prospectRecord = manager.prospects.get(prospect.id);
  if (prospectRecord?.data.appointment) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const appointment = prospectRecord.data.appointment;
    appointment.date = yesterday.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
    
    console.log(`Appointment set to yesterday (${appointment.date}) to simulate no-show`);
    
    // Process no-shows
    const noShowCount = manager.checkNoShows();
    console.log(`Processed ${noShowCount} no-shows`);
    
    // Check the prospect's new campaign
    const updatedRecord = manager.prospects.get(prospect.id);
    console.log(`Prospect moved to campaign: ${updatedRecord?.currentCampaign}`);
  }
}

/**
 * Simulate Power Hour activation
 */
export function simulatePowerHour(manager: CampaignManager): void {
  console.log("\n========= POWER HOUR ACTIVATION DEMO =========\n");
  
  // Add some prospects to the holding campaign
  for (let i = 1; i <= 5; i++) {
    const prospect: Prospect = {
      id: `holding_${i}`,
      firstName: `Holding${i}`,
      lastName: `Prospect`,
      email: `holding${i}@example.com`,
      phone: `+1555${i}${i}${i}${i}${i}${i}${i}`,
      source: 'cold_list'
    };
    
    manager.addProspect(prospect, 'holding');
    console.log(`Added prospect ${i} to holding campaign`);
  }
  
  // Activate power hour
  const movedCount = manager.activatePowerHour(3); // Move 3 prospects
  console.log(`Moved ${movedCount} prospects from holding to power hour campaign`);
  
  // Show which prospects were moved
  console.log("\nCurrent campaigns for all prospects:");
  for (const [id, record] of manager.prospects.entries()) {
    console.log(`- ${id}: ${record.currentCampaign}`);
  }
}

// Run the demonstration if this file is executed directly
if (require.main === module) {
  runDemonstration();
  
  // Wait a bit, then show other demos
  setTimeout(() => {
    const manager = new CampaignManager();
    simulateNoShows(manager);
    
    setTimeout(() => {
      simulatePowerHour(manager);
    }, 1000);
  }, 5000);
}