import React from 'react';
import { Alert } from 'flowbite-react';
import { HiExclamation } from 'react-icons/hi';
import { ValidationError } from '../../types/claims.types';

interface ClaimValidationAlertProps {
  errors: ValidationError[];
  onDismiss?: () => void;
}

/**
 * Component for displaying validation errors for claims
 */
export const ClaimValidationAlert: React.FC<ClaimValidationAlertProps> = ({ 
  errors, 
  onDismiss 
}) => {
  if (errors.length === 0) return null;
  
  return (
    <Alert
      color="failure"
      className="mb-4"
      icon={HiExclamation}
      onDismiss={onDismiss}
    >
      <div className="font-medium mb-2">Please correct the following issues:</div>
      <ul className="list-disc list-inside space-y-1">
        {errors.map((error, index) => (
          <li key={index} className="text-sm">
            {error.message}
          </li>
        ))}
      </ul>
    </Alert>
  );
};

/**
 * Groups validation errors by field
 * @param errors Array of validation errors
 * @returns Object with field names as keys and arrays of error messages as values
 */
export const groupValidationErrorsByField = (errors: ValidationError[]): Record<string, string[]> => {
  const groupedErrors: Record<string, string[]> = {};
  
  errors.forEach(error => {
    if (!groupedErrors[error.field]) {
      groupedErrors[error.field] = [];
    }
    groupedErrors[error.field].push(error.message);
  });
  
  return groupedErrors;
};

/**
 * Checks if a field has validation errors
 * @param fieldName Name of the field to check
 * @param errors Array of validation errors
 * @returns True if the field has errors, false otherwise
 */
export const hasFieldError = (fieldName: string, errors: ValidationError[]): boolean => {
  return errors.some(error => error.field === fieldName);
};

/**
 * Gets validation error messages for a field
 * @param fieldName Name of the field to get errors for
 * @param errors Array of validation errors
 * @returns Array of error messages for the field
 */
export const getFieldErrorMessages = (fieldName: string, errors: ValidationError[]): string[] => {
  return errors
    .filter(error => error.field === fieldName)
    .map(error => error.message);
};