/**
 * AI Agent Module
 *
 * This module exports all the AI agents and their interfaces for easier importing.
 */

// Deep Seek Client
export { DeepSeekClient } from './deep-seek/deepSeekUtils';

// Data Retrieval Agent
export { DataRetrievalAgent } from './data-retrieval/data-retrieval.agent';
export type {
  PracticeData,
  RecallData,
  AppointmentData,
  ProcedureData,
  LabCase,
  LabCaseData
} from './data-retrieval/data-retrieval.agent';

// Data Analysis Agent
export { DataAnalysisAgent } from './data-analysis/data-analysis.agent';
export type { KPIAnalysis } from './data-analysis/data-analysis.agent';

// Recommendation Agent
export { RecommendationAgent } from './recommendation/recommendation.agent';
export type { Recommendation } from './recommendation/recommendation.agent';

// Lab Case Manager Agent
export { LabCaseManagerAgent } from './lab-case-manager/lab-case-manager.agent';
export type {
  LabTask,
  LabCaseAnalysis
} from './lab-case-manager/lab-case-manager.agent';

// Head Brain Consultant (Orchestrator)
export { HeadBrainConsultant } from './orchestrator/head-brain.agent';
export type { HeadBrainResponse } from './orchestrator/head-brain.agent';