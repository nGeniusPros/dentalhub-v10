import { 
  Claim, 
  ClaimStatus, 
  ERA, 
  InsuranceVerificationResult, 
  ClaimEvent,
  Attachment,
  ProcedureCode,
  DiagnosisCode
} from '../types/claims.types';
import { formatDateToYYYYMMDD, getDateFromToday } from '../utils/dateUtils';

/**
 * Generate a random ID with a prefix
 */
const generateId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substring(2, 10)}`;
};

/**
 * Generate a random dollar amount between min and max
 */
const randomAmount = (min: number, max: number): number => {
  return +(Math.random() * (max - min) + min).toFixed(2);
};

/**
 * Generate an array of mock procedure codes
 */
const generateProcedureCodes = (count: number = 1): ProcedureCode[] => {
  const procedureCodes: ProcedureCode[] = [
    {
      code: 'D0120',
      description: 'Periodic Oral Evaluation',
      fee: 65.00,
      date: formatDateToYYYYMMDD(getDateFromToday(-7))
    },
    {
      code: 'D0274',
      description: 'Bitewings - Four Films',
      fee: 80.00,
      date: formatDateToYYYYMMDD(getDateFromToday(-7))
    },
    {
      code: 'D1110',
      description: 'Prophylaxis - Adult',
      fee: 110.00,
      date: formatDateToYYYYMMDD(getDateFromToday(-7))
    },
    {
      code: 'D2150',
      description: 'Amalgam - Two Surfaces',
      fee: 195.00,
      date: formatDateToYYYYMMDD(getDateFromToday(-7)),
      tooth: '19',
      surface: 'MO'
    },
    {
      code: 'D2330',
      description: 'Resin - One Surface, Anterior',
      fee: 180.00,
      date: formatDateToYYYYMMDD(getDateFromToday(-7)),
      tooth: '8',
      surface: 'F'
    },
    {
      code: 'D2750',
      description: 'Crown - Porcelain Fused to High Noble Metal',
      fee: 1250.00,
      date: formatDateToYYYYMMDD(getDateFromToday(-7)),
      tooth: '30'
    },
    {
      code: 'D4341',
      description: 'Periodontal Scaling and Root Planing, Four or More Teeth Per Quadrant',
      fee: 230.00,
      date: formatDateToYYYYMMDD(getDateFromToday(-7)),
      quadrant: 'UR'
    },
    {
      code: 'D7140',
      description: 'Extraction, Erupted Tooth or Exposed Root',
      fee: 195.00,
      date: formatDateToYYYYMMDD(getDateFromToday(-7)),
      tooth: '32'
    }
  ];
  
  // Return a random subset of procedure codes
  return procedureCodes
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.min(count, procedureCodes.length));
};

/**
 * Generate an array of mock diagnosis codes
 */
const generateDiagnosisCodes = (count: number = 1): DiagnosisCode[] => {
  const diagnosisCodes: DiagnosisCode[] = [
    {
      code: 'K02.9',
      description: 'Dental caries, unspecified'
    },
    {
      code: 'K05.1',
      description: 'Chronic gingivitis'
    },
    {
      code: 'K05.3',
      description: 'Chronic periodontitis'
    },
    {
      code: 'K08.9',
      description: 'Disorder of teeth and supporting structures, unspecified'
    },
    {
      code: 'K04.0',
      description: 'Pulpitis'
    },
    {
      code: 'K04.7',
      description: 'Periapical abscess without sinus'
    }
  ];
  
  // Return a random subset of diagnosis codes
  return diagnosisCodes
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.min(count, diagnosisCodes.length));
};

/**
 * Generate a list of claim events based on the claim status
 */
const generateClaimEvents = (claimId: string, status: ClaimStatus): ClaimEvent[] => {
  const events: ClaimEvent[] = [];
  const createdDate = getDateFromToday(-30);
  
  // All claims have a created event
  events.push({
    id: generateId('event'),
    timestamp: createdDate.toISOString(),
    title: 'Claim Created',
    description: 'Claim was created as a draft',
    status: ClaimStatus.DRAFT
  });
  
  if (status === ClaimStatus.DRAFT) {
    return events;
  }
  
  // Add submitted event
  const submittedDate = new Date(createdDate);
  submittedDate.setDate(createdDate.getDate() + 2);
  events.push({
    id: generateId('event'),
    timestamp: submittedDate.toISOString(),
    title: 'Claim Submitted',
    description: 'Claim was submitted to the insurance carrier',
    status: ClaimStatus.SUBMITTED
  });
  
  if (status === ClaimStatus.SUBMITTED) {
    return events;
  }
  
  // Add received event
  const receivedDate = new Date(submittedDate);
  receivedDate.setDate(submittedDate.getDate() + 1);
  events.push({
    id: generateId('event'),
    timestamp: receivedDate.toISOString(),
    title: 'Claim Received',
    description: 'Insurance carrier acknowledged receipt of claim',
    status: ClaimStatus.PENDING
  });
  
  if (status === ClaimStatus.PENDING) {
    return events;
  }
  
  // For accepted claims
  if (status === ClaimStatus.ACCEPTED) {
    const acceptedDate = new Date(receivedDate);
    acceptedDate.setDate(receivedDate.getDate() + 5);
    events.push({
      id: generateId('event'),
      timestamp: acceptedDate.toISOString(),
      title: 'Claim Accepted',
      description: 'Claim was accepted by the insurance carrier',
      status: ClaimStatus.ACCEPTED
    });
    return events;
  }
  
  // For rejected claims
  if (status === ClaimStatus.REJECTED) {
    const rejectedDate = new Date(receivedDate);
    rejectedDate.setDate(receivedDate.getDate() + 5);
    events.push({
      id: generateId('event'),
      timestamp: rejectedDate.toISOString(),
      title: 'Claim Rejected',
      description: 'Claim was rejected by the insurance carrier due to missing information',
      status: ClaimStatus.REJECTED
    });
    return events;
  }
  
  // For paid claims
  if (status === ClaimStatus.PAID) {
    const acceptedDate = new Date(receivedDate);
    acceptedDate.setDate(receivedDate.getDate() + 5);
    events.push({
      id: generateId('event'),
      timestamp: acceptedDate.toISOString(),
      title: 'Claim Accepted',
      description: 'Claim was accepted by the insurance carrier',
      status: ClaimStatus.ACCEPTED
    });
    
    const paidDate = new Date(acceptedDate);
    paidDate.setDate(acceptedDate.getDate() + 10);
    events.push({
      id: generateId('event'),
      timestamp: paidDate.toISOString(),
      title: 'Payment Received',
      description: 'Payment received from insurance carrier',
      status: ClaimStatus.PAID
    });
    return events;
  }
  
  return events;
};

/**
 * Generate mock attachments for a claim
 */
const generateAttachments = (claimId: string, count: number = 0): Attachment[] => {
  if (count === 0) return [];
  
  const attachmentTypes = ['xray', 'photo', 'narrative', 'perio', 'other'];
  const attachments: Attachment[] = [];
  
  for (let i = 0; i < count; i++) {
    const type = attachmentTypes[Math.floor(Math.random() * attachmentTypes.length)];
    attachments.push({
      id: generateId('attach'),
      claimId,
      filename: `${type}_${i + 1}.${type === 'narrative' ? 'pdf' : 'jpg'}`,
      type,
      url: 'https://example.com/attachments/placeholder.jpg',
      uploadedAt: getDateFromToday(-15 + i).toISOString(),
      size: Math.floor(Math.random() * 5000000) + 100000, // Between 100KB and 5MB
      contentType: type === 'narrative' ? 'application/pdf' : 'image/jpeg'
    });
  }
  
  return attachments;
};

/**
 * Generate a set of mock claims for testing
 */
export const mockClaims: Claim[] = [
  // Draft claim
  {
    id: generateId('claim'),
    patientId: 'patient-1',
    patientName: 'John Smith',
    providerId: 'provider-1',
    providerName: 'Dr. Jane Dentist',
    serviceDate: formatDateToYYYYMMDD(getDateFromToday(-7)),
    procedureCodes: generateProcedureCodes(2),
    diagnosisCodes: generateDiagnosisCodes(1),
    insuranceInfo: {
      payerId: 'INS001',
      payerName: 'Delta Dental',
      planId: 'DDPLAN100',
      planName: 'Delta Dental PPO',
      subscriberId: 'SUB123456',
      groupNumber: 'GRP7890'
    },
    totalFee: 175.00,
    status: ClaimStatus.DRAFT,
    createdAt: getDateFromToday(-7).toISOString(),
    updatedAt: getDateFromToday(-7).toISOString(),
    attachments: [],
    events: generateClaimEvents(generateId('claim'), ClaimStatus.DRAFT)
  },
  
  // Pending claim
  {
    id: generateId('claim'),
    patientId: 'patient-2',
    patientName: 'Sarah Johnson',
    providerId: 'provider-1',
    providerName: 'Dr. Jane Dentist',
    serviceDate: formatDateToYYYYMMDD(getDateFromToday(-14)),
    procedureCodes: generateProcedureCodes(3),
    diagnosisCodes: generateDiagnosisCodes(2),
    insuranceInfo: {
      payerId: 'INS002',
      payerName: 'Cigna Dental',
      planId: 'CIGDENT200',
      planName: 'Cigna Dental PPO',
      subscriberId: 'CIG789012',
      groupNumber: 'EMPG12345'
    },
    totalFee: 385.00,
    status: ClaimStatus.PENDING,
    createdAt: getDateFromToday(-30).toISOString(),
    updatedAt: getDateFromToday(-27).toISOString(),
    attachments: generateAttachments(generateId('claim'), 2),
    events: generateClaimEvents(generateId('claim'), ClaimStatus.PENDING)
  },
  
  // Submitted claim
  {
    id: generateId('claim'),
    patientId: 'patient-3',
    patientName: 'Michael Brown',
    providerId: 'provider-1',
    providerName: 'Dr. Jane Dentist',
    serviceDate: formatDateToYYYYMMDD(getDateFromToday(-21)),
    procedureCodes: generateProcedureCodes(1),
    diagnosisCodes: generateDiagnosisCodes(1),
    insuranceInfo: {
      payerId: 'INS003',
      payerName: 'Aetna',
      planId: 'AETDEN300',
      planName: 'Aetna Dental DMO',
      subscriberId: 'AET456789',
      groupNumber: 'AETGRP123'
    },
    totalFee: 110.00,
    status: ClaimStatus.SUBMITTED,
    createdAt: getDateFromToday(-25).toISOString(),
    updatedAt: getDateFromToday(-23).toISOString(),
    attachments: [],
    events: generateClaimEvents(generateId('claim'), ClaimStatus.SUBMITTED)
  },
  
  // Rejected claim
  {
    id: generateId('claim'),
    patientId: 'patient-4',
    patientName: 'Emily Wilson',
    providerId: 'provider-2',
    providerName: 'Dr. Robert Molar',
    serviceDate: formatDateToYYYYMMDD(getDateFromToday(-35)),
    procedureCodes: generateProcedureCodes(2),
    diagnosisCodes: generateDiagnosisCodes(1),
    insuranceInfo: {
      payerId: 'INS001',
      payerName: 'Delta Dental',
      planId: 'DDPLAN100',
      planName: 'Delta Dental PPO',
      subscriberId: 'DD789012',
      groupNumber: 'DDGRP456'
    },
    totalFee: 275.00,
    status: ClaimStatus.REJECTED,
    createdAt: getDateFromToday(-40).toISOString(),
    updatedAt: getDateFromToday(-30).toISOString(),
    attachments: generateAttachments(generateId('claim'), 1),
    events: generateClaimEvents(generateId('claim'), ClaimStatus.REJECTED),
    rejectionReason: 'Missing tooth number for procedure D2150'
  },
  
  // Accepted claim
  {
    id: generateId('claim'),
    patientId: 'patient-5',
    patientName: 'David Rodriguez',
    providerId: 'provider-2',
    providerName: 'Dr. Robert Molar',
    serviceDate: formatDateToYYYYMMDD(getDateFromToday(-28)),
    procedureCodes: generateProcedureCodes(3),
    diagnosisCodes: generateDiagnosisCodes(2),
    insuranceInfo: {
      payerId: 'INS004',
      payerName: 'MetLife',
      planId: 'METDEN400',
      planName: 'MetLife Dental PPO',
      subscriberId: 'MET123456',
      groupNumber: 'METGRP789'
    },
    totalFee: 425.00,
    status: ClaimStatus.ACCEPTED,
    createdAt: getDateFromToday(-35).toISOString(),
    updatedAt: getDateFromToday(-25).toISOString(),
    attachments: generateAttachments(generateId('claim'), 2),
    events: generateClaimEvents(generateId('claim'), ClaimStatus.ACCEPTED)
  },
  
  // Paid claim
  {
    id: generateId('claim'),
    patientId: 'patient-6',
    patientName: 'Jessica Taylor',
    providerId: 'provider-1',
    providerName: 'Dr. Jane Dentist',
    serviceDate: formatDateToYYYYMMDD(getDateFromToday(-45)),
    procedureCodes: generateProcedureCodes(4),
    diagnosisCodes: generateDiagnosisCodes(2),
    insuranceInfo: {
      payerId: 'INS002',
      payerName: 'Cigna Dental',
      planId: 'CIGDENT200',
      planName: 'Cigna Dental PPO',
      subscriberId: 'CIG456123',
      groupNumber: 'CIGGRP789'
    },
    totalFee: 650.00,
    status: ClaimStatus.PAID,
    createdAt: getDateFromToday(-50).toISOString(),
    updatedAt: getDateFromToday(-15).toISOString(),
    attachments: generateAttachments(generateId('claim'), 3),
    events: generateClaimEvents(generateId('claim'), ClaimStatus.PAID),
    paymentAmount: 520.00,
    adjustmentAmount: 65.00,
    patientResponsibility: 65.00
  }
];

/**
 * Generate mock ERA data
 */
export const mockERAs: ERA[] = [
  {
    id: generateId('era'),
    payerId: 'INS001',
    payerName: 'Delta Dental',
    checkNumber: 'DD123456',
    checkDate: formatDateToYYYYMMDD(getDateFromToday(-5)),
    receivedDate: formatDateToYYYYMMDD(getDateFromToday(-3)),
    totalPayment: 1250.75,
    claimCount: 3,
    created_at: getDateFromToday(-3).toISOString()
  },
  {
    id: generateId('era'),
    payerId: 'INS002',
    payerName: 'Cigna Dental',
    checkNumber: 'CIG789012',
    checkDate: formatDateToYYYYMMDD(getDateFromToday(-7)),
    receivedDate: formatDateToYYYYMMDD(getDateFromToday(-5)),
    totalPayment: 875.50,
    claimCount: 2,
    created_at: getDateFromToday(-5).toISOString()
  },
  {
    id: generateId('era'),
    payerId: 'INS003',
    payerName: 'Aetna',
    checkNumber: 'AET345678',
    checkDate: formatDateToYYYYMMDD(getDateFromToday(-10)),
    receivedDate: formatDateToYYYYMMDD(getDateFromToday(-8)),
    totalPayment: 520.25,
    claimCount: 1,
    processedAt: getDateFromToday(-7).toISOString(),
    created_at: getDateFromToday(-8).toISOString()
  }
];

/**
 * Generate a mock insurance verification result
 */
export const generateMockVerificationResult = (
  patientId: string,
  insuranceId: string
): InsuranceVerificationResult => {
  // Randomly determine eligibility (80% chance of being eligible)
  const eligible = Math.random() > 0.2;
  
  // Generate coverage dates
  const coverageStart = formatDateToYYYYMMDD(getDateFromToday(-365));
  
  // 70% chance of having coverage end date (30% chance of being ongoing)
  const hasCoverageEnd = Math.random() > 0.3;
  const coverageEnd = hasCoverageEnd ? 
    formatDateToYYYYMMDD(getDateFromToday(365)) : undefined;
  
  return {
    patientId,
    insuranceId,
    verificationDate: formatDateToYYYYMMDD(new Date()),
    eligible,
    coverageStart,
    coverageEnd,
    planName: 'Dental Complete PPO',
    planType: 'PPO',
    subscriberId: `SUB${Math.floor(Math.random() * 1000000)}`,
    groupNumber: `GRP${Math.floor(Math.random() * 100000)}`,
    deductible: {
      individual: randomAmount(25, 100),
      family: randomAmount(75, 300),
      remaining: randomAmount(0, 50)
    },
    remainingBenefit: randomAmount(500, 1500),
    coveragePercentages: {
      preventive: 100,
      basic: 80,
      major: 50,
      orthodontic: 50
    },
    waitingPeriods: {
      basic: '0 months',
      major: '6 months',
      orthodontic: '12 months'
    },
    verificationNotes: eligible ? 
      'Patient is eligible for benefits. No prior authorizations required for standard procedures.' : 
      'Patient is not currently eligible. Coverage terminated or not active.'
  };
};