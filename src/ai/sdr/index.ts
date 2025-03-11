/**
 * SDR Agent - Sales Development Representative AI Agent
 * Primary export file
 */

// Export the SDR Agent implementation
export { SdrAgent } from './sdr-agent';
export { CampaignManager } from './campaign-manager';
export { SdrAiService } from './sdr-ai-service';

// Export all interfaces
export * from './interfaces/campaign.interfaces';

// Export demo campaign functions for testing
export { runDemonstration, simulateNoShows, simulatePowerHour } from './demo-campaign';