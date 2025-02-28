import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase-client';
import { 
  AGENT_TYPES, 
  FEEDBACK_CONTEXTS, 
  USER_ROLES,
  AgentType,
  FeedbackContext,
  UserRole
} from '../../constants/ai-agents';
import type { AIFeedbackSubmission } from '../../types/ai-feedback';

interface AIResponseFeedbackProps {
  responseId: string;
  agentType: AgentType;
  userRole?: UserRole;
  feedbackContext?: FeedbackContext;
  modelVersion?: string;
  className?: string;
  showCommentField?: boolean;
  onFeedbackSubmit?: (feedback: AIFeedbackSubmission) => void;
}

/**
 * AI Response Feedback Component
 * 
 * A reusable component for collecting user feedback on AI responses
 * Supports thumbs up/down and optional comments
 * Data is saved to Supabase for reinforcement learning
 */
const AIResponseFeedback: React.FC<AIResponseFeedbackProps> = ({
  responseId,
  agentType,
  userRole = USER_ROLES.GUEST,
  feedbackContext = FEEDBACK_CONTEXTS.GENERAL,
  modelVersion = 'latest',
  className = '',
  showCommentField = true,
  onFeedbackSubmit
}) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackValue, setFeedbackValue] = useState<boolean | null>(null);

  // Sanitize input to prevent XSS and SQL injection
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/'/g, '&#39;')
      .replace(/"/g, '&quot;')
      .trim();
  };

  // Submit feedback to Supabase
  const submitFeedback = async (
    type: 'thumbs' | 'comment',
    value: boolean | null,
    comment?: string
  ) => {
    setIsSubmitting(true);
    
    try {
      // Prepare feedback data
      const feedbackData: AIFeedbackSubmission = {
        responseId,
        agentType,
        userRole,
        feedbackContext,
        modelVersion,
        feedbackType: type,
        wasHelpful: value,
        timestamp: new Date().toISOString(),
      };
      
      // Add sanitized comment if provided
      if (comment) {
        feedbackData.feedbackText = sanitizeInput(comment);
      }
      
      // Save to Supabase
      const { error } = await supabase
        .from('ai_feedback')
        .insert(feedbackData);
        
      if (error) {
        console.error('Error submitting feedback:', error);
        throw error;
      }
      
      // Call the callback if provided
      if (onFeedbackSubmit) {
        onFeedbackSubmit(feedbackData);
      }
      
      setFeedbackGiven(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Could show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleThumbsFeedback = async (helpful: boolean) => {
    setFeedbackValue(helpful);
    await submitFeedback('thumbs', helpful);
  };

  const handleCommentSubmit = async () => {
    if (feedbackText.trim()) {
      await submitFeedback('comment', feedbackValue, feedbackText);
      setIsCommentVisible(false);
    }
  };

  if (feedbackGiven) {
    return (
      <div className={`text-xs text-gray-500 mt-2 ${className}`}>
        Thank you for your feedback!
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {!isCommentVisible ? (
        <div className="flex items-center mt-2 space-x-4">
          <p className="text-xs text-gray-500">Was this response helpful?</p>
          <div className="flex space-x-2">
            <button 
              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
              onClick={() => handleThumbsFeedback(true)}
              aria-label="Thumbs up"
              disabled={isSubmitting}
            >
              <ThumbsUp size={16} />
            </button>
            <button 
              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              onClick={() => handleThumbsFeedback(false)}
              aria-label="Thumbs down"
              disabled={isSubmitting}
            >
              <ThumbsDown size={16} />
            </button>
            {showCommentField && (
              <button 
                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                onClick={() => setIsCommentVisible(true)}
                aria-label="Add comment"
                disabled={isSubmitting}
              >
                <MessageSquare size={16} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-2">
          <textarea 
            className="w-full p-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Please share your thoughts or suggest a correction..."
            rows={3}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
          <div className="flex justify-end mt-2 space-x-2">
            <button 
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md"
              onClick={() => setIsCommentVisible(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              onClick={handleCommentSubmit}
              disabled={isSubmitting || !feedbackText.trim()}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIResponseFeedback;
