import { api } from '../utils/api';

export interface AIFeedback {
  id: string;
  prospect_id: string;
  content: string;
  feedback_type?: 'suggestion' | 'analysis' | 'recommendation';
  sentiment?: 'positive' | 'negative' | 'neutral';
  confidence_score?: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface FeedbackQueryParams {
  prospect_id?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Generate AI feedback for a prospect
 */
export const generateFeedback = async (
  prospectId: string, 
  content: string,
  feedbackType: AIFeedback['feedback_type'] = 'suggestion'
): Promise<AIFeedback | null> => {
  try {
    const payload = {
      prospect_id: prospectId,
      content,
      feedback_type: feedbackType
    };
    
    // Use the ai/feedback endpoint which routes through Netlify Functions in production
    const response = await api.post<AIFeedback>('ai/feedback', payload);
    return response;
  } catch (error: any) {
    console.error('Failed to generate AI feedback:', error);
    return null;
  }
};

/**
 * Get a specific AI feedback by ID
 */
export const getFeedbackById = async (feedbackId: string): Promise<AIFeedback | null> => {
  try {
    const response = await api.get<AIFeedback>(`ai/feedback/${feedbackId}`);
    return response;
  } catch (error: any) {
    console.error(`Failed to fetch AI feedback with ID ${feedbackId}:`, error);
    return null;
  }
};

/**
 * Get a list of AI feedback with optional filters
 */
export const getFeedbackList = async (params: FeedbackQueryParams = {}): Promise<{ 
  feedback: AIFeedback[], 
  pagination: { 
    total: number, 
    page: number, 
    per_page: number, 
    total_pages: number 
  } 
} | null> => {
  try {
    const response = await api.get<{
      data: AIFeedback[],
      pagination: {
        total: number,
        page: number,
        per_page: number,
        total_pages: number
      }
    }>('ai/feedback', params as unknown as Record<string, unknown>);
    
    return {
      feedback: response.data,
      pagination: response.pagination
    };
  } catch (error: any) {
    console.error('Failed to fetch AI feedback list:', error);
    return null;
  }
};

/**
 * Get all AI feedback for a specific prospect
 */
export const getFeedbackByProspect = async (prospectId: string): Promise<AIFeedback[] | null> => {
  try {
    const result = await getFeedbackList({ prospect_id: prospectId, per_page: 100 });
    return result?.feedback || null;
  } catch (error: any) {
    console.error(`Failed to fetch AI feedback for prospect ${prospectId}:`, error);
    return null;
  }
};

/**
 * Update an existing AI feedback
 */
export const updateFeedback = async (feedbackId: string, updates: Partial<AIFeedback>): Promise<AIFeedback | null> => {
  try {
    const response = await api.put<AIFeedback>(`ai/feedback/${feedbackId}`, updates);
    return response;
  } catch (error: any) {
    console.error('Failed to update AI feedback:', error);
    return null;
  }
};

/**
 * Delete an AI feedback
 */
export const deleteFeedback = async (feedbackId: string): Promise<boolean> => {
  try {
    await api.delete('ai/feedback', feedbackId);
    return true;
  } catch (error: any) {
    console.error('Failed to delete AI feedback:', error);
    return false;
  }
};
