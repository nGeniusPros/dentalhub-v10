import axios from 'axios';
import { DeepSeekClient } from '../deep-seek/deepSeekUtils';
import { ProspectRecord, ResponseResult, ResponseAction, CampaignType } from './interfaces/campaign.interfaces';

/**
 * SDR AI Service
 * 
 * Handles AI-powered responses for the SDR Agent by connecting to the
 * DeepSeek API through the Netlify serverless function.
 */
export class SdrAiService {
  private deepSeekClient: DeepSeekClient;
  private conversationHistory: Map<string, Array<{role: string, content: string}>>;
  
  /**
   * Create a new SDR AI Service
   */
  constructor() {
    this.deepSeekClient = new DeepSeekClient();
    this.conversationHistory = new Map();
  }
  
  /**
   * Generate an AI response to a prospect message
   * @param prospectId ID of the prospect
   * @param message Message from the prospect
   * @param prospectRecord Full prospect record for context
   * @returns Response result with AI-generated reply
   */
  async generateResponse(
    prospectId: string,
    message: string,
    prospectRecord: ProspectRecord
  ): Promise<ResponseResult> {
    try {
      // Add prospect message to conversation history
      this.addToConversationHistory(prospectId, 'user', message);
      
      // Get relevant knowledge about dental PPO coverage and similar campaigns
      const contextKnowledge = await this.deepSeekClient.queryEmbeddings(
        `dental PPO coverage ${message}`,
        3,
        { category: 'sdr_agent' }
      );
      
      // Format all the context for the AI
      const context = this.formatProspectContext(prospectRecord);
      const campaignInfo = `Current campaign: ${prospectRecord.currentCampaign}, Stage: ${prospectRecord.stage}`;
      
      // Create a structured prompt for the DeepSeek API
      const systemPrompt = `
You are an AI assistant for a dental office named "${prospectRecord.data.appointment?.service || 'Bright Smile Dental'}".
Your role is to respond to potential patients (prospects) in a friendly, helpful manner.
You should focus on converting prospects into scheduled appointments.

PROSPECT INFORMATION:
${context}

CAMPAIGN INFORMATION:
${campaignInfo}

KNOWLEDGE BASE INFORMATION:
${contextKnowledge.join('\n\n')}

GUIDELINES:
- Keep responses brief and conversational (2-3 sentences max)
- Focus on scheduling an appointment when possible
- Avoid discussing pricing details beyond mentioning "cost savings"
- Never mislead the prospect or make false promises
- Use emojis sparingly for a friendly tone
- End with a question when appropriate to continue the conversation
- If the prospect shows interest, suggest specific appointment times
      `.trim();
      
      // Get conversation history or initialize if none exists
      const history = this.getConversationHistory(prospectId);
      
      // Call the DeepSeek API via the Netlify function
      const response = await axios.post('/api/ai/deepseek', {
        messages: [
          { role: 'system', content: systemPrompt },
          ...history
        ],
        temperature: 0.7,
        max_tokens: 150
      });
      
      // Extract the AI-generated reply
      const aiReply = response.data.choices[0].message.content;
      
      // Add AI response to conversation history
      this.addToConversationHistory(prospectId, 'assistant', aiReply);
      
      // Determine the action based on the AI reply
      const action = this.determineAction(aiReply);
      
      return {
        action: action.type,
        reply: aiReply,
        targetCampaign: action.targetCampaign
      };
    } catch (error) {
      console.error('[SDR AI Service] Error generating AI response:', error);
      
      // Fallback response
      return {
        action: 'default_reply',
        reply: "Thanks for your message! I'd be happy to discuss our Enhanced Dental PPO Coverage with you. Would you prefer a call tomorrow at 2pm, 3pm, or 4pm?"
      };
    }
  }
  
  /**
   * Format prospect information as context for the AI
   * @param prospectRecord Prospect record
   * @returns Formatted context string
   */
  private formatProspectContext(prospectRecord: ProspectRecord): string {
    const prospect = prospectRecord.data;
    
    let context = `
Name: ${prospect.firstName} ${prospect.lastName}
Email: ${prospect.email}
Phone: ${prospect.phone}
Source: ${prospect.source || 'Unknown'}
Campaign History: ${prospectRecord.history.map(h => h.campaign).join(' → ')}
    `.trim();
    
    // Add appointment information if it exists
    if (prospect.appointment) {
      context += `\nAppointment: ${prospect.appointment.date} at ${prospect.appointment.time}`;
      context += `\nService: ${prospect.appointment.service}`;
      context += `\nStatus: ${prospect.appointment.status}`;
    }
    
    return context;
  }
  
  /**
   * Determine the appropriate action based on the AI response
   * @param aiReply The AI-generated reply
   * @returns Action object with type and optional target campaign
   */
  private determineAction(aiReply: string): { type: ResponseAction, targetCampaign?: CampaignType } {
    const lowerReply = aiReply.toLowerCase();
    
    // Check if the response indicates scheduling an appointment
    if (
      lowerReply.includes('schedule') || 
      lowerReply.includes('appointment') ||
      lowerReply.includes('book') ||
      lowerReply.includes('2pm') ||
      lowerReply.includes('3pm') ||
      lowerReply.includes('4pm')
    ) {
      return { type: 'offer_times' };
    }
    
    // Check if the response indicates no interest
    if (
      lowerReply.includes('not interested') ||
      lowerReply.includes('sorry') ||
      lowerReply.includes('apologize')
    ) {
      return { 
        type: 'move_campaign', 
        targetCampaign: 'holding'
      };
    }
    
    // Default action
    return { type: 'default_reply' };
  }
  
  /**
   * Add a message to the conversation history
   * @param prospectId Prospect ID
   * @param role Message role (user/assistant)
   * @param content Message content
   */
  private addToConversationHistory(
    prospectId: string,
    role: 'user' | 'assistant' | 'system',
    content: string
  ): void {
    if (!this.conversationHistory.has(prospectId)) {
      this.conversationHistory.set(prospectId, []);
    }
    
    const history = this.conversationHistory.get(prospectId)!;
    history.push({ role, content });
    
    // Limit history size to prevent context overflows
    if (history.length > 10) {
      history.splice(0, history.length - 10);
    }
    
    this.conversationHistory.set(prospectId, history);
  }
  
  /**
   * Get conversation history for a prospect
   * @param prospectId Prospect ID
   * @returns Array of message objects
   */
  private getConversationHistory(prospectId: string): Array<{role: string, content: string}> {
    return this.conversationHistory.get(prospectId) || [];
  }
}