import React, { useState } from 'react';
import { Card, Button, Spinner, Alert } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { useClaimsContext } from '../../contexts/ClaimsContext';
import { Claim, ClaimStatus, ValidationError } from '../../types/claims.types';

const NewClaimPage: React.FC = () => {
  const navigate = useNavigate();
  const { submitClaim } = useClaimsContext();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Initial empty claim data
  const claimData: Partial<Claim> = {
    patientId: '',
    providerId: '',
    serviceDate: new Date().toISOString().split('T')[0],
    procedureCodes: [],
    diagnosisCodes: [],
    insuranceInfo: { payerId: '', subscriberId: '' },
    status: ClaimStatus.DRAFT,
    totalFee: 0
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    setSuccessMessage('');
    
    // Perform validation
    const validationErrors = validateClaimData(claimData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }
    
    try {
      // For this example, we'll just create a minimal valid claim
      const minimalValidClaim = {
        ...claimData,
        id: 'temp-' + Date.now(),
        patientName: 'John Doe', // In a real app, this would be fetched from the selected patient
        providerName: 'Dr. Jane Smith', // In a real app, this would be fetched from the selected provider
        insuranceInfo: {
          ...claimData.insuranceInfo,
          payerName: 'Sample Insurance' // In a real app, this would be fetched from the selected payer
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Claim;
      
      const response = await submitClaim(minimalValidClaim);
      
      if (response.success) {
        setSuccessMessage(`Claim created successfully${response.trackingId ? ` (Tracking ID: ${response.trackingId})` : ''}!`);
        // Redirect after a short delay
        setTimeout(() => {
          navigate(`/admin-dashboard/claims/${response.claim?.id}`);
        }, 2000);
      } else {
        setErrors([{ field: 'general', message: response.message }]);
      }
    } catch (error) {
      setErrors([
        { field: 'general', message: error instanceof Error ? error.message : 'Unknown error occurred' }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  // Simple validation for the claim data
  const validateClaimData = (data: Partial<Claim>): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    // This is a simplified validation - in a real app, this would be more comprehensive
    if (!data.patientId) errors.push({ field: 'patientId', message: 'Patient is required' });
    if (!data.providerId) errors.push({ field: 'providerId', message: 'Provider is required' });
    if (!data.serviceDate) errors.push({ field: 'serviceDate', message: 'Service date is required' });
    if (!data.insuranceInfo?.payerId) errors.push({ field: 'payerId', message: 'Insurance payer is required' });
    if (!data.insuranceInfo?.subscriberId) errors.push({ field: 'subscriberId', message: 'Subscriber ID is required' });
    if (!data.procedureCodes?.length) errors.push({ field: 'procedureCodes', message: 'At least one procedure is required' });
    
    return errors;
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create New Claim</h1>
        <Button color="light" onClick={() => navigate('/admin-dashboard/claims')}>
          Back to Claims
        </Button>
      </div>
      
      {errors.length > 0 && (
        <Alert color="failure" className="mb-4">
          <div className="font-medium">Please correct the following issues:</div>
          <ul className="mt-1.5 ml-4 list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </Alert>
      )}
      
      {successMessage && (
        <Alert color="success" className="mb-4">
          {successMessage}
        </Alert>
      )}
      
      <Card>
        <div className="mb-4">
          <p className="text-gray-500 mb-4">
            This is a placeholder for the new claim form. In a full implementation, this would include:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
            <li>Patient selection</li>
            <li>Provider selection</li>
            <li>Service date picker</li>
            <li>Procedure code selection with fee inputs</li>
            <li>Diagnosis code selection</li>
            <li>Insurance information fields</li>
            <li>Attachment uploads</li>
          </ul>
          <p className="text-gray-500">
            For demo purposes, clicking the button below will create a sample claim.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="flex justify-end gap-3">
            <Button color="light" onClick={() => navigate('/admin-dashboard/claims')}>
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={loading}>
              {loading ? <><Spinner size="sm" className="mr-2" />Creating...</> : 'Create Sample Claim'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NewClaimPage;