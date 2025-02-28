/**
 * AI Agent Type Constants
 * 
 * IMPORTANT: These constants should be used throughout the app
 * to ensure consistency in agent naming and tracking.
 * This consistency is crucial for the reinforcement learning system.
 */

export const AGENT_TYPES = {
  /** For dental treatment planning and consultation */
  CONSULTANT: 'consultant',
  
  /** For general dental knowledge and assistance */
  ASSISTANT: 'assistant',
  
  /** For diagnostic analysis and suggestions */
  DIAGNOSTIC: 'diagnostic',
  
  /** For treatment-specific recommendations */
  TREATMENT: 'treatment',
  
  /** For general chat interactions */
  CHAT: 'chat',
  
  /** For voice-based interactions */
  VOICE: 'voice',
} as const;

/**
 * Feedback context types
 */
export const FEEDBACK_CONTEXTS = {
  /** For diagnostic-related interactions */
  DIAGNOSTIC: 'diagnostic',
  
  /** For treatment planning contexts */
  TREATMENT_PLANNING: 'treatment-planning',
  
  /** For patient communication assistance */
  PATIENT_COMMUNICATION: 'patient-communication',
  
  /** For clinical inquiries and knowledge */
  CLINICAL_INQUIRY: 'clinical-inquiry',
  
  /** For administrative tasks */
  ADMINISTRATIVE: 'administrative',
  
  /** For billing-related assistance */
  BILLING: 'billing',
  
  /** For general inquiries */
  GENERAL: 'general',
} as const;

/**
 * User roles in the system
 */
export const USER_ROLES = {
  DENTIST: 'dentist',
  STAFF: 'staff',
  ADMIN: 'admin',
  PATIENT: 'patient',
  EXPERT: 'expert',
  GUEST: 'guest',
} as const;

// Type definitions based on constants
export type AgentType = typeof AGENT_TYPES[keyof typeof AGENT_TYPES];
export type FeedbackContext = typeof FEEDBACK_CONTEXTS[keyof typeof FEEDBACK_CONTEXTS];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
