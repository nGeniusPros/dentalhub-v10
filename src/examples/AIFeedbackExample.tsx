import React, { useState } from 'react';
import { withAIFeedback } from '../utils/integrateAIFeedback';
import { AGENT_TYPES, FEEDBACK_CONTEXTS, USER_ROLES } from '../constants/ai-agents';

/**
 * Base AI Component without feedback
 * This is a simple example of an AI component that returns responses
 */
interface AIComponentProps {
  prompt?: string;
  userRole?: string;
  // This prop will be injected by the HOC
  responseId?: string;
}

function BaseAIComponent({ prompt = '', userRole, responseId }: AIComponentProps) {
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  // Simulate getting an AI response
  const getAIResponse = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    
    // In a real implementation, this would call your AI service
    // The responseId from the HOC should be included in your request
    // to link the feedback to this specific response
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Example response
      const aiResponse = `Here is my response to: "${prompt}". (Response ID: ${responseId})`;
      setResponse(aiResponse);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="mb-4">
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
          Ask the AI Assistant
        </label>
        <div className="flex gap-2">
          <input
            id="prompt"
            type="text"
            value={prompt}
            onChange={(e) => setResponse('')}
            placeholder="Enter your question here..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={getAIResponse}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </div>
      </div>
      
      {response && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-700">AI Response:</h3>
          <p className="mt-1">{response}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Enhanced AI Component with feedback
 * This wraps the base component with the feedback HOC
 */
const AIComponentWithFeedback = withAIFeedback(BaseAIComponent, {
  // Use consistent agent type from constants
  agentType: AGENT_TYPES.ASSISTANT,
  // Provide appropriate context
  feedbackContext: FEEDBACK_CONTEXTS.CLINICAL_INQUIRY,
  // Default user role if not provided
  defaultUserRole: USER_ROLES.DENTIST,
});

/**
 * Example usage component
 */
export function AIFeedbackExample() {
  return (
    <div className="max-w-2xl mx-auto my-8">
      <h1 className="text-2xl font-bold mb-6">AI Feedback Integration Example</h1>
      
      <div className="space-y-8">
        {/* Example with default role */}
        <div>
          <h2 className="text-lg font-medium mb-2">Example 1: Default Role</h2>
          <AIComponentWithFeedback 
            prompt="What is the recommended treatment for dental abscess?" 
          />
        </div>
        
        {/* Example with specific role */}
        <div>
          <h2 className="text-lg font-medium mb-2">Example 2: Patient Role</h2>
          <AIComponentWithFeedback 
            prompt="How long does a root canal procedure take?"
            userRole={USER_ROLES.PATIENT}
          />
        </div>
      </div>
    </div>
  );
}

export default AIFeedbackExample;
