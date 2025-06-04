import React, { useState, useEffect } from 'react';
import { Tabs, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiDocumentAdd, HiChartPie, HiInboxIn } from 'react-icons/hi';
import { ClaimsList } from '../../../components/claims/ClaimsList';
import { ClaimStatusSummary } from '../../../components/claims/ClaimStatusSummary';
import { ERAProcessor } from '../../../components/claims/ERAProcessor';
import { InsuranceVerification } from '../../../components/claims/InsuranceVerification';
import { useClaimsContext } from '../../../contexts/ClaimsContext';
import { ClaimStatus, ClaimStatusFilter, InsuranceVerificationResult, ClaimsSummary } from '../../../types/claims.types';

/**
 * Main dashboard page for the claims module
 */
export const ClaimsDashboard: React.FC = () => {
  const { fetchClaimsSummary, verifyInsurance } = useClaimsContext();
  const [statusFilter, setStatusFilter] = useState<ClaimStatusFilter>('all');
  const [summaryData, setSummaryData] = useState<ClaimsSummary>({
    total: 0,
    draft: 0,
    pending: 0,
    submitted: 0,
    accepted: 0,
    approved: 0, // Matches accepted but kept for backward compatibility
    rejected: 0,
    paid: 0
  });
  
  const [patients, setPatients] = useState<Array<{ id: string; name: string }>>([]);
  const [insurancePlans, setInsurancePlans] = useState<Array<{ id: string; name: string; payerId: string }>>([]);
  
  // Load claims summary data
  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await fetchClaimsSummary();
        setSummaryData(data);
      } catch (error) {
        console.error('Error fetching claims summary:', error);
      }
    };
    
    loadSummary();
  }, [fetchClaimsSummary]);
  
  // Sample patient and insurance data (in a real app, this would come from the API)
  useEffect(() => {
    // Simulate API call to fetch patients
    setPatients([
      { id: 'p1', name: 'John Smith' },
      { id: 'p2', name: 'Alice Johnson' },
      { id: 'p3', name: 'Robert Davis' },
      { id: 'p4', name: 'Maria Garcia' },
      { id: 'p5', name: 'James Wilson' }
    ]);
    
    // Simulate API call to fetch insurance plans
    setInsurancePlans([
      { id: 'ins1', name: 'Delta Dental Premier', payerId: 'DELTA001' },
      { id: 'ins2', name: 'MetLife Dental', payerId: 'METLIFE001' },
      { id: 'ins3', name: 'Cigna Dental PPO', payerId: 'CIGNA001' },
      { id: 'ins4', name: 'Aetna Dental', payerId: 'AETNA001' },
      { id: 'ins5', name: 'Guardian Dental', payerId: 'GUARDIAN001' }
    ]);
  }, []);
  
  /**
   * Handle insurance verification request
   */
  const handleVerifyInsurance = async (patientId: string, insuranceId: string): Promise<InsuranceVerificationResult> => {
    try {
      return await verifyInsurance(patientId, insuranceId);
    } catch (error) {
      console.error('Error verifying insurance:', error);
      throw error;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-3 sm:mb-0">Insurance Claims Dashboard</h1>
        <Link to="/claims/new">
          <Button color="primary" className="flex items-center">
            <HiDocumentAdd className="mr-2" /> New Claim
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <ClaimStatusSummary 
          title="Total Claims" 
          count={summaryData.total} 
          onClick={() => setStatusFilter('all')} 
          active={statusFilter === 'all'}
          icon={HiChartPie}
        />
        <ClaimStatusSummary 
          title="Draft" 
          count={summaryData.draft} 
          color="gray" 
          onClick={() => setStatusFilter(ClaimStatus.DRAFT)} 
          active={statusFilter === ClaimStatus.DRAFT}
        />
        <ClaimStatusSummary 
          title="Pending" 
          count={summaryData.pending} 
          color="yellow" 
          onClick={() => setStatusFilter(ClaimStatus.PENDING)} 
          active={statusFilter === ClaimStatus.PENDING}
        />
        <ClaimStatusSummary 
          title="Submitted" 
          count={summaryData.submitted} 
          color="blue" 
          onClick={() => setStatusFilter(ClaimStatus.SUBMITTED)} 
          active={statusFilter === ClaimStatus.SUBMITTED}
        />
        <ClaimStatusSummary 
          title="Rejected" 
          count={summaryData.rejected} 
          color="red" 
          onClick={() => setStatusFilter(ClaimStatus.REJECTED)} 
          active={statusFilter === ClaimStatus.REJECTED}
        />
        <ClaimStatusSummary 
          title="Paid" 
          count={summaryData.paid} 
          color="green" 
          onClick={() => setStatusFilter(ClaimStatus.PAID)} 
          active={statusFilter === ClaimStatus.PAID}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Tabs>
          <Tabs.Item active title="Claims" icon={HiDocumentAdd}>
            <ClaimsList statusFilter={statusFilter} />
          </Tabs.Item>
          <Tabs.Item title="ERA Processing" icon={HiInboxIn}>
            <ERAProcessor />
          </Tabs.Item>
          <Tabs.Item title="Insurance Verification">
            <InsuranceVerification 
              onVerify={handleVerifyInsurance}
              patients={patients}
              insurancePlans={insurancePlans}
            />
          </Tabs.Item>
        </Tabs>
      </div>
    </div>
  );
};