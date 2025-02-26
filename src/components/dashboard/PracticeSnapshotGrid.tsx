import React, { useEffect, useState } from 'react';
import PracticeSnapshotCard from './PracticeSnapshotCard';
// Import AI agents (commented out for now since we'll use mock data)
// import { HeadBrainConsultant } from '../../ai/orchestrator/head-brain.agent';
// import { DataAnalysisAgent } from '../../ai/data-analysis/data-analysis.agent';

interface SnapshotData {
  title: string;
  value: string;
  change?: number;
  icon: 'DollarSign' | 'Users' | 'Star' | 'Calendar' | 'HeartPulse' | 'Award' | 'Activity';
  variant: 'primary' | 'secondary' | 'accent1' | 'accent2';
  linkTo: string;
  description?: string;
}

export const PracticeSnapshotGrid = () => {
  const [loading, setLoading] = useState(true);
  const [snapshots, setSnapshots] = useState<SnapshotData[]>([]);
  
  // This would fetch real data in production
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // In a real implementation, this would use the AI agents to fetch data
        // const headBrain = new HeadBrainConsultant();
        // const analysisAgent = new DataAnalysisAgent();
        // const practiceData = await dataRetrievalAgent.fetchDataForAnalysis('practice overview');
        // const analysis = await analysisAgent.analyzeKPI(practiceData);
        
        // For now, we'll use mock data that represents what would come from the AI
        const mockData: SnapshotData[] = [
          {
            title: 'Practice Revenue',
            value: '$1.45M',
            change: 8,
            icon: 'DollarSign',
            variant: 'primary',
            linkTo: '/dashboard/revenue-dashboard',
            description: 'YTD performance against $1.6M goal'
          },
          {
            title: 'Active Patients',
            value: '1,234',
            change: 5,
            icon: 'Users',
            variant: 'secondary',
            linkTo: '/dashboard/active-patients',
            description: '87 new patients this month'
          },
          {
            title: 'Patient Satisfaction',
            value: '4.8/5',
            change: 2,
            icon: 'Star',
            variant: 'accent1',
            linkTo: '/dashboard/patient-satisfaction',
            description: 'Based on 126 recent reviews'
          },
          {
            title: 'Treatment Plan Success',
            value: '78%',
            change: -3,
            icon: 'Award',
            variant: 'accent2',
            linkTo: '/dashboard/treatment-success',
            description: 'Case acceptance rate last 30 days'
          },
          {
            title: 'Monthly Revenue Report',
            value: 'May 2025',
            icon: 'Calendar',
            variant: 'primary',
            linkTo: '/dashboard/monthly-report',
            description: 'Current: 87% of monthly goal'
          },
          {
            title: 'Daily Huddle KPI\'s',
            value: 'Today',
            icon: 'Activity',
            variant: 'secondary',
            linkTo: '/dashboard/daily-huddle',
            description: '8 appointments scheduled'
          }
        ];
        
        setSnapshots(mockData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 bg-gradient-to-r from-navy to-turquoise text-transparent bg-clip-text">Practice Snapshots</h2>
        <p className="text-gray-500 text-sm">Click any card for detailed analytics and AI-powered insights</p>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white/50 rounded-xl p-6 h-40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snapshots.map((snapshot, index) => (
            <PracticeSnapshotCard
              key={index}
              title={snapshot.title}
              value={snapshot.value}
              change={snapshot.change}
              icon={snapshot.icon}
              variant={snapshot.variant}
              linkTo={snapshot.linkTo}
              description={snapshot.description}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PracticeSnapshotGrid;