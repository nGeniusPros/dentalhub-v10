import React, { useState, useEffect } from 'react';
import { Tabs, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import ClaimsList from '../../components/claims/ClaimsList';
import ClaimStatusSummary from '../../components/claims/ClaimStatusSummary';
import ERAProcessor from '../../components/claims/ERAProcessor';
import InsuranceVerification from '../../components/claims/InsuranceVerification';
import { useClaimsContext } from '../../contexts/ClaimsContext';
import { ClaimStatus, ClaimStatusFilter, ClaimsSummaryData } from '../../types/claims.types';

export const ClaimsDashboard: React.FC = () => {
  const { fetchClaimsSummary } = useClaimsContext();
  const [statusFilter, setStatusFilter] = useState<ClaimStatusFilter>('all');
  const [summaryData, setSummaryData] = useState<ClaimsSummaryData>({
    total: 0,
    draft: 0,
    pending: 0,
    submitted: 0,
    accepted: 0,
    rejected: 0,
    paid: 0
  });
  
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
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Insurance Claims Dashboard</h1>
        <Link to="/claims/new">
          <Button color="primary">New Claim</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <ClaimStatusSummary 
          title="Total Claims" 
          count={summaryData.total} 
          onClick={() => setStatusFilter('all')} 
          active={statusFilter === 'all'}
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
          <Tabs.Item title="Claims" active>
            <div className="p-4">
              <ClaimsList statusFilter={statusFilter} />
            </div>
          </Tabs.Item>
          <Tabs.Item title="ERA Processing">
            <div className="p-4">
              <ERAProcessor />
            </div>
          </Tabs.Item>
          <Tabs.Item title="Insurance Verification">
            <div className="p-4">
              <InsuranceVerification />
            </div>
          </Tabs.Item>
          <Tabs.Item title="Analytics">
            <div className="p-4">
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Claims analytics dashboard coming soon</p>
                <p className="text-sm text-gray-400">
                  View detailed reports on claims processing times, approval rates, and financial performance
                </p>
              </div>
            </div>
          </Tabs.Item>
        </Tabs>
      </div>
    </div>
  );
};

export default ClaimsDashboard;