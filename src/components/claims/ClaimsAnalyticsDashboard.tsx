import React, { useEffect, useState } from 'react';
import { Card, Spinner } from 'flowbite-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ClaimsReportData, ClaimStatus } from '../../types/claims.types';

const ClaimsAnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<ClaimsReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real implementation, this would call an API or RPC function
        // For now, we'll simulate data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData: ClaimsReportData = {
          byStatus: [
            { status: ClaimStatus.DRAFT, count: 12 },
            { status: ClaimStatus.PENDING, count: 8 },
            { status: ClaimStatus.SUBMITTED, count: 15 },
            { status: ClaimStatus.ACCEPTED, count: 10 },
            { status: ClaimStatus.REJECTED, count: 5 },
            { status: ClaimStatus.PAID, count: 20 }
          ],
          byMonth: [
            { month: 'Jan', submitted: 12, paid: 10, rejected: 2 },
            { month: 'Feb', submitted: 15, paid: 12, rejected: 3 },
            { month: 'Mar', submitted: 18, paid: 14, rejected: 4 },
            { month: 'Apr', submitted: 20, paid: 16, rejected: 2 },
            { month: 'May', submitted: 22, paid: 18, rejected: 1 },
            { month: 'Jun', submitted: 25, paid: 20, rejected: 2 }
          ],
          avgProcessingTime: [
            { payer: 'Delta Dental', days: 12 },
            { payer: 'Aetna', days: 15 },
            { payer: 'Blue Cross', days: 10 },
            { payer: 'Cigna', days: 14 },
            { payer: 'Guardian', days: 18 }
          ],
          topRejectionReasons: [
            { reason: 'Missing Information', count: 12 },
            { reason: 'Non-Covered Service', count: 10 },
            { reason: 'Patient Ineligible', count: 8 },
            { reason: 'Duplicate Claim', count: 6 },
            { reason: 'Authorization Required', count: 4 }
          ],
          financialSummary: {
            totalBilled: 85000,
            totalPaid: 68000,
            totalAdjusted: 12000,
            totalPatientResponsibility: 5000,
            averageReimbursementRate: 80
          }
        };
        
        setAnalyticsData(mockData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching analytics data:', errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, []);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];
  
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="xl" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>Error loading analytics data: {error}</p>
      </div>
    );
  }
  
  if (!analyticsData) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <h4 className="text-lg font-medium mb-4">Claims by Status</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={analyticsData.byStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="status"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {analyticsData.byStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} claims`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <Card>
        <h4 className="text-lg font-medium mb-4">Claims by Month</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData.byMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="submitted" stroke="#8884d8" />
              <Line type="monotone" dataKey="paid" stroke="#82ca9d" />
              <Line type="monotone" dataKey="rejected" stroke="#ff8042" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <Card>
        <h4 className="text-lg font-medium mb-4">Average Processing Time (Days)</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData.avgProcessingTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="payer" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="days" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <Card>
        <h4 className="text-lg font-medium mb-4">Top Rejection Reasons</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={analyticsData.topRejectionReasons}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="reason" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="count" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <Card className="lg:col-span-2">
        <h4 className="text-lg font-medium mb-4">Financial Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-700 mb-1">Total Billed</p>
            <p className="text-xl font-bold text-blue-900">
              ${analyticsData.financialSummary.totalBilled.toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-sm text-green-700 mb-1">Total Paid</p>
            <p className="text-xl font-bold text-green-900">
              ${analyticsData.financialSummary.totalPaid.toLocaleString()}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <p className="text-sm text-yellow-700 mb-1">Total Adjusted</p>
            <p className="text-xl font-bold text-yellow-900">
              ${analyticsData.financialSummary.totalAdjusted.toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-sm text-purple-700 mb-1">Patient Responsibility</p>
            <p className="text-xl font-bold text-purple-900">
              ${analyticsData.financialSummary.totalPatientResponsibility.toLocaleString()}
            </p>
          </div>
          <div className="bg-teal-50 rounded-lg p-4 text-center">
            <p className="text-sm text-teal-700 mb-1">Reimbursement Rate</p>
            <p className="text-xl font-bold text-teal-900">
              {analyticsData.financialSummary.averageReimbursementRate}%
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ClaimsAnalyticsDashboard;