import React from 'react';
import { Alert } from 'flowbite-react';
import { ValidationError } from '../../types/claims.types';
import { HiExclamation } from 'react-icons/hi';

interface ClaimValidationAlertProps {
  errors: ValidationError[];
}

const ClaimValidationAlert: React.FC<ClaimValidationAlertProps> = ({ errors }) => {
  if (errors.length === 0) return null;
  
  return (
    <Alert 
      color="failure" 
      className="mb-4"
      icon={HiExclamation}
    >
      <div className="font-medium mb-2">Please correct the following issues:</div>
      <ul className="mt-1.5 ml-4 list-disc list-inside text-sm">
        {errors.map((error, index) => (
          <li key={index}>{error.message}</li>
        ))}
      </ul>
    </Alert>
  );
};

export default ClaimValidationAlert;