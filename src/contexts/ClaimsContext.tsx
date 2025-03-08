import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Claim, 
  ClaimStatus, 
  ClaimStatusFilter,
  ERA,
  InsuranceVerificationResult,
  Attachment,
  ClaimSubmissionResponse,
  ClaimUpdateResponse,
  ClaimsSummary,
  ValidationError
} from '../types/claims.types';
import { validateClaim } from '../utils/claims/validation';

interface ClaimsContextType {
  claims: Claim[];
  loading: boolean;
  error: string | null;
  fetchClaims: (filter?: ClaimStatusFilter) => Promise<Claim[]>;
  fetchClaimById: (claimId: string) => Promise<Claim | null>;
  submitClaim: (claim: Claim) => Promise<ClaimSubmissionResponse>;
  updateClaim: (claimId: string, updates: Partial<Claim>) => Promise<ClaimUpdateResponse>;
  deleteClaim: (claimId: string) => Promise<{ success: boolean; message: string }>;
  fetchPendingERAs: () => Promise<ERA[]>;
  processERA: (eraId: string) => Promise<void>;
  fetchClaimsSummary: () => Promise<ClaimsSummary>;
  verifyInsurance: (patientId: string, insuranceId: string) => Promise<InsuranceVerificationResult>;
  uploadAttachment: (claimId: string, file: File, type: string) => Promise<Attachment>;
  removeAttachment: (attachmentId: string) => Promise<void>;
}

const ClaimsContext = createContext<ClaimsContextType | undefined>(undefined);

export const ClaimsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Fetch claims based on status filter
   */
  const fetchClaims = useCallback(async (filter: ClaimStatusFilter = 'all'): Promise<Claim[]> => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase.from('claims').select('*');
      
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data from snake_case to camelCase
      const transformedData = data.map(claim => ({
        id: claim.id,
        patientId: claim.patient_id,
        patientName: claim.patient_name,
        providerId: claim.provider_id,
        providerName: claim.provider_name,
        serviceDate: claim.service_date,
        totalFee: claim.total_fee,
        status: claim.status,
        insuranceInfo: {
          payerId: claim.insurance_payer_id,
          payerName: claim.insurance_payer_name,
          planId: claim.insurance_plan_id,
          planName: claim.insurance_plan_name,
          subscriberId: claim.insurance_subscriber_id,
          groupNumber: claim.insurance_group_number
        },
        rejectionReason: claim.rejection_reason,
        paymentAmount: claim.payment_amount,
        adjustmentAmount: claim.adjustment_amount,
        patientResponsibility: claim.patient_responsibility,
        notes: claim.notes,
        createdAt: claim.created_at,
        updatedAt: claim.updated_at,
        procedureCodes: [],
        diagnosisCodes: []
      }));
      
      setClaims(transformedData as Claim[]);
      return transformedData as Claim[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Fetch a single claim by ID with related data
   */
  const fetchClaimById = useCallback(async (claimId: string): Promise<Claim | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch main claim data
      const { data: claimData, error: claimError } = await supabase
        .from('claims')
        .select('*')
        .eq('id', claimId)
        .single();
      
      if (claimError) throw claimError;
      
      // Fetch procedures
      const { data: procedures, error: proceduresError } = await supabase
        .from('claim_procedures')
        .select('*')
        .eq('claim_id', claimId);
      
      if (proceduresError) throw proceduresError;
      
      // Fetch diagnoses
      const { data: diagnoses, error: diagnosesError } = await supabase
        .from('claim_diagnosis')
        .select('*')
        .eq('claim_id', claimId);
      
      if (diagnosesError) throw diagnosesError;
      
      // Fetch attachments
      const { data: attachments, error: attachmentsError } = await supabase
        .from('claim_attachments')
        .select('*')
        .eq('claim_id', claimId);
      
      if (attachmentsError) throw attachmentsError;
      
      // Fetch events
      const { data: events, error: eventsError } = await supabase
        .from('claim_events')
        .select('*')
        .eq('claim_id', claimId)
        .order('timestamp', { ascending: false });
      
      if (eventsError) throw eventsError;
      
      // Transform and combine data
      const claim: Claim = {
        id: claimData.id,
        patientId: claimData.patient_id,
        patientName: claimData.patient_name,
        providerId: claimData.provider_id,
        providerName: claimData.provider_name,
        serviceDate: claimData.service_date,
        totalFee: claimData.total_fee,
        status: claimData.status,
        insuranceInfo: {
          payerId: claimData.insurance_payer_id,
          payerName: claimData.insurance_payer_name,
          planId: claimData.insurance_plan_id,
          planName: claimData.insurance_plan_name,
          subscriberId: claimData.insurance_subscriber_id,
          groupNumber: claimData.insurance_group_number
        },
        rejectionReason: claimData.rejection_reason,
        paymentAmount: claimData.payment_amount,
        adjustmentAmount: claimData.adjustment_amount,
        patientResponsibility: claimData.patient_responsibility,
        notes: claimData.notes,
        createdAt: claimData.created_at,
        updatedAt: claimData.updated_at,
        procedureCodes: procedures.map(proc => ({
          code: proc.code,
          description: proc.description,
          fee: proc.fee,
          date: proc.service_date,
          tooth: proc.tooth,
          surface: proc.surface,
          quadrant: proc.quadrant
        })),
        diagnosisCodes: diagnoses.map(diag => ({
          code: diag.code,
          description: diag.description
        })),
        attachments: attachments.map(att => ({
          id: att.id,
          claimId: att.claim_id,
          filename: att.filename,
          type: att.file_type,
          url: att.file_path,
          uploadedAt: att.uploaded_at,
          size: att.size,
          contentType: att.content_type
        })),
        events: events.map(event => ({
          timestamp: event.timestamp,
          title: event.title,
          description: event.description,
          status: event.status,
          userId: event.user_id
        }))
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
  
  /**
   * Submit a new claim
   */
  const submitClaim = useCallback(async (claim: Claim): Promise<ClaimSubmissionResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate claim data
      const validationErrors = validateClaim(claim);
      if (validationErrors.length > 0) {
        return {
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        };
      }
      
      // Begin transaction
      const { error: txError } = await supabase.rpc('begin_transaction');
      if (txError) throw txError;
      
      try {
        // Insert main claim data
        const { data: claimData, error: claimError } = await supabase
          .from('claims')
          .insert({
            patient_id: claim.patientId,
            provider_id: claim.providerId,
            service_date: claim.serviceDate,
            total_fee: claim.totalFee,
            status: ClaimStatus.DRAFT,
            insurance_payer_id: claim.insuranceInfo.payerId,
            insurance_payer_name: claim.insuranceInfo.payerName,
            insurance_plan_id: claim.insuranceInfo.planId,
            insurance_plan_name: claim.insuranceInfo.planName,
            insurance_subscriber_id: claim.insuranceInfo.subscriberId,
            insurance_group_number: claim.insuranceInfo.groupNumber,
            notes: claim.notes
          })
          .select()
          .single();
        
        if (claimError) throw claimError;
        
        const claimId = claimData.id;
        
        // Insert procedures
        if (claim.procedureCodes.length > 0) {
          const procedureData = claim.procedureCodes.map(proc => ({
            claim_id: claimId,
            code: proc.code,
            description: proc.description,
            fee: proc.fee,
            service_date: proc.date,
            tooth: proc.tooth,
            surface: proc.surface,
            quadrant: proc.quadrant
          }));
          
          const { error: procError } = await supabase
            .from('claim_procedures')
            .insert(procedureData);
          
          if (procError) throw procError;
        }
        
        // Insert diagnoses
        if (claim.diagnosisCodes.length > 0) {
          const diagnosisData = claim.diagnosisCodes.map(diag => ({
            claim_id: claimId,
            code: diag.code,
            description: diag.description
          }));
          
          const { error: diagError } = await supabase
            .from('claim_diagnosis')
            .insert(diagnosisData);
          
          if (diagError) throw diagError;
        }
        
        // Add initial claim event
        await supabase
          .from('claim_events')
          .insert({
            claim_id: claimId,
            title: 'Claim Created',
            description: 'Claim was created as a draft',
            status: ClaimStatus.DRAFT,
            user_id: null // TODO: Get from auth context
          });
        
        // Commit transaction
        await supabase.rpc('commit_transaction');
        
        // Fetch the complete claim with all related data
        const newClaim = await fetchClaimById(claimId);
        
        return {
          success: true,
          message: 'Claim created successfully',
          claim: newClaim || undefined
        };
      } catch (error) {
        // Rollback transaction
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
  
  /**
   * Update an existing claim
   */
  const updateClaim = useCallback(async (claimId: string, updates: Partial<Claim>): Promise<ClaimUpdateResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      // Begin transaction
      const { error: txError } = await supabase.rpc('begin_transaction');
      if (txError) throw txError;
      
      try {
        // Prepare updates in snake_case format
        const claimUpdates: Record<string, any> = {
          updated_at: new Date().toISOString()
        };
        
        // Map camelCase properties to snake_case for the database
        if (updates.patientId) claimUpdates.patient_id = updates.patientId;
        if (updates.providerId) claimUpdates.provider_id = updates.providerId;
        if (updates.serviceDate) claimUpdates.service_date = updates.serviceDate;
        if (updates.totalFee) claimUpdates.total_fee = updates.totalFee;
        if (updates.status) claimUpdates.status = updates.status;
        if (updates.notes) claimUpdates.notes = updates.notes;
        if (updates.rejectionReason) claimUpdates.rejection_reason = updates.rejectionReason;
        if (updates.paymentAmount) claimUpdates.payment_amount = updates.paymentAmount;
        if (updates.adjustmentAmount) claimUpdates.adjustment_amount = updates.adjustmentAmount;
        if (updates.patientResponsibility) claimUpdates.patient_responsibility = updates.patientResponsibility;
        
        // Insurance info updates
        if (updates.insuranceInfo) {
          if (updates.insuranceInfo.payerId) claimUpdates.insurance_payer_id = updates.insuranceInfo.payerId;
          if (updates.insuranceInfo.payerName) claimUpdates.insurance_payer_name = updates.insuranceInfo.payerName;
          if (updates.insuranceInfo.planId) claimUpdates.insurance_plan_id = updates.insuranceInfo.planId;
          if (updates.insuranceInfo.planName) claimUpdates.insurance_plan_name = updates.insuranceInfo.planName;
          if (updates.insuranceInfo.subscriberId) claimUpdates.insurance_subscriber_id = updates.insuranceInfo.subscriberId;
          if (updates.insuranceInfo.groupNumber) claimUpdates.insurance_group_number = updates.insuranceInfo.groupNumber;
        }
        
        // Update the main claim record
        const { error: updateError } = await supabase
          .from('claims')
          .update(claimUpdates)
          .eq('id', claimId);
        
        if (updateError) throw updateError;
        
        // Update procedures if provided
        if (updates.procedureCodes) {
          // Delete existing procedures
          const { error: deleteError } = await supabase
            .from('claim_procedures')
            .delete()
            .eq('claim_id', claimId);
          
          if (deleteError) throw deleteError;
          
          // Insert new procedures
          if (updates.procedureCodes.length > 0) {
            const procedureData = updates.procedureCodes.map(proc => ({
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
              .insert(procedureData);
            
            if (insertError) throw insertError;
          }
        }
        
        // Update diagnoses if provided
        if (updates.diagnosisCodes) {
          // Delete existing diagnoses
          const { error: deleteError } = await supabase
            .from('claim_diagnosis')
            .delete()
            .eq('claim_id', claimId);
          
          if (deleteError) throw deleteError;
          
          // Insert new diagnoses
          if (updates.diagnosisCodes.length > 0) {
            const diagnosisData = updates.diagnosisCodes.map(diag => ({
              claim_id: claimId,
              code: diag.code,
              description: diag.description
            }));
            
            const { error: insertError } = await supabase
              .from('claim_diagnosis')
              .insert(diagnosisData);
            
            if (insertError) throw insertError;
          }
        }
        
        // Add claim event for status change
        if (updates.status) {
          await supabase
            .from('claim_events')
            .insert({
              claim_id: claimId,
              title: `Status Changed to ${updates.status}`,
              description: `Claim status was updated to ${updates.status}`,
              status: updates.status,
              user_id: null // TODO: Get from auth context
            });
        }
        
        // Commit transaction
        await supabase.rpc('commit_transaction');
        
        // Fetch the updated claim with all related data
        const updatedClaim = await fetchClaimById(claimId);
        
        return {
          success: true,
          message: 'Claim updated successfully',
          claim: updatedClaim || undefined
        };
      } catch (error) {
        // Rollback transaction
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
  
  /**
   * Delete a claim
   */
  const deleteClaim = useCallback(async (claimId: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if claim exists
      const { data, error: fetchError } = await supabase
        .from('claims')
        .select('status')
        .eq('id', claimId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Only allow deletion of draft claims
      if (data.status !== ClaimStatus.DRAFT) {
        return {
          success: false,
          message: 'Only draft claims can be deleted'
        };
      }
      
      // Begin transaction
      const { error: txError } = await supabase.rpc('begin_transaction');
      if (txError) throw txError;
      
      try {
        // Delete related records first (cascade delete not always reliable with Supabase)
        
        // Delete procedures
        const { error: procError } = await supabase
          .from('claim_procedures')
          .delete()
          .eq('claim_id', claimId);
        
        if (procError) throw procError;
        
        // Delete diagnoses
        const { error: diagError } = await supabase
          .from('claim_diagnosis')
          .delete()
          .eq('claim_id', claimId);
        
        if (diagError) throw diagError;
        
        // Delete attachments
        const { error: attachError } = await supabase
          .from('claim_attachments')
          .delete()
          .eq('claim_id', claimId);
        
        if (attachError) throw attachError;
        
        // Delete events
        const { error: eventError } = await supabase
          .from('claim_events')
          .delete()
          .eq('claim_id', claimId);
        
        if (eventError) throw eventError;
        
        // Finally delete the claim itself
        const { error: deleteError } = await supabase
          .from('claims')
          .delete()
          .eq('id', claimId);
        
        if (deleteError) throw deleteError;
        
        // Commit transaction
        await supabase.rpc('commit_transaction');
        
        // Update the local state
        setClaims(prevClaims => prevClaims.filter(claim => claim.id !== claimId));
        
        return {
          success: true,
          message: 'Claim deleted successfully'
        };
      } catch (error) {
        // Rollback transaction
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
  }, []);
  
  /**
   * Fetch pending ERAs
   */
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
      
      // Transform data
      const transformedData = data.map(era => ({
        id: era.id,
        payerId: era.payer_id,
        payerName: era.payer_name,
        checkNumber: era.check_number,
        checkDate: era.check_date,
        receivedDate: era.received_date,
        totalPayment: era.total_payment,
        claimCount: era.claim_count,
        processedAt: era.processed_at
      }));
      
      return transformedData as ERA[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Process an ERA and update claims
   */
  const processERA = useCallback(async (eraId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Call the server-side function that processes the ERA
      const { error } = await supabase.rpc('process_era', { era_id: eraId });
      
      if (error) throw error;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Fetch claims summary statistics
   */
  const fetchClaimsSummary = useCallback(async (): Promise<ClaimsSummary> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.rpc('get_claims_summary');
      
      if (error) throw error;
      
      // Format the result with all required properties
      return {
        total: data.total,
        draft: data.draft || 0,
        pending: data.pending || 0,
        submitted: data.submitted || 0,
        accepted: data.accepted || 0,
        approved: data.accepted || 0, // Alias for accepted
        rejected: data.rejected || 0,
        paid: data.paid || 0
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      
      // Return default empty summary
      return {
        total: 0,
        draft: 0,
        pending: 0,
        submitted: 0,
        accepted: 0,
        approved: 0,
        rejected: 0,
        paid: 0
      };
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Verify insurance eligibility
   */
  const verifyInsurance = useCallback(async (patientId: string, insuranceId: string): Promise<InsuranceVerificationResult> => {
    setLoading(true);
    setError(null);
    
    try {
      // Call verification API
      // This would typically be an external API call, but for simplicity,
      // we're using a supabase function here
      const { data, error } = await supabase.rpc('verify_insurance_eligibility', {
        patient_id: patientId,
        insurance_id: insuranceId
      });
      
      if (error) throw error;
      
      // Transform returned data
      const result: InsuranceVerificationResult = {
        patientId: data.patient_id,
        insuranceId: data.insurance_id,
        verificationDate: data.verification_date,
        eligible: data.eligible,
        coverageStart: data.coverage_start,
        coverageEnd: data.coverage_end,
        planName: data.plan_name,
        planType: data.plan_type,
        subscriberId: data.subscriber_id,
        groupNumber: data.group_number,
        deductible: {
          individual: data.deductible_individual,
          family: data.deductible_family,
          remaining: data.deductible_remaining
        },
        remainingBenefit: data.remaining_benefit,
        coveragePercentages: {
          preventive: data.preventive_coverage,
          basic: data.basic_coverage,
          major: data.major_coverage,
          orthodontic: data.orthodontic_coverage
        },
        waitingPeriods: {
          basic: data.basic_waiting,
          major: data.major_waiting,
          orthodontic: data.orthodontic_waiting
        },
        verificationNotes: data.verification_notes
      };
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Upload an attachment for a claim
   */
  const uploadAttachment = useCallback(async (claimId: string, file: File, type: string): Promise<Attachment> => {
    setLoading(true);
    setError(null);
    
    try {
      // Create a unique file path
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const filePath = `claims/${claimId}/attachments/${timestamp}.${fileExt}`;
      
      // Upload the file to storage
      const { error: uploadError } = await supabase.storage
        .from('claim-attachments')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('claim-attachments')
        .getPublicUrl(filePath);
      
      const publicUrl = urlData.publicUrl;
      
      // Save the attachment record in the database
      const { data, error: dbError } = await supabase
        .from('claim_attachments')
        .insert({
          claim_id: claimId,
          filename: file.name,
          file_path: publicUrl,
          file_type: type,
          content_type: file.type,
          size: file.size,
          uploaded_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (dbError) throw dbError;
      
      // Transform to Attachment type
      const attachment: Attachment = {
        id: data.id,
        claimId: data.claim_id,
        filename: data.filename,
        type: data.file_type,
        url: data.file_path,
        uploadedAt: data.uploaded_at,
        size: data.size,
        contentType: data.content_type
      };
      
      return attachment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Remove an attachment
   */
  const removeAttachment = useCallback(async (attachmentId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Get the attachment record first to find the file path
      const { data, error: fetchError } = await supabase
        .from('claim_attachments')
        .select('file_path')
        .eq('id', attachmentId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Extract the storage path from the public URL
      const urlParts = data.file_path.split('/');
      const storagePath = urlParts.slice(urlParts.indexOf('claim-attachments') + 1).join('/');
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('claim-attachments')
        .remove([storagePath]);
      
      if (storageError) throw storageError;
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('claim_attachments')
        .delete()
        .eq('id', attachmentId);
      
      if (dbError) throw dbError;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Export context value
  const value = {
    claims,
    loading,
    error,
    fetchClaims,
    fetchClaimById,
    submitClaim,
    updateClaim,
    deleteClaim,
    fetchPendingERAs,
    processERA,
    fetchClaimsSummary,
    verifyInsurance,
    uploadAttachment,
    removeAttachment
  };
  
  return (
    <ClaimsContext.Provider value={value}>
      {children}
    </ClaimsContext.Provider>
  );
};

export const useClaimsContext = () => {
  const context = useContext(ClaimsContext);
  if (context === undefined) {
    throw new Error('useClaimsContext must be used within a ClaimsProvider');
  }
  return context;
};