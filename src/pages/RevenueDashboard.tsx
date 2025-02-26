import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChartContainer } from '../components/dashboard/charts/ChartContainer';
import { RevenueChart } from '../components/dashboard/charts/RevenueChart';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, DollarSign, PieChart } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
// Import AI components (commented out for now)
// import { DataAnalysisAgent } from '../ai/data-analysis/data-analysis.agent';
// import { RecommendationAgent } from '../ai/recommendation.agent';

// Types to represent data that would come from AI agents
interface RevenueData {
  annual: {
    actual: number;
    goal: number;
    performance: number;
    previousYear: number;
    yoyChange: number;
  };
  quarterly: {
    q1: { actual: number; goal: number; performance: number };
    q2: { actual: number; goal: number; performance: number };
    q3: { actual: number; goal: number; performance: number };
    q4: { actual: number; goal: number; performance: number };
  };
  ytd: {
    actual: number;
    goal: number;
    performance: number;
  };
  mtd: {
    actual: number;
    goal: number;
    performance: number;
    projected: number;
  };
  wtd: {
    actual: number;
    goal: number;
    performance: number;
  };
  marketing: {
    spend: number;
    revenuePercentage: number;
    roi: number;
    suggestedBudget: number;
  };
}

// Sample chart data - would be replaced with real data from AI analysis
const monthlyData = [
  { month: 'Jan', revenue: 124000, goal: 120000 },
  { month: 'Feb', revenue: 118000, goal: 120000 },
  { month: 'Mar', revenue: 156000, goal: 140000 },
  { month: 'Apr', revenue: 161000, goal: 140000 },
  { month: 'May', revenue: 109000, goal: 120000 },
  { month: 'Jun', revenue: 107000, goal: 120000 },
];

// These datasets would be used in a full implementation to show different time periods
/*
const quarterlyData = [
  { quarter: 'Q1', revenue: 398000, goal: 380000 },
  { quarter: 'Q2', revenue: 377000, goal: 380000 },
  { quarter: 'Q3', revenue: 415000, goal: 420000 },
  { quarter: 'Q4', revenue: 260000, goal: 420000, projected: true },
];
*/

// Marketing spend chart data
const marketingSpendData = [
  { category: 'Digital Ads', spend: 8500, roi: 3.2 },
  { category: 'Print/Mail', spend: 3200, roi: 1.8 },
  { category: 'Local Events', spend: 4500, roi: 2.5 },
  { category: 'Referral Program', spend: 2800, roi: 4.1 },
  { category: 'SEO/Website', spend: 5000, roi: 3.7 },
];

const RevenueDashboard = () => {
  const [activeTab, setActiveTab] = useState<'annual' | 'quarterly' | 'monthly'>('monthly');
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);

  // Simulating data loading from AI agents
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // In a real implementation, this would use the AI agents to fetch and analyze data
        // const analysisAgent = new DataAnalysisAgent();
        // const recommendationAgent = new RecommendationAgent();
        // const practiceData = await dataRetrievalAgent.fetchDataForAnalysis('revenue metrics');
        // const analysis = await analysisAgent.analyzeKPI(practiceData);

        // Mock data - this would come from AI analysis
        const mockData: RevenueData = {
          annual: {
            actual: 1450000,
            goal: 1600000,
            performance: 90.6,
            previousYear: 1320000,
            yoyChange: 9.8
          },
          quarterly: {
            q1: { actual: 398000, goal: 380000, performance: 104.7 },
            q2: { actual: 377000, goal: 380000, performance: 99.2 },
            q3: { actual: 415000, goal: 420000, performance: 98.8 },
            q4: { actual: 260000, goal: 420000, performance: 61.9 }
          },
          ytd: {
            actual: 1190000,
            goal: 1180000,
            performance: 100.8
          },
          mtd: {
            actual: 87000,
            goal: 125000,
            performance: 69.6,
            projected: 110000
          },
          wtd: {
            actual: 23000,
            goal: 27500,
            performance: 83.6
          },
          marketing: {
            spend: 24000,
            revenuePercentage: 1.7,
            roi: 3.2,
            suggestedBudget: 29000
          }
        };

        setRevenueData(mockData);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // AI-recommended marketing budget calculation
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-primary mr-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back</span>
          </Link>
          <h1 className="text-2xl font-bold">Revenue Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white/50 rounded-xl p-6 h-40 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 overflow-auto">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-primary mr-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back</span>
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-navy to-purple text-transparent bg-clip-text">
            Revenue Dashboard
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Date Range</span>
          </button>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Annual summary card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">Annual Revenue</h2>
            <p className="text-gray-500 text-sm">Fiscal Year 2025</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Actual</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(revenueData?.annual.actual || 0)}
              </p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Goal</p>
              <p className="text-2xl font-bold text-gray-700">
                {formatCurrency(revenueData?.annual.goal || 0)}
              </p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">YoY Change</p>
              <p className={`text-2xl font-bold ${(revenueData?.annual.yoyChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(revenueData?.annual.yoyChange || 0) >= 0 ? '+' : ''}{revenueData?.annual.yoyChange || 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress toward annual goal</span>
            <span className="font-medium">{revenueData?.annual.performance || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary rounded-full h-2.5"
              style={{ width: `${Math.min(revenueData?.annual.performance || 0, 100)}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {formatCurrency((revenueData?.annual.goal || 0) - (revenueData?.annual.actual || 0))} remaining to reach annual goal
          </div>
        </div>
      </motion.div>

      {/* Time period metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="w-full">
          <StatsCard
            title="Year to Date"
            value={formatCurrency(revenueData?.ytd.actual || 0)}
            change={revenueData?.ytd.performance ? revenueData.ytd.performance - 100 : 0}
            icon="Activity"
            variant="primary"
          />
        </div>
        <div className="w-full">
          <StatsCard
            title="Month to Date"
            value={formatCurrency(revenueData?.mtd.actual || 0)}
            change={revenueData?.mtd.performance ? revenueData.mtd.performance - 100 : 0}
            icon="Calendar"
            variant="secondary"
          />
        </div>
        <div className="w-full">
          <StatsCard
            title="Week to Date"
            value={formatCurrency(revenueData?.wtd.actual || 0)}
            change={revenueData?.wtd.performance ? revenueData.wtd.performance - 100 : 0}
            icon="DollarSign"
            variant="accent1"
          />
        </div>
      </div>

      {/* Revenue trends section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-navy to-turquoise text-transparent bg-clip-text">
            Revenue Trends
          </h2>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              className={`px-4 py-1 text-sm rounded-md ${activeTab === 'monthly' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-1 text-sm rounded-md ${activeTab === 'quarterly' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('quarterly')}
            >
              Quarterly
            </button>
            <button
              className={`px-4 py-1 text-sm rounded-md ${activeTab === 'annual' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('annual')}
            >
              Annual
            </button>
          </div>
        </div>

        <ChartContainer title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Revenue vs Goal`}>
          {/* This would be replaced with a chart component that handles different periods */}
          <RevenueChart data={monthlyData} />
        </ChartContainer>
      </div>

      {/* Marketing metrics section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Marketing Budget</h3>
            <div className="flex items-center text-gray-500 text-sm">
              <DollarSign className="w-4 h-4 mr-1" />
              <span>{revenueData?.marketing.revenuePercentage || 0}% of revenue</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Current Spend</p>
              <p className="text-xl font-bold text-primary">
                {formatCurrency(revenueData?.marketing.spend || 0)}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">AI Suggested Budget</p>
              <p className="text-xl font-bold text-purple-600">
                {formatCurrency(revenueData?.marketing.suggestedBudget || 0)}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium mb-2">AI Recommendation</h4>
            <p className="text-sm text-gray-600">
              Based on your current performance and industry benchmarks, increasing marketing spend to {revenueData?.marketing.suggestedBudget ? ((revenueData.marketing.suggestedBudget / revenueData.annual.actual) * 100).toFixed(1) : 0}% of revenue could help close the annual revenue gap. Focus additional budget on Digital Ads and Referral Programs which show the highest ROI.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Marketing ROI by Channel</h3>
            <PieChart className="w-5 h-5 text-gray-500" />
          </div>

          <div className="space-y-3">
            {marketingSpendData.map((channel, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">{channel.category}</p>
                  <p className="text-xs text-gray-500">{formatCurrency(channel.spend)}</p>
                </div>
                <div className="w-24 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${(channel.roi / 5) * 100}%` }}
                  ></div>
                </div>
                <div className="w-12 text-right">
                  <p className="text-sm font-medium">{channel.roi}x</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-gray-500 italic">
            ROI measured as revenue generated per dollar spent
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RevenueDashboard;