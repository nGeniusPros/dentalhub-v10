import React, { useState, useEffect } from 'react';
import { useClaimsContext } from '../../contexts/ClaimsContext';
import { Button, Card, Label, TextInput, Select, Textarea, Spinner } from 'flowbite-react';
import { Claim, ClaimStatus, ValidationError, ProcedureCode, DiagnosisCode } from '../../types/claims.types';
import ClaimValidationAlert from './ClaimValidationAlert';
import { useNavigate } from 'react-router-dom';

interface ClaimSubmissionFormProps {
  initialData?: Partial<Claim>;
  isEditing?: boolean;
}

const ClaimSubmissionForm: React.FC<ClaimSubmissionFormProps> = ({ 
  initialData = {}, 
  isEditing = false 
}) => {
  const { submitClaim, updateClaim, validateClaimData } = useClaimsContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  
  const [claimData, setClaimData] = useState<Partial<Claim>>({
    patientId: '',
    providerId: '',
    serviceDate: new Date().toISOString().split('T')[0],
    procedureCodes: [],
    diagnosisCodes: [],
    insuranceInfo: { payerId: '', planId: '', subscriberId: '' },
    status: ClaimStatus.DRAFT,
    totalFee: 0,
    notes: '',
    ...initialData
  });
  
  const [patients, setPatients] = useState<{ id: string, name: string }[]>([]);
  const [providers, setProviders] = useState<{ id: string, name: string }[]>([]);
  const [insurancePayers, setInsurancePayers] = useState<{ id: string, name: string }[]>([]);
  
  // New procedure code state
  const [newProcedure, setNewProcedure] = useState<Partial<ProcedureCode>>({
    code: '',
    description: '',
    fee: 0,
    date: new Date().toISOString().split('T')[0]
  });
  
  // New diagnosis code state
  const [newDiagnosis, setNewDiagnosis] = useState<Partial<DiagnosisCode>>({
    code: '',
    description: ''
  });
  
  // Mock data for dropdown selections (in a real app, this would come from API)
  useEffect(() => {
    // Simulate API calls
    setPatients([
      { id: 'patient1', name: 'John Doe' },
      { id: 'patient2', name: 'Jane Smith' },
      { id: 'patient3', name: 'Robert Johnson' }
    ]);
    
    setProviders([
      { id: 'provider1', name: 'Dr. Emily Chen' },
      { id: 'provider2', name: 'Dr. Michael Wong' },
      { id: 'provider3', name: 'Dr. Sarah Parker' }
    ]);
    
    setInsurancePayers([
      { id: 'ins1', name: 'Delta Dental' },
      { id: 'ins2', name: 'Aetna' },
      { id: 'ins3', name: 'Blue Cross Blue Shield' },
      { id: 'ins4', name: 'Cigna' },
      { id: 'ins5', name: 'Guardian' }
    ]);
  }, []);
  
  const updateClaimField = (field: string, value: unknown) => {
    setClaimData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const updateInsuranceField = (field: string, value: unknown) => {
    setClaimData(prev => ({
      ...prev,
      insuranceInfo: {
        ...prev.insuranceInfo!,
        [field]: value
      }
    }));
  };
  
  const addProcedureCode = () => {
    if (!newProcedure.code || !newProcedure.description || newProcedure.fee === 0) {
      return;
    }
    
    const updatedProcedures = [...(claimData.procedureCodes || []), newProcedure as ProcedureCode];
    
    // Calculate new total fee
    const totalFee = updatedProcedures.reduce((sum, proc) => sum + proc.fee, 0);
    
    setClaimData(prev => ({
      ...prev,
      procedureCodes: updatedProcedures,
      totalFee
    }));
    
    // Reset the form
    setNewProcedure({
      code: '',
      description: '',
      fee: 0,
      date: new Date().toISOString().split('T')[0]
    });
  };
  
  const removeProcedureCode = (index: number) => {
    const updatedProcedures = [...(claimData.procedureCodes || [])];
    updatedProcedures.splice(index, 1);
    
    // Recalculate total fee
    const totalFee = updatedProcedures.reduce((sum, proc) => sum + proc.fee, 0);
    
    setClaimData(prev => ({
      ...prev,
      procedureCodes: updatedProcedures,
      totalFee
    }));
  };
  
  const addDiagnosisCode = () => {
    if (!newDiagnosis.code || !newDiagnosis.description) {
      return;
    }
    
    setClaimData(prev => ({
      ...prev,
      diagnosisCodes: [...(prev.diagnosisCodes || []), newDiagnosis as DiagnosisCode]
    }));
    
    // Reset the form
    setNewDiagnosis({
      code: '',
      description: ''
    });
  };
  
  const removeDiagnosisCode = (index: number) => {
    const updatedDiagnoses = [...(claimData.diagnosisCodes || [])];
    updatedDiagnoses.splice(index, 1);
    
    setClaimData(prev => ({
      ...prev,
      diagnosisCodes: updatedDiagnoses
    }));
  };
  
  const validateAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the claim
    const validationErrors = validateClaimData(claimData as Claim);
    setErrors(validationErrors);
    
    if (validationErrors.length > 0) {
      return;
    }
    
    setLoading(true);
    
    try {
      if (isEditing && claimData.id) {
        // Update existing claim
        await updateClaim(claimData.id, claimData as Claim);
        navigate(`/claims/${claimData.id}`);
      } else {
        // Submit new claim
        const result = await submitClaim(claimData as Claim);
        // Handle different possible response structures
        if (result && typeof result === 'object') {
          // Type-safe approach to handle unknown response structure
          let claimId: string | undefined;
          
          if ('id' in result && result.id) {
            claimId = String(result.id);
          } else if ('claimId' in result && result.claimId) {
            claimId = String(result.claimId);
          } else if ('claim' in result && result.claim && typeof result.claim === 'object' && 'id' in result.claim) {
            claimId = String(result.claim.id);
          }
          if (claimId) {
            navigate(`/claims/${claimId}`);
          } else {
            console.error('Could not find claim ID in response', result);
            navigate('/claims');
          }
        } else {
          navigate('/claims');
        }
      }
    } catch (error) {
      console.error('Failed to submit claim:', error);
      setErrors([{ field: 'general', message: 'Failed to submit claim. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="max-w-4xl mx-auto">
      <h3 className="text-xl font-semibold mb-4">
        {isEditing ? 'Edit Insurance Claim' : 'New Insurance Claim'}
      </h3>
      
      {errors.length > 0 && <ClaimValidationAlert errors={errors} />}
      
      <form onSubmit={validateAndSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="patientId" className="mb-2">Patient</Label>
            <Select
              id="patientId"
              value={claimData.patientId}
              onChange={(e) => updateClaimField('patientId', e.target.value)}
              required
            >
              <option value="">Select Patient</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>{patient.name}</option>
              ))}
            </Select>
          </div>
          
          <div>
            <Label htmlFor="providerId" className="mb-2">Provider</Label>
            <Select
              id="providerId"
              value={claimData.providerId}
              onChange={(e) => updateClaimField('providerId', e.target.value)}
              required
            >
              <option value="">Select Provider</option>
              {providers.map(provider => (
                <option key={provider.id} value={provider.id}>{provider.name}</option>
              ))}
            </Select>
          </div>
          
          <div>
            <Label htmlFor="serviceDate" className="mb-2">Service Date</Label>
            <TextInput
              id="serviceDate"
              type="date"
              value={claimData.serviceDate}
              onChange={(e) => updateClaimField('serviceDate', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="totalFee" className="mb-2">Total Fee</Label>
            <TextInput
              id="totalFee"
              type="number"
              value={claimData.totalFee}
              onChange={(e) => updateClaimField('totalFee', parseFloat(e.target.value))}
              readOnly
            />
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3">Insurance Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="payerId" className="mb-2">Insurance Payer</Label>
              <Select
                id="payerId"
                value={claimData.insuranceInfo?.payerId}
                onChange={(e) => {
                  updateInsuranceField('payerId', e.target.value);
                  // Find payer name
                  const payer = insurancePayers.find(p => p.id === e.target.value);
                  if (payer) {
                    updateInsuranceField('payerName', payer.name);
                  }
                }}
                required
              >
                <option value="">Select Payer</option>
                {insurancePayers.map(payer => (
                  <option key={payer.id} value={payer.id}>{payer.name}</option>
                ))}
              </Select>
            </div>
            
            <div>
              <Label htmlFor="subscriberId" className="mb-2">Subscriber ID</Label>
              <TextInput
                id="subscriberId"
                type="text"
                value={claimData.insuranceInfo?.subscriberId || ''}
                onChange={(e) => updateInsuranceField('subscriberId', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="groupNumber" className="mb-2">Group Number</Label>
              <TextInput
                id="groupNumber"
                type="text"
                value={claimData.insuranceInfo?.groupNumber || ''}
                onChange={(e) => updateInsuranceField('groupNumber', e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3">Procedure Codes</h4>
          
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Code</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Fee</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Tooth/Surface</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {claimData.procedureCodes && claimData.procedureCodes.length > 0 ? (
                  claimData.procedureCodes.map((proc, index) => (
                    <tr key={index} className="bg-white border-b">
                      <td className="px-4 py-2">{proc.code}</td>
                      <td className="px-4 py-2">{proc.description}</td>
                      <td className="px-4 py-2">${proc.fee.toFixed(2)}</td>
                      <td className="px-4 py-2">{new Date(proc.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2">
                        {proc.tooth && `Tooth: ${proc.tooth}`} 
                        {proc.surface && `, Surface: ${proc.surface}`}
                        {proc.quadrant && `, Quad: ${proc.quadrant}`}
                      </td>
                      <td className="px-4 py-2">
                        <Button 
                          size="xs" 
                          color="failure" 
                          onClick={() => removeProcedureCode(index)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-2 text-center">No procedures added</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="text-md font-medium mb-2">Add Procedure</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
              <div>
                <Label htmlFor="procCode" className="mb-1">Procedure Code</Label>
                <TextInput
                  id="procCode"
                  type="text"
                  value={newProcedure.code}
                  onChange={(e) => setNewProcedure({...newProcedure, code: e.target.value})}
                  placeholder="D2140"
                />
              </div>
              
              <div>
                <Label htmlFor="procDescription" className="mb-1">Description</Label>
                <TextInput
                  id="procDescription"
                  type="text"
                  value={newProcedure.description}
                  onChange={(e) => setNewProcedure({...newProcedure, description: e.target.value})}
                  placeholder="Amalgam - one surface"
                />
              </div>
              
              <div>
                <Label htmlFor="procFee" className="mb-1">Fee</Label>
                <TextInput
                  id="procFee"
                  type="number"
                  value={newProcedure.fee}
                  onChange={(e) => setNewProcedure({...newProcedure, fee: parseFloat(e.target.value)})}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
              <div>
                <Label htmlFor="procDate" className="mb-1">Date</Label>
                <TextInput
                  id="procDate"
                  type="date"
                  value={newProcedure.date}
                  onChange={(e) => setNewProcedure({...newProcedure, date: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="procTooth" className="mb-1">Tooth (optional)</Label>
                <TextInput
                  id="procTooth"
                  type="text"
                  value={newProcedure.tooth || ''}
                  onChange={(e) => setNewProcedure({...newProcedure, tooth: e.target.value})}
                  placeholder="e.g., 14"
                />
              </div>
              
              <div>
                <Label htmlFor="procSurface" className="mb-1">Surface (optional)</Label>
                <TextInput
                  id="procSurface"
                  type="text"
                  value={newProcedure.surface || ''}
                  onChange={(e) => setNewProcedure({...newProcedure, surface: e.target.value})}
                  placeholder="e.g., MO"
                />
              </div>
              
              <div>
                <Label htmlFor="procQuadrant" className="mb-1">Quadrant (optional)</Label>
                <TextInput
                  id="procQuadrant"
                  type="text"
                  value={newProcedure.quadrant || ''}
                  onChange={(e) => setNewProcedure({...newProcedure, quadrant: e.target.value})}
                  placeholder="e.g., UR"
                />
              </div>
            </div>
            
            <div className="mt-2">
              <Button 
                color="light" 
                onClick={addProcedureCode} 
                disabled={!newProcedure.code || !newProcedure.description || !newProcedure.fee}
              >
                Add Procedure
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3">Diagnosis Codes</h4>
          
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Code</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {claimData.diagnosisCodes && claimData.diagnosisCodes.length > 0 ? (
                  claimData.diagnosisCodes.map((diag, index) => (
                    <tr key={index} className="bg-white border-b">
                      <td className="px-4 py-2">{diag.code}</td>
                      <td className="px-4 py-2">{diag.description}</td>
                      <td className="px-4 py-2">
                        <Button 
                          size="xs" 
                          color="failure" 
                          onClick={() => removeDiagnosisCode(index)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-center">No diagnosis codes added</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="text-md font-medium mb-2">Add Diagnosis</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <Label htmlFor="diagCode" className="mb-1">Diagnosis Code</Label>
                <TextInput
                  id="diagCode"
                  type="text"
                  value={newDiagnosis.code}
                  onChange={(e) => setNewDiagnosis({...newDiagnosis, code: e.target.value})}
                  placeholder="K02.9"
                />
              </div>
              
              <div>
                <Label htmlFor="diagDescription" className="mb-1">Description</Label>
                <TextInput
                  id="diagDescription"
                  type="text"
                  value={newDiagnosis.description}
                  onChange={(e) => setNewDiagnosis({...newDiagnosis, description: e.target.value})}
                  placeholder="Dental caries, unspecified"
                />
              </div>
            </div>
            
            <div className="mt-2">
              <Button 
                color="light" 
                onClick={addDiagnosisCode} 
                disabled={!newDiagnosis.code || !newDiagnosis.description}
              >
                Add Diagnosis
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <Label htmlFor="notes" className="mb-2">Notes (optional)</Label>
          <Textarea
            id="notes"
            rows={3}
            value={claimData.notes || ''}
            onChange={(e) => updateClaimField('notes', e.target.value)}
            placeholder="Add any additional notes about this claim..."
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button 
            color="light" 
            onClick={() => navigate('/claims')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            color="primary"
            disabled={loading}
          >
            {loading && <Spinner size="sm" className="mr-2" />}
            {isEditing ? 'Update Claim' : 'Submit Claim'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ClaimSubmissionForm;