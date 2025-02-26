import { useState } from 'react';
import { HeadBrainConsultant, HeadBrainResponse } from '../ai/orchestrator/head-brain.agent';

/**
 * Custom hook for using the AI orchestrator in React components
 * Manages state and provides a way to easily interact with the HeadBrainConsultant
 */
export function useOrchestrator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<HeadBrainResponse | null>(null);
  
  // Singleton instance of the orchestrator
  const orchestrator = new HeadBrainConsultant();

  /**
   * Ask a question to the AI orchestrator
   * @param question The user's question or request
   * @returns The orchestrator's response or null if error
   */
  async function askOrchestrator(question: string): Promise<HeadBrainResponse | null> {
    setLoading(true);
    setError(null);
    
    try {
      const response = await orchestrator.handleQuery(question);
      setResponse(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Reset the orchestrator state
   */
  function resetOrchestrator() {
    setResponse(null);
    setError(null);
  }

  return { 
    askOrchestrator, 
    resetOrchestrator,
    loading, 
    error,
    response
  };
}