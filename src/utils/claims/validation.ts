import { Claim, ValidationError, ProcedureCode, ClaimStatus } from '../../types/claims.types';

/**
 * Validates a claim for completeness and correctness
 * @param claim The claim to validate
 * @returns Array of validation errors, empty if claim is valid
 */
export const validateClaim = (claim: Claim): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Required patient information
  if (!claim.patientId) {
    errors.push({ field: 'patientId', message: 'Patient information is required' });
  }
  
  // Required provider information
  if (!claim.providerId) {
    errors.push({ field: 'providerId', message: 'Provider information is required' });
  }
  
  // Required service date
  if (!claim.serviceDate) {
    errors.push({ field: 'serviceDate', message: 'Service date is required' });
  } else {
    const serviceDate = new Date(claim.serviceDate);
    const today = new Date();
    
    if (isNaN(serviceDate.getTime())) {
      errors.push({ field: 'serviceDate', message: 'Invalid service date format' });
    } else if (serviceDate > today) {
      errors.push({ field: 'serviceDate', message: 'Service date cannot be in the future' });
    }
  }
  
  // Validate procedure codes
  if (!claim.procedureCodes || claim.procedureCodes.length === 0) {
    errors.push({ field: 'procedureCodes', message: 'At least one procedure code is required' });
  } else {
    // Validate each procedure code
    claim.procedureCodes.forEach((procedure, index) => {
      validateProcedureCode(procedure, index, errors);
    });
  }
  
  // Validate insurance information
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
  
  // Validate total fee
  if (claim.totalFee === undefined || claim.totalFee <= 0) {
    errors.push({ field: 'totalFee', message: 'Total fee must be greater than zero' });
  } else {
    // Check if total fee matches sum of procedure fees
    const calculatedTotal = claim.procedureCodes.reduce((sum, proc) => sum + proc.fee, 0);
    if (Math.abs(calculatedTotal - claim.totalFee) > 0.01) { // Allow for rounding differences
      errors.push({
        field: 'totalFee',
        message: `Total fee (${claim.totalFee.toFixed(2)}) does not match sum of procedure fees (${calculatedTotal.toFixed(2)})`
      });
    }
  }
  
  // Additional validations for specific status transitions
  if (claim.status === ClaimStatus.SUBMITTED) {
    // Required diagnosis codes for submission
    if (!claim.diagnosisCodes || claim.diagnosisCodes.length === 0) {
      errors.push({ field: 'diagnosisCodes', message: 'At least one diagnosis code is required for submission' });
    }
  }
  
  return errors;
};

/**
 * Validates a single procedure code
 * @param procedure The procedure code to validate
 * @param index The index of the procedure in the array
 * @param errors The errors array to add to
 */
const validateProcedureCode = (procedure: ProcedureCode, index: number, errors: ValidationError[]): void => {
  if (!procedure.code) {
    errors.push({ field: `procedureCodes[${index}].code`, message: 'Procedure code is required' });
  }
  
  if (!procedure.description) {
    errors.push({ field: `procedureCodes[${index}].description`, message: 'Procedure description is required' });
  }
  
  if (procedure.fee === undefined || procedure.fee < 0) {
    errors.push({ field: `procedureCodes[${index}].fee`, message: 'Procedure fee must be non-negative' });
  }
  
  if (!procedure.date) {
    errors.push({ field: `procedureCodes[${index}].date`, message: 'Procedure date is required' });
  } else {
    const procedureDate = new Date(procedure.date);
    const today = new Date();
    
    if (isNaN(procedureDate.getTime())) {
      errors.push({ field: `procedureCodes[${index}].date`, message: 'Invalid procedure date format' });
    } else if (procedureDate > today) {
      errors.push({ field: `procedureCodes[${index}].date`, message: 'Procedure date cannot be in the future' });
    }
  }
  
  // Validate tooth/surface/quadrant based on procedure type
  // This would require more specific dental domain knowledge for accurate validation
  // For example, restorative procedures require tooth and surface information
  if (isDentalProcedureRequiringToothInfo(procedure.code) && !procedure.tooth) {
    errors.push({ field: `procedureCodes[${index}].tooth`, message: 'Tooth number is required for this procedure' });
  }
  
  if (isSurfaceProcedure(procedure.code) && !procedure.surface) {
    errors.push({ field: `procedureCodes[${index}].surface`, message: 'Surface is required for this procedure' });
  }
  
  if (isQuadrantProcedure(procedure.code) && !procedure.quadrant) {
    errors.push({ field: `procedureCodes[${index}].quadrant`, message: 'Quadrant is required for this procedure' });
  }
};

/**
 * Determines if a procedure code requires tooth information
 * This is a simplified example - in reality, this would check against a database of CDT codes
 */
const isDentalProcedureRequiringToothInfo = (code: string): boolean => {
  // Restorative, endodontic, and many other procedures require tooth information
  // This is just a simplified example - actual implementation would be more complex
  const codePrefix = code.substring(0, 1);
  return ['D2', 'D3', 'D7'].includes(codePrefix);
};

/**
 * Determines if a procedure code requires surface information
 * This is a simplified example - in reality, this would check against a database of CDT codes
 */
const isSurfaceProcedure = (code: string): boolean => {
  // Many restorative procedures require surface information
  // This is just a simplified example - actual implementation would be more complex
  return code.startsWith('D2');
};

/**
 * Determines if a procedure code requires quadrant information
 * This is a simplified example - in reality, this would check against a database of CDT codes
 */
const isQuadrantProcedure = (code: string): boolean => {
  // Periodontal procedures often require quadrant information
  // This is just a simplified example - actual implementation would be more complex
  return code.startsWith('D4');
};

/**
 * Creates a validation alert component for a claim
 * @param errors The validation errors to display
 * @returns A React component that displays validation errors
 */
export const formatValidationErrors = (errors: ValidationError[]): string[] => {
  return errors.map(error => error.message);
};