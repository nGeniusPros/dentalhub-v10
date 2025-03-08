/**
 * TypeScript interfaces for the claims processing system
 */

/**
 * Enum representing the possible status values for a claim
 */
export enum ClaimStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  PAID = 'paid'
}

/**
 * Type for filtering claims by status
 */
export type ClaimStatusFilter = 'all' | ClaimStatus.DRAFT | ClaimStatus.PENDING | 
  ClaimStatus.SUBMITTED | ClaimStatus.ACCEPTED | ClaimStatus.REJECTED | ClaimStatus.PAID;

/**
 * Interface for dental procedure code information
 */
export interface ProcedureCode {
  code: string;
  description: string;
  fee: number;
  date: string;
  tooth?: string;
  surface?: string;
  quadrant?: string;
}

/**
 * Interface for diagnosis code information
 */
export interface DiagnosisCode {
  code: string;
  description: string;
}

/**
 * Interface for insurance information
 */
export interface InsuranceInfo {
  payerId: string;
  payerName?: string;
  planId?: string;
  planName?: string;
  subscriberId: string;
  groupNumber?: string;
  relationToSubscriber?: string;
}

/**
 * Interface for claim attachment
 */
export interface Attachment {
  id: string;
  claimId: string;
  filename: string;
  type: string;
  url: string;
  uploadedAt: string;
  size: number;
  contentType?: string;
}

/**
 * Interface for claim event history
 */
export interface ClaimEvent {
  timestamp: string;
  title: string;
  description: string;
  status: ClaimStatus;
  userId?: string;
}

/**
 * Interface for a dental insurance claim
 */
export interface Claim {
  id: string;
  patientId: string;
  patientName?: string;
  providerId: string;
  providerName?: string;
  serviceDate: string;
  procedureCodes: ProcedureCode[];
  diagnosisCodes: DiagnosisCode[];
  insuranceInfo: InsuranceInfo;
  totalFee: number;
  status: ClaimStatus;
  createdAt: string;
  updatedAt: string;
  attachments?: Attachment[];
  events?: ClaimEvent[];
  notes?: string;
  rejectionReason?: string;
  paymentAmount?: number;
  adjustmentAmount?: number;
  patientResponsibility?: number;
}

/**
 * Interface for validation errors
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Interface for Electronic Remittance Advice (ERA)
 */
export interface ERA {
  id: string;
  payerId: string;
  payerName: string;
  checkNumber?: string;
  checkDate?: string;
  receivedDate: string;
  totalPayment: number;
  claimCount: number;
  processedAt?: string;
  payments?: Payment[];
}

/**
 * Interface for payment received through ERA
 */
export interface Payment {
  id: string;
  eraId: string;
  claimId: string;
  patientId: string;
  patientName: string;
  serviceDate: string;
  paymentAmount: number;
  adjustmentAmount: number;
  patientResponsibility: number;
  processedAt?: string;
}

/**
 * Interface for insurance verification result
 */
export interface InsuranceVerificationResult {
  patientId: string;
  insuranceId: string;
  verificationDate: string;
  eligible: boolean;
  coverageStart: string;
  coverageEnd?: string;
  planName: string;
  planType: string;
  subscriberId: string;
  groupNumber?: string;
  deductible: {
    individual: number;
    family: number;
    remaining?: number;
  };
  remainingBenefit: number;
  coveragePercentages?: {
    preventive: number;
    basic: number;
    major: number;
    orthodontic?: number;
  };
  waitingPeriods?: {
    basic?: string;
    major?: string;
    orthodontic?: string;
  };
  verificationNotes?: string;
}

/**
 * Interface for claims dashboard summary data
 */
export interface ClaimsSummary {
  total: number;
  draft: number;
  pending: number;
  submitted: number;
  accepted: number;
  approved: number; // Alias for accepted (for backward compatibility)
  rejected: number;
  paid: number;
}

/**
 * Interface for claims analysis result from AI
 */
export interface ClaimsAnalysisResult {
  rejectionRiskScore: number;
  riskFactors: string[];
  suggestions: string[];
  similarClaims?: {
    id: string;
    status: string;
    similarityScore: number;
  }[];
}

/**
 * Interface for claim submission response
 */
export interface ClaimSubmissionResponse {
  success: boolean;
  message: string;
  claim?: Claim;
  trackingId?: string;
  errors?: ValidationError[];
}

/**
 * Interface for claim update response
 */
export interface ClaimUpdateResponse {
  success: boolean;
  message: string;
  claim?: Claim;
  errors?: ValidationError[];
}