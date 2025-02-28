import { useState } from 'react';
import { supabase } from '../config/auth';
import { v4 as uuidv4 } from 'uuid';

interface FeedbackData {
  queryId: string;
  responseId: string;
  userRole: string;
  agentType: string;
  wasHelpful?: boolean;
  helpfulnessRating?: number;
  feedbackType: 'thumbs' | 'rating' | 'correction' | 'comment';
  feedbackText?: string;
  correctedResponse?: string;
  modelVersion?: string;
}

/**
 * Custom hook for submitting AI response feedback
 * 
 * Handles the logic of sending user feedback to Supabase and managing loading states
 */
export function useAIFeedback() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /**
   * Submit feedback for an AI response
   * @param data The feedback data to submit
   */
  const submitFeedback = async (data: FeedbackData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Generate a unique feedback ID if not provided
      const feedbackId = uuidv4();
      
      const { error: supabaseError } = await supabase
        .from('ai_response_feedback')
        .insert([{
          id: feedbackId,
          query_id: data.queryId,
          response_id: data.responseId,
          user_id: supabase.auth.user()?.id,
          user_role: data.userRole,
          agent_type: data.agentType,
          was_helpful: data.wasHelpful,
          helpfulness_rating: data.helpfulnessRating,
          feedback_type: data.feedbackType,
          feedback_text: data.feedbackText,
          corrected_response: data.correctedResponse,
          model_version: data.modelVersion || 'v1.0',
          created_at: new Date().toISOString()
        }]);
        
      if (supabaseError) throw supabaseError;
      
      setSuccess(true);
      
      // Optionally track analytics event if available
      if (window.analytics) {
        window.analytics.track('AI Feedback Submitted', {
          agentType: data.agentType,
          feedbackType: data.feedbackType,
          wasHelpful: data.wasHelpful,
          userRole: data.userRole
        });
      }
      
      return true;
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset the feedback state
   */
  const resetFeedback = () => {
    setSuccess(false);
    setError(null);
  };

  return { 
    submitFeedback, 
    resetFeedback,
    loading, 
    error, 
    success 
  };
}
