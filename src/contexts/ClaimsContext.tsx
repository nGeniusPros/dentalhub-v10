import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Claim, 
  ClaimStatus, 
  ClaimStatusFilter,
  ERA,
  InsuranceVerificationResult,
  Attachment,
  ValidationError,
  ClaimSubmissionResponse,
  ClaimUpdateResponse,
  ClaimsSummaryData
} from '../types/claims.types';
import { validateClaim, validateClaimForSubmission } from '../utils/claims/validation';

interface ClaimsContextType {
  claims: Claim[];
  loading: boolean;
  error: string | null;
  fetchClaims: (filter?: ClaimStatusFilter) => Promise<Claim[]>;
  fetchClaimById: (claimId: string) => Promise<Claim | null>;
  submitClaim: (claim: Claim) => Promise<ClaimSubmissionResponse>;
  updateClaim: (claimId: string, updates: Partial<Claim>) => Promise<ClaimUpdateResponse>;
  deleteClaim: (claimId: string) => Promise<boolean>;
  submitClaimToInsurance: (claimId: string) => Promise<ClaimSubmissionResponse>;
  fetchPendingERAs: () => Promise<ERA[]>;
  processERA: (eraId: string) => Promise<boolean>;
  fetchClaimsSummary: () => Promise<ClaimsSummaryData>;
  verifyInsurance: (patientId: string, insuranceId: string) => Promise<InsuranceVerificationResult>;
  uploadAttachment: (claimId: string, file: File, type: string) => Promise<Attachment>;
  removeAttachment: (attachmentId: string) => Promise<boolean>;
  validateClaimData: (claim: Claim) => ValidationError[];
}

// Create context with a default undefined value
const ClaimsContext = createContext<ClaimsContextType | undefined>(undefined);

export const ClaimsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch claims with optional status filter
  const fetchClaims = useCallback(async (filter: ClaimStatusFilter = 'all'): Promise<Claim[]> => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase.from('claims').select(`
        *,
        claim_attachments (*)
      `);
      
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform database data to our frontend Claim type
      const transformedClaims: Claim[] = data.map(claim => ({
        id: claim.id,
        patientId: claim.patient_id,
        patientName: claim.patient_name,
        providerId: claim.provider_id,
        providerName: claim.provider_name,
        serviceDate: claim.service_date,
        procedureCodes: [], // These would be fetched separately in a real implementation
        diagnosisCodes: [], // These would be fetched separately in a real implementation
        insuranceInfo: {
          payerId: claim.insurance_payer_id,
          payerName: claim.insurance_payer_name,
          planId: claim.insurance_plan_id,
          planName: claim.insurance_plan_name,
          subscriberId: claim.insurance_subscriber_id,
          groupNumber: claim.insurance_group_number
        },
        totalFee: claim.total_fee,
        status: claim.status as ClaimStatus,
        createdAt: claim.created_at,
        updatedAt: claim.updated_at,
        rejectionReason: claim.rejection_reason,
        paymentAmount: claim.payment_amount,
        adjustmentAmount: claim.adjustment_amount,
        patientResponsibility: claim.patient_responsibility,
        notes: claim.notes,
        attachments: claim.claim_attachments ? claim.claim_attachments.map((att: any) => ({
          id: att.id,
          claimId: att.claim_id,
          filename: att.filename,
          type: att.file_type,
          url: att.file_path,
          contentType: att.content_type,
          size: att.size,
          uploadedAt: att.uploaded_at
        })) : []
      }));
      
      setClaims(transformedClaims);
      return transformedClaims;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch a specific claim by ID, including attachments and events
  const fetchClaimById = useCallback(async (claimId: string): Promise<Claim | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch the main claim
      const { data: claimData, error: claimError } = await supabase
        .from('claims')
        .select('*')
        .eq('id', claimId)
        .single();
      
      if (claimError) throw claimError;
      if (!claimData) return null;
      
      // Fetch associated procedure codes
      const { data: procedureData, error: procedureError } = await supabase
        .from('claim_procedures')
        .select('*')
        .eq('claim_id', claimId);
      
      if (procedureError) throw procedureError;
      
      // Fetch associated diagnosis codes
      const { data: diagnosisData, error: diagnosisError } = await supabase
        .from('claim_diagnosis')
        .select('*')
        .eq('claim_id', claimId);
      
      if (diagnosisError) throw diagnosisError;
      
      // Fetch attachments
      const { data: attachmentData, error: attachmentError } = await supabase
        .from('claim_attachments')
        .select('*')
        .eq('claim_id', claimId);
      
      if (attachmentError) throw attachmentError;
      
      // Fetch events
      const { data: eventData, error: eventError } = await supabase
        .from('claim_events')
        .select('*')
        .eq('claim_id', claimId)
        .order('timestamp', { ascending: false });
      
      if (eventError) throw eventError;
      
      // Transform data to our frontend types
      const claim: Claim = {
        id: claimData.id,
        patientId: claimData.patient_id,
        patientName: claimData.patient_name,
        providerId: claimData.provider_id,
        providerName: claimData.provider_name,
        serviceDate: claimData.service_date,
        procedureCodes: procedureData ? procedureData.map((proc: any) => ({
          id: proc.id,
          code: proc.code,
          description: proc.description,
          fee: proc.fee,
          date: proc.service_date,
          tooth: proc.tooth,
          surface: proc.surface,
          quadrant: proc.quadrant
        })) : [],
        diagnosisCodes: diagnosisData ? diagnosisData.map((diag: any) => ({
          id: diag.id,
          code: diag.code,
          description: diag.description
        })) : [],
        insuranceInfo: {
          payerId: claimData.insurance_payer_id,
          payerName: claimData.insurance_payer_name,
          planId: claimData.insurance_plan_id,
          planName: claimData.insurance_plan_name,
          subscriberId: claimData.insurance_subscriber_id,
          groupNumber: claimData.insurance_group_number,
          relationToSubscriber: claimData.relationship_to_subscriber
        },
        totalFee: claimData.total_fee,
        status: claimData.status as ClaimStatus,
        createdAt: claimData.created_at,
        updatedAt: claimData.updated_at,
        rejectionReason: claimData.rejection_reason,
        paymentAmount: claimData.payment_amount,
        adjustmentAmount: claimData.adjustment_amount,
        patientResponsibility: claimData.patient_responsibility,
        notes: claimData.notes,
        attachments: attachmentData ? attachmentData.map((att: any) => ({
          id: att.id,
          claimId: att.claim_id,
          filename: att.filename,
          type: att.file_type,
          url: att.file_path,
          contentType: att.content_type,
          size: att.size,
          uploadedAt: att.uploaded_at
        })) : [],
        events: eventData ? eventData.map((evt: any) => ({
          id: evt.id,
          timestamp: evt.timestamp,
          title: evt.title,
          description: evt.description,
          status: evt.status as ClaimStatus,
          userId: evt.user_id
        })) : []
      };
      
      return claim;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Submit a new claim
  const submitClaim = useCallback(async (claim: Claim): Promise<ClaimSubmissionResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate the claim data
      const validationErrors = validateClaim(claim);
      if (validationErrors.length > 0) {
        return {
          success: false,
          message: 'Validation failed',
          validationErrors
        };
      }
      
      // Start a transaction
      const { error: transactionError } = await supabase.rpc('begin_transaction');
      if (transactionError) throw new Error(transactionError.message);
      
      try {
        // Insert the main claim record
        const { data: claimData, error: claimError } = await supabase
          .from('claims')
          .insert({
            patient_id: claim.patientId,
            patient_name: claim.patientName,
            provider_id: claim.providerId,
            provider_name: claim.providerName,
            service_date: claim.serviceDate,
            total_fee: claim.totalFee,
            status: claim.status,
            insurance_payer_id: claim.insuranceInfo.payerId,
            insurance_payer_name: claim.insuranceInfo.payerName,
            insurance_plan_id: claim.insuranceInfo.planId,
            insurance_plan_name: claim.insuranceInfo.planName,
            insurance_subscriber_id: claim.insuranceInfo.subscriberId,
            insurance_group_number: claim.insuranceInfo.groupNumber,
            relationship_to_subscriber: claim.insuranceInfo.relationToSubscriber,
            notes: claim.notes
          })
          .select()
          .single();
        
        if (claimError) throw new Error(claimError.message);
        
        const newClaimId = claimData.id;
        
        // Insert procedure codes
        if (claim.procedureCodes && claim.procedureCodes.length > 0) {
          const procedureRecords = claim.procedureCodes.map(proc => ({
            claim_id: newClaimId,
            code: proc.code,
            description: proc.description,
            fee: proc.fee,
            service_date: proc.date,
            tooth: proc.tooth,
            surface: proc.surface,
            quadrant: proc.quadrant
          }));
          
          const { error: procedureError } = await supabase
            .from('claim_procedures')
            .insert(procedureRecords);
          
          if (procedureError) throw new Error(procedureError.message);
        }
        
        // Insert diagnosis codes
        if (claim.diagnosisCodes && claim.diagnosisCodes.length > 0) {
          const diagnosisRecords = claim.diagnosisCodes.map(diag => ({
            claim_id: newClaimId,
            code: diag.code,
            description: diag.description
          }));
          
          const { error: diagnosisError } = await supabase
            .from('claim_diagnosis')
            .insert(diagnosisRecords);
          
          if (diagnosisError) throw new Error(diagnosisError.message);
        }
        
        // Add a claim event
        const { error: eventError } = await supabase
          .from('claim_events')
          .insert({
            claim_id: newClaimId,
            title: 'Claim Created',
            description: 'Initial claim created in draft status',
            status: ClaimStatus.DRAFT
          });
        
        if (eventError) throw new Error(eventError.message);
        
        // Commit the transaction
        await supabase.rpc('commit_transaction');
        
        // Fetch the newly created claim with all related data
        const newClaim = await fetchClaimById(newClaimId);
        
        return {
          success: true,
          message: 'Claim created successfully',
          claim: newClaim || undefined
        };
      } catch (error) {
        // Rollback in case of error
        await supabase.rpc('rollback_transaction');
        throw error;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [fetchClaimById]);
  
  // Update an existing claim
  const updateClaim = useCallback(async (claimId: string, updates: Partial<Claim>): Promise<ClaimUpdateResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch the current claim to validate the full data
      const currentClaim = await fetchClaimById(claimId);
      if (!currentClaim) {
        return {
          success: false,
          message: 'Claim not found'
        };
      }
      
      // Merge updates with current claim data
      const updatedClaim: Claim = {
        ...currentClaim,
        ...updates,
        insuranceInfo: {
          ...currentClaim.insuranceInfo,
          ...(updates.insuranceInfo || {})
        }
      };
      
      // Validate the updated claim
      const validationErrors = validateClaim(updatedClaim);
      if (validationErrors.length > 0) {
        return {
          success: false,
          message: 'Validation failed',
          claim: currentClaim
        };
      }
      
      // Begin a transaction
      const { error: transactionError } = await supabase.rpc('begin_transaction');
      if (transactionError) throw new Error(transactionError.message);
      
      try {
        // Update the main claim record
        const { error: updateError } = await supabase
          .from('claims')
          .update({
            patient_id: updatedClaim.patientId,
            patient_name: updatedClaim.patientName,
            provider_id: updatedClaim.providerId,
            provider_name: updatedClaim.providerName,
            service_date: updatedClaim.serviceDate,
            total_fee: updatedClaim.totalFee,
            status: updatedClaim.status,
            insurance_payer_id: updatedClaim.insuranceInfo.payerId,
            insurance_payer_name: updatedClaim.insuranceInfo.payerName,
            insurance_plan_id: updatedClaim.insuranceInfo.planId,
            insurance_plan_name: updatedClaim.insuranceInfo.planName,
            insurance_subscriber_id: updatedClaim.insuranceInfo.subscriberId,
            insurance_group_number: updatedClaim.insuranceInfo.groupNumber,
            relationship_to_subscriber: updatedClaim.insuranceInfo.relationToSubscriber,
            rejection_reason: updatedClaim.rejectionReason,
            payment_amount: updatedClaim.paymentAmount,
            adjustment_amount: updatedClaim.adjustmentAmount,
            patient_responsibility: updatedClaim.patientResponsibility,
            notes: updatedClaim.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', claimId);
        
        if (updateError) throw new Error(updateError.message);
        
        // If procedure codes were updated, replace them
        if (updates.procedureCodes) {
          // Delete existing procedures
          const { error: deleteError } = await supabase
            .from('claim_procedures')
            .delete()
            .eq('claim_id', claimId);
          
          if (deleteError) throw new Error(deleteError.message);
          
          // Insert new procedures
          if (updatedClaim.procedureCodes.length > 0) {
            const procedureRecords = updatedClaim.procedureCodes.map(proc => ({
              claim_id: claimId,
              code: proc.code,
              description: proc.description,
              fee: proc.fee,
              service_date: proc.date,
              tooth: proc.tooth,
              surface: proc.surface,
              quadrant: proc.quadrant
            }));
            
            const { error: insertError } = await supabase
              .from('claim_procedures')
              .insert(procedureRecords);
            
            if (insertError) throw new Error(insertError.message);
          }
        }
        
        // If diagnosis codes were updated, replace them
        if (updates.diagnosisCodes) {
          // Delete existing diagnoses
          const { error: deleteError } = await supabase
            .from('claim_diagnosis')
            .delete()
            .eq('claim_id', claimId);
          
          if (deleteError) throw new Error(deleteError.message);
          
          // Insert new diagnoses
          if (updatedClaim.diagnosisCodes.length > 0) {
            const diagnosisRecords = updatedClaim.diagnosisCodes.map(diag => ({
              claim_id: claimId,
              code: diag.code,
              description: diag.description
            }));
            
            const { error: insertError } = await supabase
              .from('claim_diagnosis')
              .insert(diagnosisRecords);
            
            if (insertError) throw new Error(insertError.message);
          }
        }
        
        // Add a claim event for the update
        if (currentClaim.status !== updatedClaim.status) {
          const { error: eventError } = await supabase
            .from('claim_events')
            .insert({
              claim_id: claimId,
              title: `Status Changed to ${updatedClaim.status}`,
              description: `Claim status updated from ${currentClaim.status} to ${updatedClaim.status}`,
              status: updatedClaim.status
            });
          
          if (eventError) throw new Error(eventError.message);
        } else {
          const { error: eventError } = await supabase
            .from('claim_events')
            .insert({
              claim_id: claimId,
              title: 'Claim Updated',
              description: 'Claim information was updated',
              status: updatedClaim.status
            });
          
          if (eventError) throw new Error(eventError.message);
        }
        
        // Commit the transaction
        await supabase.rpc('commit_transaction');
        
        // Fetch the updated claim with all related data
        const refreshedClaim = await fetchClaimById(claimId);
        
        return {
          success: true,
          message: 'Claim updated successfully',
          claim: refreshedClaim || undefined
        };
      } catch (error) {
        // Rollback in case of error
        await supabase.rpc('rollback_transaction');
        throw error;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [fetchClaimById]);
  
  // Delete a claim
  const deleteClaim = useCallback(async (claimId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('claims')
        .delete()
        .eq('id', claimId);
      
      if (error) throw error;
      
      // Update local state
      setClaims(prev => prev.filter(claim => claim.id !== claimId));
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Submit a claim to insurance (change status and add event)
  const submitClaimToInsurance = useCallback(async (claimId: string): Promise<ClaimSubmissionResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch the current claim
      const claim = await fetchClaimById(claimId);
      if (!claim) {
        return {
          success: false,
          message: 'Claim not found'
        };
      }
      
      // Validate the claim for submission
      const validationErrors = validateClaimForSubmission(claim);
      if (validationErrors.length > 0) {
        return {
          success: false,
          message: 'Validation failed',
          validationErrors
        };
      }
      
      // In a real implementation, this would integrate with an electronic claims service
      // For this example, we'll simulate submission by updating the status
      
      // Update the claim status to SUBMITTED
      const { error: updateError } = await supabase
        .from('claims')
        .update({
          status: ClaimStatus.SUBMITTED,
          updated_at: new Date().toISOString()
        })
        .eq('id', claimId);
      
      if (updateError) throw updateError;
      
      // Add a claim event
      const { error: eventError } = await supabase
        .from('claim_events')
        .insert({
          claim_id: claimId,
          title: 'Claim Submitted to Insurance',
          description: `Claim was electronically submitted to ${claim.insuranceInfo.payerName || claim.insuranceInfo.payerId}`,
          status: ClaimStatus.SUBMITTED
        });
      
      if (eventError) throw eventError;
      
      // Get the updated claim
      const updatedClaim = await fetchClaimById(claimId);
      
      return {
        success: true,
        message: 'Claim submitted successfully',
        claim: updatedClaim || undefined
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [fetchClaimById]);
  
  // Fetch pending Electronic Remittance Advice (ERA) files
  const fetchPendingERAs = useCallback(async (): Promise<ERA[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('electronic_remittance_advice')
        .select('*')
        .is('processed_at', null)
        .order('received_date', { ascending: false });
      
      if (error) throw error;
      
      return data.map((era: any) => ({
        id: era.id,
        payerId: era.payer_id,
        payerName: era.payer_name,
        checkNumber: era.check_number,
        checkDate: era.check_date,
        receivedDate: era.received_date,
        totalPayment: era.total_payment,
        claimCount: era.claim_count,
        processedAt: era.processed_at,
        createdAt: era.created_at
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Process an ERA
  const processERA = useCallback(async (eraId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would process payments from the ERA
      // For this example, we'll simulate by updating the ERA status
      
      // Mark the ERA as processed
      const { error } = await supabase
        .from('electronic_remittance_advice')
        .update({
          processed_at: new Date().toISOString()
        })
        .eq('id', eraId);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch claims summary data
  const fetchClaimsSummary = useCallback(async (): Promise<ClaimsSummaryData> => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would use database aggregation
      // For this example, we'll fetch all claims and count manually
      
      const { data, error } = await supabase
        .from('claims')
        .select('status');
      
      if (error) throw error;
      
      const statusCounts = data.reduce((counts: Record<string, number>, claim: any) => {
        counts[claim.status] = (counts[claim.status] || 0) + 1;
        return counts;
      }, {});
      
      const summary: ClaimsSummaryData = {
        total: data.length,
        draft: statusCounts[ClaimStatus.DRAFT] || 0,
        pending: statusCounts[ClaimStatus.PENDING] || 0,
        submitted: statusCounts[ClaimStatus.SUBMITTED] || 0,
        accepted: statusCounts[ClaimStatus.ACCEPTED] || 0,
        rejected: statusCounts[ClaimStatus.REJECTED] || 0,
        paid: statusCounts[ClaimStatus.PAID] || 0
      };
      
      return summary;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      
      // Return empty summary data
      return {
        total: 0,
        draft: 0,
        pending: 0,
        submitted: 0,
        accepted: 0,
        rejected: 0,
        paid: 0
      };
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Verify insurance eligibility
  const verifyInsurance = useCallback(async (patientId: string, insuranceId: string): Promise<InsuranceVerificationResult> => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call an eligibility verification service
      // For this example, we'll return mock data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, would fetch from an API and store in the database
      const mockResult: InsuranceVerificationResult = {
        patientId,
        insuranceId,
        verificationDate: new Date().toISOString(),
        eligible: true,
        coverageStart: '2025-01-01',
        coverageEnd: '2025-12-31',
        planName: 'Delta Dental Premier',
        planType: 'PPO',
        subscriberId: 'SUB12345',
        groupNumber: 'GRP98765',
        deductible: {
          individual: 50,
          family: 150,
          remaining: 25
        },
        remainingBenefit: 1250,
        coveragePercentages: {
          preventive: 100,
          basic: 80,
          major: 50,
          orthodontic: 50
        },
        waitingPeriods: {
          major: '6 months',
          orthodontic: '12 months'
        },
        verificationNotes: 'Patient has met preventive and basic services waiting periods. Major services waiting period ends 07/01/2025.'
      };
      
      return mockResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Upload an attachment to a claim
  const uploadAttachment = useCallback(async (claimId: string, file: File, type: string): Promise<Attachment> => {
    setLoading(true);
    setError(null);
    
    try {
      // Generate a unique file path
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const filePath = `claims/${claimId}/${timestamp}-${file.name}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('attachments')
        .getPublicUrl(filePath);
      
      const publicUrl = urlData.publicUrl;
      
      // Add record to claim_attachments table
      const { data, error } = await supabase
        .from('claim_attachments')
        .insert({
          claim_id: claimId,
          filename: file.name,
          file_path: publicUrl,
          file_type: type,
          content_type: file.type,
          size: file.size
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Add a claim event
      await supabase
        .from('claim_events')
        .insert({
          claim_id: claimId,
          title: 'Attachment Added',
          description: `Added ${type} attachment: ${file.name}`,
          status: ClaimStatus.DRAFT // Use the current claim status in a real implementation
        });
      
      const attachment: Attachment = {
        id: data.id,
        claimId: data.claim_id,
        filename: data.filename,
        type: data.file_type,
        url: data.file_path,
        contentType: data.content_type,
        size: data.size,
        uploadedAt: data.uploaded_at
      };
      
      return attachment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Remove an attachment from a claim
  const removeAttachment = useCallback(async (attachmentId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // Get the attachment record first
      const { data: attachmentData, error: fetchError } = await supabase
        .from('claim_attachments')
        .select('*')
        .eq('id', attachmentId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Delete from storage
      // Extract the path from the URL
      const storagePath = attachmentData.file_path.split('/').slice(-3).join('/');
      const { error: storageError } = await supabase.storage
        .from('attachments')
        .remove([storagePath]);
      
      if (storageError) throw storageError;
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('claim_attachments')
        .delete()
        .eq('id', attachmentId);
      
      if (dbError) throw dbError;
      
      // Add a claim event
      await supabase
        .from('claim_events')
        .insert({
          claim_id: attachmentData.claim_id,
          title: 'Attachment Removed',
          description: `Removed ${attachmentData.file_type} attachment: ${attachmentData.filename}`,
          status: ClaimStatus.DRAFT // Use the current claim status in a real implementation
        });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Validate claim data using the validation utility
  const validateClaimData = useCallback((claim: Claim): ValidationError[] => {
    return validateClaim(claim);
  }, []);
  
  // Memoized context value
  const contextValue = {
    claims,
    loading,
    error,
    fetchClaims,
    fetchClaimById,
    submitClaim,
    updateClaim,
    deleteClaim,
    submitClaimToInsurance,
    fetchPendingERAs,
    processERA,
    fetchClaimsSummary,
    verifyInsurance,
    uploadAttachment,
    removeAttachment,
    validateClaimData
  };
  
  return (
    <ClaimsContext.Provider value={contextValue}>
      {children}
    </ClaimsContext.Provider>
  );
};

// Custom hook to use the ClaimsContext
export const useClaimsContext = () => {
  const context = useContext(ClaimsContext);
  if (context === undefined) {
    throw new Error('useClaimsContext must be used within a ClaimsProvider');
  }
  return context;
};