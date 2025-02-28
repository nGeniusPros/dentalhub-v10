/**
 * AI Feedback Types for the DentalHub AI Feedback System
 */
import { 
  AgentType, 
  FeedbackContext, 
  UserRole 
} from '../constants/ai-agents';

/**
 * Feedback submission types
 */
export type FeedbackSubmissionType = 'thumbs' | 'rating' | 'correction' | 'comment';

/**
 * Feedback data structure for submission
 */
export interface AIFeedbackSubmission {
  responseId: string;
  agentType: AgentType;
  userRole: UserRole;
  feedbackContext: FeedbackContext;
  modelVersion?: string;
  feedbackType: FeedbackSubmissionType;
  wasHelpful?: boolean | null;
  feedbackText?: string;
  timestamp?: string;
}

/**
 * Complete feedback record as stored in database
 */
export interface AIFeedbackRecord extends AIFeedbackSubmission {
  id: string;
  isValidated: boolean;
  isProcessed: boolean;
  aiImprovementScore?: number;
  createdAt: string;
  updatedAt?: string;
  validatedBy?: string;
  validationNotes?: string;
}

/**
 * Feedback summary statistics
 */
export interface FeedbackStats {
  total: number;
  helpful: number;
  unhelpful: number;
  validated: number;
  byAgent: Record<AgentType, {
    total: number;
    helpful: number;
    unhelpful: number;
  }>;
  byContext: Record<FeedbackContext, {
    total: number;
    helpful: number;
    unhelpful: number;
  }>;
  byMonth: Record<string, {
    total: number;
    helpful: number;
    unhelpful: number;
  }>;
}

/**
 * Training dataset structure 
 */
export interface AITrainingDataset {
  id: string;
  name: string;
  description: string;
  agentType: AgentType;
  feedbackContext?: FeedbackContext;
  responseCount: number;
  feedbackCount: number;
  positiveExamples: number;
  negativeExamples: number;
  createdBy: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Configuration for AI feedback system
 */
export interface AIFeedbackConfig {
  enabledAgentTypes: AgentType[];
  requireCommentForNegativeFeedback: boolean;
  validationThreshold: number;
  minimumCommentLength: number;
  enableAnalytics: boolean;
  feedbackRevisionWindow: number; // Hours
}

/**
 * A single data point for feedback analytics charts
 */
export interface FeedbackDataPoint {
  name: string;
  helpful: number;
  unhelpful: number;
  total: number;
  helpfulRate: number;
}

/**
 * Prepared analytics data for charts
 */
export interface FeedbackAnalyticsData {
  summary: {
    total: number;
    helpful: number;
    unhelpful: number;
    helpfulRate: number;
    validated: number;
    validatedRate: number;
    commentCount: number;
    commentRate: number;
  };
  byAgent: FeedbackDataPoint[];
  byContext: FeedbackDataPoint[];
  byMonth: FeedbackDataPoint[];
  byUser: FeedbackDataPoint[];
  recentFeedback: AIFeedbackRecord[];
}

/**
 * AI Model improvement data
 */
export interface AIModelImprovement {
  id: string;
  modelVersion: string;
  agentType: AgentType;
  improvementDescription: string;
  baseDatasetId: string;
  feedbackCount: number;
  beforeHelpfulRate: number;
  afterHelpfulRate: number;
  deployedAt?: string;
  createdBy: string;
  createdAt: string;
}

/**
 * Feedback filtering options
 */
export interface FeedbackFilterOptions {
  agentType?: AgentType[];
  feedbackContext?: FeedbackContext[];
  userRole?: UserRole[];
  helpful?: boolean;
  hasComment?: boolean;
  isValidated?: boolean;
  dateFrom?: string;
  dateTo?: string;
  modelVersion?: string;
}
