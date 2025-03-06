import { Campaign } from './base.campaign';
import { CampaignConfig } from '../interfaces/campaign.interfaces';

/**
 * List Validation Campaign
 * 
 * For validating contact information from cold lists.
 * This campaign focuses on verifying lead contact information
 * before moving them into more targeted campaigns.
 */
export class ListValidationCampaign extends Campaign {
  constructor(config: CampaignConfig = { enabled: true }) {
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