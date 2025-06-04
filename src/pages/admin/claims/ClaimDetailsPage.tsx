import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spinner, Alert } from 'flowbite-react';
import { useClaimsContext } from '../../../contexts/ClaimsContext';
import { Claim } from '../../../types/claims.types';

const ClaimDetailsPage: React.FC = () => {
  const { claimId } = useParams<{ claimId: string }>();
  const navigate = useNavigate();
  const { getClaim } = useClaimsContext();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [claim, setClaim] = useState<Claim | null>(null);
  
  useEffect(() => {
    const fetchClaimDetails = async () => {
      if (!claimId) return;
      
      try {
        setLoading(true);
        const claimData = await getClaim(claimId);
        setClaim(claimData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load claim details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClaimDetails();
  }, [claimId, getClaim]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="xl" />
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert color="failure">
        <span className="font-medium">Error:</span> {error}
      </Alert>
    );
  }
  
  if (!claim) {
    return (
      <Alert color="warning">
        Claim not found. The claim may have been deleted or you don't have permission to view it.
      </Alert>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Claim Details</h1>
        <Button color="light" onClick={() => navigate('/admin-dashboard/claims')}>
          Back to Claims
        </Button>
      </div>
      
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Claim Information</h2>
            <div className="space-y-3">
              <p><span className="font-medium">Claim ID:</span> {claim.id}</p>
              <p><span className="font-medium">Status:</span> {claim.status}</p>
              <p><span className="font-medium">Created:</span> {new Date(claim.createdAt).toLocaleString()}</p>
              <p><span className="font-medium">Last Updated:</span> {new Date(claim.updatedAt).toLocaleString()}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Patient & Provider</h2>
            <div className="space-y-3">
              <p><span className="font-medium">Patient:</span> {claim.patientName}</p>
              <p><span className="font-medium">Provider:</span> {claim.providerName}</p>
              <p><span className="font-medium">Service Date:</span> {claim.serviceDate}</p>
              <p><span className="font-medium">Total Fee:</span> ${claim.totalFee.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Insurance Information</h2>
          <div className="space-y-3">
            <p><span className="font-medium">Payer:</span> {claim.insuranceInfo.payerName}</p>
            <p><span className="font-medium">Subscriber ID:</span> {claim.insuranceInfo.subscriberId}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Procedures</h2>
          {claim.procedureCodes && claim.procedureCodes.length > 0 ? (
            <ul className="list-disc list-inside">
              {claim.procedureCodes.map((code, index) => (
                <li key={index}>{code}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No procedures listed</p>
          )}
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Diagnosis</h2>
          {claim.diagnosisCodes && claim.diagnosisCodes.length > 0 ? (
            <ul className="list-disc list-inside">
              {claim.diagnosisCodes.map((code, index) => (
                <li key={index}>{code}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No diagnosis codes listed</p>
          )}
        </div>
        
        <div className="mt-6 flex justify-end gap-3">
          <Button color="light" onClick={() => navigate('/admin-dashboard/claims')}>
            Back
          </Button>
          <Button color="primary">
            Edit Claim
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ClaimDetailsPage;