import { api } from './api';

/**
 * Interface for message objects in the chat history
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Interface for DeepSeek API options
 */
export interface DeepSeekOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
  user?: string;
}

/**
 * Interface for DeepSeek API response
 */
export interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * AI utility for making DeepSeek API requests
 */
export const ai = {
  /**
   * Send a chat completion request to DeepSeek API
   * @param messages Array of message objects in the chat history
   * @param options Optional parameters for the API request
   * @returns Promise resolving to DeepSeek API response
   */
  async chat(
    messages: ChatMessage[],
    options: DeepSeekOptions = {}
  ): Promise<DeepSeekResponse> {
    try {
      // Set default model if not provided
      if (!options.model) {
        options.model = 'deepseek-chat';
      }

      // Use our API abstraction layer to make the request
      // This automatically routes through Netlify Functions when deployed
      const response = await api.post('ai/deepseek', {
        messages,
        ...options,
      });

      return response as DeepSeekResponse;
    } catch (error) {
      console.error('AI chat error:', error);
      throw error;
    }
  },

  /**
   * Helper function to create a system message
   * @param content The content of the system message
   * @returns ChatMessage object with role 'system'
   */
  systemMessage(content: string): ChatMessage {
    return { role: 'system', content };
  },

  /**
   * Helper function to create a user message
   * @param content The content of the user message
   * @returns ChatMessage object with role 'user'
   */
  userMessage(content: string): ChatMessage {
    return { role: 'user', content };
  },

  /**
   * Helper function to create an assistant message
   * @param content The content of the assistant message
   * @returns ChatMessage object with role 'assistant'
   */
  assistantMessage(content: string): ChatMessage {
    return { role: 'assistant', content };
  },

  /**
   * Get dental diagnosis based on symptoms
   * @param symptoms The patient's symptoms
   * @returns Promise resolving to the AI diagnosis
   */
  async getDentalDiagnosis(symptoms: string): Promise<string> {
    try {
      const messages: ChatMessage[] = [
        this.systemMessage(
          'You are a dental assistant AI helper. Provide preliminary assessments based on symptoms. Always advise patients to consult with a dentist for proper diagnosis.'
        ),
        this.userMessage(`Patient symptoms: ${symptoms}`),
      ];

      const response = await this.chat(messages, {
        temperature: 0.3, // Lower temperature for more focused responses
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Diagnosis error:', error);
      return 'Unable to provide diagnosis at this time. Please try again later or consult with a dentist directly.';
    }
  },

  /**
   * Get treatment recommendations based on diagnosis
   * @param diagnosis The dental diagnosis
   * @returns Promise resolving to treatment recommendations
   */
  async getTreatmentRecommendations(diagnosis: string): Promise<string> {
    try {
      const messages: ChatMessage[] = [
        this.systemMessage(
          'You are a dental assistant AI helper. Provide general treatment recommendations based on diagnoses. Always advise patients to consult with a dentist for proper treatment plans.'
        ),
        this.userMessage(`Dental diagnosis: ${diagnosis}`),
      ];

      const response = await this.chat(messages, {
        temperature: 0.3,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Treatment recommendations error:', error);
      return 'Unable to provide treatment recommendations at this time. Please consult with a dentist for proper advice.';
    }
  },
};

export default ai;