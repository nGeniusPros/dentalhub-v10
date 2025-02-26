import { useState } from 'react';
import { HeadBrainConsultant } from '../ai/orchestrator/head-brain.agent';
import type { AIConsultantPrompt, AIInsight } from '../lib/types/ai';

/**
 * Custom hook for using the AI orchestrator
 * Adapts the HeadBrainConsultant to the existing AIInsight format
 */
export const useAIConsultant = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Create the orchestrator instance
  const orchestrator = new HeadBrainConsultant();

  /**
   * Generate insight using the HeadBrainConsultant orchestrator
   * Adapts between the AIConsultantPrompt and the orchestrator's input format
   */
  const generateInsight = async (prompt: AIConsultantPrompt): Promise<AIInsight | null> => {
    setLoading(true);
    setError(null);

    try {
      // Convert prompt question to query for orchestrator
      const userQuery = `
        ${prompt.question}
        (Context: Monthly Revenue: $${prompt.metrics.monthlyRevenue},
        Patient Count: ${prompt.metrics.patientCount},
        Appointment Fill Rate: ${prompt.metrics.appointmentFillRate}%,
        Treatment Acceptance: ${prompt.metrics.treatmentAcceptance}%)
      `;
      
      // Call the orchestrator
      const response = await orchestrator.handleQuery(userQuery);
      
      // Parse and format the orchestrator response into an AIInsight
      const insight: AIInsight = {
        id: Date.now().toString(),
        title: 'AI-Generated Insight',
        description: response.answer || '',
        impact: determineImpact(prompt.metrics),
        category: mapFocusAreaToCategory(prompt.focusArea),
        action: 'View Details',
      };

      return insight;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate insight');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateInsight,
    loading,
    error
  };
};

/**
 * Maps custom focus area values to the expected category values
 */
const mapFocusAreaToCategory = (focusArea: string): AIInsight['category'] => {
  const mapping: Record<string, AIInsight['category']> = {
    'head-orchestrator': 'operations',
    'data-retrieval': 'operations',
    'data-analysis': 'revenue',
    'lab-case-manager': 'operations',
    'recommendation': 'patient-care'
  };
  
  return mapping[focusArea] || 'operations';
};

/**
 * Determines impact level based on practice metrics
 */
const determineImpact = (metrics: AIConsultantPrompt['metrics']): AIInsight['impact'] => {
  // Logic to determine impact based on metrics
  if (metrics.appointmentFillRate < 70 || metrics.treatmentAcceptance < 60) {
    return 'high';
  } else if (metrics.appointmentFillRate < 85 || metrics.treatmentAcceptance < 75) {
    return 'medium';
  }
  return 'low';
};