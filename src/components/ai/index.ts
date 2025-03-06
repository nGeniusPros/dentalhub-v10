/**
 * AI Components Index
 * Export all AI-related components for easy importing
 */

// Feedback Components
export { default as AIResponseFeedback } from './AIResponseFeedback';
export { default as AIConsultantChat } from './AIConsultantChat';
export { AISDRAgentChat, AIMarketingManagerChat, AISocialMediaManagerChat } from './AIConsultantChat';

// Admin Dashboard Components
export { default as AIFeedbackDashboard } from '../admin/AIFeedbackDashboard';
export { default as AIFeedbackAnalytics } from '../admin/AIFeedbackAnalytics';

// Hooks
export { useAIFeedback } from '../../hooks/useAIFeedback';
export { default as useAIFeedbackAnalytics } from '../../hooks/useAIFeedbackAnalytics';

// Utilities
export * from '../../utils/ai-feedback-utils';
export * from '../../utils/integrateAIFeedback';

// Types
export * from '../../types/ai-feedback';
