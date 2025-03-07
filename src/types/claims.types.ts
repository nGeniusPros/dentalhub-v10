/**
 * Claims processing type definitions
 */

export enum ClaimStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  PAID = 'paid'
}

export type ClaimStatusFilter = 'all' | ClaimStatus;

/**
 * Represents a dental procedure code with associated information
 */
export interface ProcedureCode {
  id?: string;
  code: string;
  description: string;
  fee: number;
  date: string;
  tooth?: string;
  surface?: string;
  quadrant?: string;
}

/**
 * Represents a medical diagnosis code
 */
export interface DiagnosisCode {
  id?: string;
  code: string;
  description: string;
}

/**
 * Insurance information for a claim
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
 * Represents a document attached to a claim
 */
export interface Attachment {
  id: string;
  claimId: string;
  filename: string;
  type: string;
  url: string;
  contentType: string;
  size: number;
  uploadedAt: string;
}

/**
 * Represents an event in the claim's lifecycle
 */
export interface ClaimEvent {
  id?: string;
  timestamp: string;
  title: string;
  description: string;
  status: ClaimStatus;
  userId?: string;
}

/**
 * The main claim data structure
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
 * Validation error for claim data
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Electronic Remittance Advice (ERA) data structure
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
  createdAt: string;
  payments?: Payment[];
}

/**
 * Payment information from an ERA
 */
export interface Payment {
  id: string;
  eraId: string;
  claimId: string;
  patientId: string;
  patientName?: string;
  serviceDate: string;
  paymentAmount: number;
  adjustmentAmount: number;
  patientResponsibility: number;
  processedAt?: string;
  createdAt?: string;
}

/**
 * Insurance verification result
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
 * Response structure for claim submission operations
 */
export interface ClaimSubmissionResponse {
  success: boolean;
  message: string;
  claim?: Claim;
  validationErrors?: ValidationError[];
}

/**
 * Response structure for claim update operations
 */
export interface ClaimUpdateResponse {
  success: boolean;
  message: string;
  claim?: Claim;
}

/**
 * Response structure for generic claim operations
 */
export interface ClaimOperationResponse {
  success: boolean;
  message: string;
}

/**
 * Summary statistics for claims by status
 */
export interface ClaimsSummaryData {
  total: number;
  draft: number;
  pending: number;
  submitted: number;
  accepted: number;
  rejected: number;
  paid: number;
}

/**
 * Report data for claims analytics
 */
export interface ClaimsReportData {
  byStatus: {
    status: ClaimStatus;
    count: number;
  }[];
  byMonth: {
    month: string;
    submitted: number;
    paid: number;
    rejected: number;
  }[];
  avgProcessingTime: {
    payer: string;
    days: number;
  }[];
  topRejectionReasons: {
    reason: string;
    count: number;
  }[];
  financialSummary: {
    totalBilled: number;
    totalPaid: number;
    totalAdjusted: number;
    totalPatientResponsibility: number;
    averageReimbursementRate: number;
  };
}