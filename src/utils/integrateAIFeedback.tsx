import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import AIResponseFeedback from '../components/ai/AIResponseFeedback';
import { 
  AGENT_TYPES, 
  FEEDBACK_CONTEXTS, 
  USER_ROLES,
  AgentType,
  FeedbackContext,
  UserRole
} from '../constants/ai-agents';
import type { AIFeedbackSubmission } from '../types/ai-feedback';

/**
 * Validates that the agent type is one of the approved constant values
 * @param agentType The agent type to validate
 * @returns The validated agent type or 'assistant' as fallback
 */
const validateAgentType = (agentType: string): AgentType => {
  const validAgentTypes = Object.values(AGENT_TYPES);
  return validAgentTypes.includes(agentType as AgentType) 
    ? (agentType as AgentType) 
    : AGENT_TYPES.ASSISTANT;
};

/**
 * Validates that the feedback context is one of the approved constant values
 * @param context The feedback context to validate
 * @returns The validated context or 'general' as fallback
 */
const validateFeedbackContext = (context?: string): FeedbackContext => {
  if (!context) return FEEDBACK_CONTEXTS.GENERAL;
  
  const validContexts = Object.values(FEEDBACK_CONTEXTS);
  return validContexts.includes(context as FeedbackContext)
    ? (context as FeedbackContext)
    : FEEDBACK_CONTEXTS.GENERAL;
};

/**
 * Validates that the user role is one of the approved constant values
 * @param role The user role to validate
 * @returns The validated role or 'guest' as fallback
 */
const validateUserRole = (role?: string): UserRole => {
  if (!role) return USER_ROLES.GUEST;
  
  const validRoles = Object.values(USER_ROLES);
  return validRoles.includes(role as UserRole)
    ? (role as UserRole)
    : USER_ROLES.GUEST;
};

/**
 * Higher-order component to integrate AI feedback into any AI response component
 * This HOC ensures consistent feedback collection across the application.
 * 
 * @param WrappedComponent The AI component to wrap with feedback functionality
 * @param options Configuration options
 * @returns Enhanced component with feedback capabilities
 */
export function withAIFeedback<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: {
    agentType: string;
    defaultUserRole?: string;
    feedbackContext?: string;
    enableFeedbackTracking?: boolean;
    showCommentField?: boolean;
  }
) {
  // Validate inputs for security and consistency
  const validatedAgentType = validateAgentType(options.agentType);
  const validatedContext = validateFeedbackContext(options.feedbackContext);
  const validatedDefaultRole = validateUserRole(options.defaultUserRole);
  
  return function WithAIFeedback(props: P & { userRole?: string }) {
    // Generate a unique ID for this AI response
    const responseId = React.useMemo(() => uuidv4(), []);
    
    const { 
      enableFeedbackTracking = true,
      showCommentField = true
    } = options;
    
    // Validate user role from props or use default
    const userRole = validateUserRole(props.userRole || validatedDefaultRole);
    
    // If feedback tracking is disabled, just return the original component
    if (!enableFeedbackTracking) {
      return <WrappedComponent {...props} responseId={responseId} />;
    }
    
    // Handler for feedback submission (can be used for analytics)
    const handleFeedbackSubmit = (feedback: AIFeedbackSubmission) => {
      console.log('Feedback received:', feedback);
      // Optionally add custom analytics tracking here
    };

    return (
      <div className="ai-feedback-wrapper">
        <WrappedComponent {...props} responseId={responseId} />
        <div className="mt-2">
          <AIResponseFeedback
            responseId={responseId}
            agentType={validatedAgentType}
            userRole={userRole}
            feedbackContext={validatedContext}
            showCommentField={showCommentField}
            onFeedbackSubmit={handleFeedbackSubmit}
          />
        </div>
      </div>
    );
  };
}

/**
 * Helper hook to generate and manage response IDs for feedback
 * Use this when you need more control over the feedback UI placement
 * 
 * @param agentType Type of AI agent
 * @returns Object with response ID and tracking functions
 */
export function useAIResponseTracking(agentType: string) {
  // Validate agent type
  const validatedAgentType = validateAgentType(agentType);
  
  // Generate a unique ID for this response
  const [responseId] = React.useState(() => uuidv4());
  
  // Function to track when a response is shown to the user
  const trackResponseImpression = React.useCallback(() => {
    // Track that the response was shown to the user
    console.log(`AI response ${responseId} of type ${validatedAgentType} was shown to user`);
    
    // Here you could call an analytics service or log to your database
    // Example: analyticsService.trackAIImpression(responseId, validatedAgentType);
  }, [responseId, validatedAgentType]);
  
  return {
    responseId,
    agentType: validatedAgentType,
    trackResponseImpression
  };
}

/**
 * Example usage:
 * 
 * // With HOC approach
 * const EnhancedAIConsultant = withAIFeedback(AIConsultant, {
 *   agentType: 'consultant',
 *   feedbackContext: 'treatment-planning'
 * });
 * 
 * // With hook approach
 * function MyAIComponent() {
 *   const { responseId, trackResponseImpression } = useAIResponseTracking('assistant');
 *   
 *   // Your component logic
 *   
 *   return (
 *     <div>
 *       {/* AI content */}
 *       <AIResponseFeedback 
 *         responseId={responseId} 
 *         agentType="assistant" 
 *       />
 *     </div>
 *   );
 * }
 */
