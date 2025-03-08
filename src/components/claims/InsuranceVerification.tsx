import React, { useState, useEffect } from 'react';
import { Card, Button, Label, Select, Spinner, Badge } from 'flowbite-react';
import { HiCheck, HiX, HiCalendar, HiCash, HiInformationCircle } from 'react-icons/hi';
import { InsuranceVerificationResult } from '../../types/claims.types';
import { formatDateOnly, formatDateRange } from '../../utils/dateUtils';

interface InsuranceVerificationProps {
  onVerify: (patientId: string, insuranceId: string) => Promise<InsuranceVerificationResult>;
  patients: Array<{ id: string; name: string }>;
  insurancePlans: Array<{ id: string; name: string; payerId: string }>;
}

/**
 * Component for verifying patient insurance eligibility
 */
export const InsuranceVerification: React.FC<InsuranceVerificationProps> = ({
  onVerify,
  patients,
  insurancePlans
}) => {
  const [verifying, setVerifying] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [insuranceId, setInsuranceId] = useState('');
  const [result, setResult] = useState<InsuranceVerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filteredInsurances, setFilteredInsurances] = useState(insurancePlans);
  
  // Filter insurance plans when patient changes
  useEffect(() => {
    if (!patientId) {
      setFilteredInsurances(insurancePlans);
      return;
    }
    
    // In a real application, this would filter insurance plans based on the selected patient
    // For now, we'll just show all insurance plans
    setFilteredInsurances(insurancePlans);
    
    // Reset insurance selection when patient changes
    setInsuranceId('');
  }, [patientId, insurancePlans]);
  
  /**
   * Handle verification request
   */
  const handleVerify = async () => {
    if (!patientId || !insuranceId) return;
    
    setVerifying(true);
    setError(null);
    
    try {
      const verificationResult = await onVerify(patientId, insuranceId);
      setResult(verificationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      console.error('Verification failed:', err);
    } finally {
      setVerifying(false);
    }
  };
  
  /**
   * Reset verification results
   */
  const handleReset = () => {
    setResult(null);
    setError(null);
  };
  
  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4">Insurance Verification</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="patient-select" value="Patient" />
          <Select 
            id="patient-select"
            value={patientId}
            onChange={(e) => {
              setPatientId(e.target.value);
              // Reset results when patient changes
              if (result) {
                handleReset();
              }
            }}
            disabled={verifying}
          >
            <option value="">Select Patient</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </Select>
        </div>
        
        <div>
          <Label htmlFor="insurance-select" value="Insurance Plan" />
          <Select
            id="insurance-select"
            value={insuranceId}
            onChange={(e) => {
              setInsuranceId(e.target.value);
              // Reset results when insurance changes
              if (result) {
                handleReset();
              }
            }}
            disabled={verifying || !patientId}
          >
            <option value="">Select Insurance</option>
            {filteredInsurances.map(insurance => (
              <option key={insurance.id} value={insurance.id}>
                {insurance.name}
              </option>
            ))}
          </Select>
        </div>
        
        <div className="flex items-end">
          <Button
            onClick={handleVerify}
            disabled={verifying || !patientId || !insuranceId}
            className="w-full"
          >
            {verifying ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Verifying...
              </>
            ) : (
              'Verify Eligibility'
            )}
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          <div className="font-medium">Verification failed</div>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="border rounded-lg p-4 mt-4">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-lg">Verification Results</h4>
            <Badge 
              color={result.eligible ? 'success' : 'failure'} 
              size="lg"
              className="flex items-center"
              icon={result.eligible ? HiCheck : HiX}
            >
              {result.eligible ? 'Eligible' : 'Not Eligible'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium mb-2 text-gray-700">Coverage Information</h5>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Plan Type</p>
                  <p className="font-medium">{result.planName} ({result.planType})</p>
                </div>
                
                <div className="flex items-center">
                  <HiCalendar className="text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Coverage Period</p>
                    <p className="font-medium">
                      {formatDateRange(result.coverageStart, result.coverageEnd)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium mb-2 text-gray-700">Financial Information</h5>
              <div className="space-y-3">
                <div className="flex items-center">
                  <HiCash className="text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Annual Maximum Benefit</p>
                    <p className="font-medium">
                      ${result.remainingBenefit.toFixed(2)} remaining
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Deductible</p>
                  <p className="font-medium">
                    ${result.deductible.individual.toFixed(2)} Individual / ${result.deductible.family.toFixed(2)} Family
                    {result.deductible.remaining !== undefined && (
                      <span className="ml-2 text-sm text-gray-500">
                        (${result.deductible.remaining.toFixed(2)} remaining)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {result.coveragePercentages && (
            <div className="mt-4">
              <h5 className="font-medium mb-2 text-gray-700">Coverage Percentages</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Preventive</p>
                  <p className="font-medium">{result.coveragePercentages.preventive}%</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Basic</p>
                  <p className="font-medium">{result.coveragePercentages.basic}%</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Major</p>
                  <p className="font-medium">{result.coveragePercentages.major}%</p>
                </div>
                {result.coveragePercentages.orthodontic !== undefined && (
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">Orthodontic</p>
                    <p className="font-medium">{result.coveragePercentages.orthodontic}%</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {result.waitingPeriods && Object.values(result.waitingPeriods).some(v => v) && (
            <div className="mt-4">
              <h5 className="font-medium mb-2 text-gray-700">Waiting Periods</h5>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex">
                  <HiInformationCircle className="text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm">
                      The following services have waiting periods before coverage begins:
                    </p>
                    <ul className="ml-5 mt-1 list-disc text-sm">
                      {result.waitingPeriods.basic && (
                        <li>Basic Services: {result.waitingPeriods.basic}</li>
                      )}
                      {result.waitingPeriods.major && (
                        <li>Major Services: {result.waitingPeriods.major}</li>
                      )}
                      {result.waitingPeriods.orthodontic && (
                        <li>Orthodontic Services: {result.waitingPeriods.orthodontic}</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {result.verificationNotes && (
            <div className="mt-4 border-t pt-3">
              <h5 className="font-medium mb-1 text-gray-700">Additional Notes</h5>
              <p className="text-sm">{result.verificationNotes}</p>
            </div>
          )}
          
          <div className="mt-6 text-right">
            <p className="text-xs text-gray-500 mb-2">
              Verification Date: {formatDateOnly(result.verificationDate)}
            </p>
            <Button size="sm" color="light" onClick={handleReset}>
              New Verification
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};