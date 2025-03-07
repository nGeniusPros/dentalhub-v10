import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Spinner, Badge } from 'flowbite-react';
import { useClaimsContext } from '../../contexts/ClaimsContext';
import { InsuranceVerificationResult } from '../../types/claims.types';

const InsuranceVerification: React.FC = () => {
  const { verifyInsurance } = useClaimsContext();
  const [verifying, setVerifying] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [insuranceId, setInsuranceId] = useState('');
  const [result, setResult] = useState<InsuranceVerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [patients, setPatients] = useState<{id: string, name: string}[]>([]);
  const [insurances, setInsurances] = useState<{id: string, name: string}[]>([]);
  
  // Load patients and insurances
  useEffect(() => {
    // In a real implementation, this would fetch from your API
    // For now, we'll use mock data
    setPatients([
      { id: 'pat1', name: 'John Smith' },
      { id: 'pat2', name: 'Maria Garcia' },
      { id: 'pat3', name: 'Robert Johnson' }
    ]);
    
    setInsurances([
      { id: 'ins1', name: 'Delta Dental' },
      { id: 'ins2', name: 'MetLife' },
      { id: 'ins3', name: 'Cigna' }
    ]);
    
    try {
      // Additional setup if needed
    } catch {
      setError('Failed to load data');
    }
  }, []);
  
  const handleVerify = async () => {
    if (!patientId || !insuranceId) return;
    
    setVerifying(true);
    setError(null);
    
    try {
      const verificationResult = await verifyInsurance(patientId, insuranceId);
      setResult(verificationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };
  
  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Insurance Verification</h3>
        <p className="text-gray-600">Verify patient eligibility and benefits information</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Patient</label>
          <Select 
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          >
            <option value="">Select Patient</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>{patient.name}</option>
            ))}
          </Select>
        </div>
        
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Insurance Plan</label>
          <Select
            value={insuranceId}
            onChange={(e) => setInsuranceId(e.target.value)}
          >
            <option value="">Select Insurance</option>
            {insurances.map(insurance => (
              <option key={insurance.id} value={insurance.id}>{insurance.name}</option>
            ))}
          </Select>
        </div>
        
        <div className="flex items-end">
          <Button
            onClick={handleVerify}
            disabled={verifying || !patientId || !insuranceId}
            className="w-full"
            color="blue"
          >
            {verifying ? (
              <span className="flex items-center justify-center">
                <Spinner size="sm" className="mr-2" />
                Verifying...
              </span>
            ) : 'Verify Eligibility'}
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}
      
      {result && (
        <div className="border rounded-lg p-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-lg">Verification Results</h4>
            <Badge color={result.eligible ? 'success' : 'failure'} className="px-3 py-1.5 text-sm">
              {result.eligible ? 'Eligible' : 'Not Eligible'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Plan Name:</p>
              <p className="font-medium">{result.planName} ({result.planType})</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Coverage Period:</p>
              <p className="font-medium">
                {new Date(result.coverageStart).toLocaleDateString()} - {result.coverageEnd ? new Date(result.coverageEnd).toLocaleDateString() : 'Current'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Deductible:</p>
              <p className="font-medium">
                ${result.deductible.individual.toFixed(2)} Individual / ${result.deductible.family.toFixed(2)} Family
                {result.deductible.remaining !== undefined && (
                  <span className="ml-2 text-gray-600">
                    (${result.deductible.remaining.toFixed(2)} remaining)
                  </span>
                )}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Annual Maximum Remaining:</p>
              <p className="font-medium">${result.remainingBenefit.toFixed(2)}</p>
            </div>
          </div>
          
          {result.coveragePercentages && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Coverage Percentages:</p>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-xs text-gray-500">Preventive</p>
                  <p className="font-bold text-blue-700">{result.coveragePercentages.preventive}%</p>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-xs text-gray-500">Basic</p>
                  <p className="font-bold text-blue-700">{result.coveragePercentages.basic}%</p>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-xs text-gray-500">Major</p>
                  <p className="font-bold text-blue-700">{result.coveragePercentages.major}%</p>
                </div>
                {result.coveragePercentages.orthodontic !== undefined && (
                  <div className="bg-blue-50 p-2 rounded">
                    <p className="text-xs text-gray-500">Orthodontic</p>
                    <p className="font-bold text-blue-700">{result.coveragePercentages.orthodontic}%</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {result.waitingPeriods && Object.keys(result.waitingPeriods).length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Waiting Periods:</p>
              <ul className="list-disc list-inside text-sm">
                {result.waitingPeriods.basic && (
                  <li>Basic services: {result.waitingPeriods.basic}</li>
                )}
                {result.waitingPeriods.major && (
                  <li>Major services: {result.waitingPeriods.major}</li>
                )}
                {result.waitingPeriods.orthodontic && (
                  <li>Orthodontic services: {result.waitingPeriods.orthodontic}</li>
                )}
              </ul>
            </div>
          )}
          
          {result.verificationNotes && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Notes:</p>
              <p className="text-sm p-2 bg-gray-50 rounded mt-1">{result.verificationNotes}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default InsuranceVerification;