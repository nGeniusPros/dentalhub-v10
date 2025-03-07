import { Claim, ValidationError, ClaimStatus } from '../../types/claims.types';

/**
 * Validates a claim for completeness and correctness.
 * Returns an array of validation errors, empty if validation passes.
 */
export const validateClaim = (claim: Claim): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Required fields validation
  if (!claim.patientId) {
    errors.push({ field: 'patientId', message: 'Patient information is required' });
  }
  
  if (!claim.providerId) {
    errors.push({ field: 'providerId', message: 'Provider information is required' });
  }
  
  if (!claim.serviceDate) {
    errors.push({ field: 'serviceDate', message: 'Service date is required' });
  } else {
    // Validate date format and logic
    const serviceDate = new Date(claim.serviceDate);
    const today = new Date();
    
    if (isNaN(serviceDate.getTime())) {
      errors.push({ field: 'serviceDate', message: 'Invalid service date format' });
    } else if (serviceDate > today) {
      errors.push({ field: 'serviceDate', message: 'Service date cannot be in the future' });
    }
  }
  
  // Procedure codes validation
  if (!claim.procedureCodes || claim.procedureCodes.length === 0) {
    errors.push({ field: 'procedureCodes', message: 'At least one procedure code is required' });
  } else {
    // Validate each procedure code
    claim.procedureCodes.forEach((proc, index) => {
      if (!proc.code) {
        errors.push({ field: `procedureCodes[${index}].code`, message: 'Procedure code is required' });
      }
      
      if (!proc.description) {
        errors.push({ field: `procedureCodes[${index}].description`, message: 'Procedure description is required' });
      }
      
      if (proc.fee === undefined || proc.fee <= 0) {
        errors.push({ field: `procedureCodes[${index}].fee`, message: 'Valid procedure fee is required' });
      }
      
      if (!proc.date) {
        errors.push({ field: `procedureCodes[${index}].date`, message: 'Procedure date is required' });
      }
      
      // For dental procedures, validate tooth/surface/quadrant as appropriate
      if (!proc.tooth && !proc.surface && !proc.quadrant) {
        errors.push({ 
          field: `procedureCodes[${index}]`, 
          message: 'Tooth, surface, or quadrant information is required for dental procedures' 
        });
      }
    });
  }
  
  // Diagnosis codes validation (required for insurance submission)
  if (claim.status !== ClaimStatus.DRAFT && (!claim.diagnosisCodes || claim.diagnosisCodes.length === 0)) {
    errors.push({ field: 'diagnosisCodes', message: 'At least one diagnosis code is required for claim submission' });
  }
  
  // Insurance information validation
  if (!claim.insuranceInfo) {
    errors.push({ field: 'insuranceInfo', message: 'Insurance information is required' });
  } else {
    if (!claim.insuranceInfo.payerId) {
      errors.push({ field: 'insuranceInfo.payerId', message: 'Insurance payer is required' });
    }
    
    if (!claim.insuranceInfo.subscriberId) {
      errors.push({ field: 'insuranceInfo.subscriberId', message: 'Subscriber ID is required' });
    }
  }
  
  // Validate total fee matches sum of procedure fees
  if (claim.procedureCodes && claim.procedureCodes.length > 0) {
    const calculatedTotal = claim.procedureCodes.reduce((sum, proc) => sum + (proc.fee || 0), 0);
    
    if (Math.abs(calculatedTotal - claim.totalFee) > 0.01) { // Allow for small rounding differences
      errors.push({ field: 'totalFee', message: `Total fee (${claim.totalFee}) does not match sum of procedure fees (${calculatedTotal.toFixed(2)})` });
    }
  }
  
  // Additional validations for various claim states
  if (claim.status === ClaimStatus.SUBMITTED || claim.status === ClaimStatus.ACCEPTED) {
    // For submitted claims, ensure all required fields for electronic submission are present
    if (!claim.insuranceInfo.groupNumber) {
      errors.push({ field: 'insuranceInfo.groupNumber', message: 'Group number is required for claim submission' });
    }
  }
  
  if (claim.status === ClaimStatus.REJECTED && !claim.rejectionReason) {
    errors.push({ field: 'rejectionReason', message: 'Rejection reason is required for rejected claims' });
  }
  
  if (claim.status === ClaimStatus.PAID) {
    if (claim.paymentAmount === undefined || claim.paymentAmount <= 0) {
      errors.push({ field: 'paymentAmount', message: 'Payment amount is required for paid claims' });
    }
    
    if (claim.patientResponsibility === undefined) {
      errors.push({ field: 'patientResponsibility', message: 'Patient responsibility amount is required for paid claims' });
    }
  }
  
  return errors;
};

/**
 * Validates a claim specifically for insurance submission.
 * This includes additional checks required by clearinghouses and payers.
 */
export const validateClaimForSubmission = (claim: Claim): ValidationError[] => {
  // Start with basic validation
  const errors = validateClaim(claim);
  
  // Additional validation specific to claim submission
  
  // Subscriber relationship validation
  if (!claim.insuranceInfo.relationToSubscriber) {
    errors.push({ 
      field: 'insuranceInfo.relationToSubscriber', 
      message: 'Relationship to subscriber is required for claim submission' 
    });
  }
  
  // Ensure all procedures have properly formatted dates
  claim.procedureCodes.forEach((proc, index) => {
    if (proc.date) {
      const procDate = new Date(proc.date);
      if (isNaN(procDate.getTime())) {
        errors.push({ 
          field: `procedureCodes[${index}].date`, 
          message: 'Procedure date must be in a valid format (YYYY-MM-DD)' 
        });
      }
    }
  });
  
  // Ensure diagnosis codes are properly formatted (ICD-10 format)
  if (claim.diagnosisCodes && claim.diagnosisCodes.length > 0) {
    claim.diagnosisCodes.forEach((diag, index) => {
      if (diag.code && !diag.code.match(/^[A-Z][0-9][0-9A-Z]\.?[0-9A-Z]{0,4}$/)) {
        errors.push({ 
          field: `diagnosisCodes[${index}].code`, 
          message: 'Diagnosis code must be in valid ICD-10 format' 
        });
      }
    });
  }
  
  return errors;
};

/**
 * Checks if a claim is ready for submission to insurance.
 * Returns true if the claim passes all validation checks, false otherwise.
 */
export const isClaimReadyForSubmission = (claim: Claim): boolean => {
  const errors = validateClaimForSubmission(claim);
  return errors.length === 0;
};