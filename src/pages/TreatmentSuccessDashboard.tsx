import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/icon-strategy';
import StatsCard from '../components/dashboard/StatsCard';

// Types to represent data that would come from API/database
interface TreatmentData {
  overallAcceptance: {
    rate: number;
    previousPeriod: number;
    changePercentage: number;
    totalPresentations: number;
    totalAccepted: number;
  };
  unscheduledTreatment: {
    value: number;
    count: number;
    averageAge: number;
  };
  providerPerformance: {
    name: string;
    presentationCount: number;
    acceptanceRate: number;
    changePercentage: number;
    revenue: number;
  }[];
  treatmentTypes: {
    name: string;
    presentationCount: number;
    acceptanceRate: number;
    averageValue: number;
    revenue: number;
  }[];
}

// Sample data - would be replaced with real data from API




























// Helper functions
const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value);
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

const TreatmentSuccessDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TreatmentData | null>(null);

  // Fetching data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch('/api/treatmentSuccess');
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching treatment data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-primary mr-4">
            <Icon name="ArrowLeft" className="w-4 h-4 mr-1" />
            <span>Back</span>
          </Link>
          <h1 className="text-2xl font-bold">Treatment Success Dashboard</h1>
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
            <Icon name="ArrowLeft" className="w-4 h-4 mr-1" />
            <span>Back</span>
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-navy to-purple text-transparent bg-clip-text">
            Treatment Success Dashboard
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Icon name="Calendar" className="w-4 h-4 mr-2" />
            <span>Date Range</span>
          </button>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">
            <Icon name="Download" className="w-4 h-4 mr-2" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Overall acceptance rate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">Treatment Acceptance Rate</h2>
            <p className="text-gray-500 text-sm">Based on {formatNumber(data?.overallAcceptance.totalPresentations || 0)} treatment presentations</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Acceptance Rate</p>
              <p className="text-2xl font-bold text-primary">{data?.overallAcceptance.rate.toFixed(1) || 0}%</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Change</p>
              <p className={`text-2xl font-bold ${(data?.overallAcceptance.changePercentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(data?.overallAcceptance.changePercentage || 0) >= 0 ? '+' : ''}{data?.overallAcceptance.changePercentage || 0}%
              </p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Accepted Treatments</p>
              <p className="text-2xl font-bold text-accent1">{formatNumber(data?.overallAcceptance.totalAccepted || 0)}</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Acceptance rate</span>
            <span className="font-medium">{data?.overallAcceptance.rate.toFixed(1) || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary rounded-full h-2.5"
              style={{ width: `${data?.overallAcceptance.rate || 0}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {formatNumber((data?.overallAcceptance.totalPresentations || 0) - (data?.overallAcceptance.totalAccepted || 0))} treatments were not accepted
          </div>
        </div>
      </motion.div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Unscheduled Treatment Value"
          value={formatCurrency(data?.unscheduledTreatment.value || 0)}
          change={8.5}
          icon="DollarSign"
          variant="ocean"
        />
        <StatsCard
          title="Unscheduled Treatment Count"
          value={formatNumber(data?.unscheduledTreatment.count || 0)}
          change={-3.2}
          icon="FileText"
          variant="gold"
        />
        <StatsCard
          title="Avg. Days Outstanding"
          value={formatNumber(data?.unscheduledTreatment.averageAge || 0)}
          change={-5.1}
          icon="Clock"
          variant="tropical"
        />
      </div>

      {/* Provider performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Provider Performance</h3>
          <Icon name="UserCheck" className="w-5 h-5 text-gray-500" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Provider</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Presentations</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Acceptance Rate</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Change</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data?.providerPerformance.map((provider, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{provider.name}</td>
                  <td className="px-4 py-3 text-sm text-right">{formatNumber(provider.presentationCount)}</td>
                  <td className="px-4 py-3 text-sm text-right">{provider.acceptanceRate.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${provider.changePercentage >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {provider.changePercentage >= 0 ? '+' : ''}{provider.changePercentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-right">{formatCurrency(provider.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium mb-2">Performance Insights</h4>
          <p className="text-sm text-gray-600">
            Dr. Emma Wilson has the highest acceptance rate at 74.2%, showing a positive trend of +5.1%. 
            Dr. Sarah Chen might benefit from additional sales training to improve her acceptance rate which is currently 
            below average at 62.4% and trending downward (-1.8%).
          </p>
        </div>
      </motion.div>

      {/* Treatment types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Treatment Type Analysis</h3>
          <Icon name="BarChart3" className="w-5 h-5 text-gray-500" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Treatment Type</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Presentations</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Acceptance Rate</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Avg. Value</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data?.treatmentTypes.map((treatment, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{treatment.name}</td>
                  <td className="px-4 py-3 text-sm text-right">{formatNumber(treatment.presentationCount)}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex items-center justify-end">
                      <span className="mr-2">{treatment.acceptanceRate.toFixed(1)}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-primary rounded-full h-1.5" 
                          style={{ width: `${treatment.acceptanceRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(treatment.averageValue)}</td>
                  <td className="px-4 py-3 text-sm font-medium text-right">{formatCurrency(treatment.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Opportunity Analysis</h4>
            <p className="text-sm text-gray-600">
              While Implants have the lowest acceptance rate, they represent a significant revenue
              opportunity due to their high average value. A 10% increase in Implant acceptance rate would
              generate approximately {formatCurrency(0)} in additional revenue.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Recommendation</h4>
            <p className="text-sm text-gray-600">
              Focus on improving acceptance rates for high-value treatments like Implants and Cosmetic procedures. 
              Consider implementing a payment plan option to make these treatments more accessible, 
              potentially increasing acceptance rates by 15-20%.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Unscheduled treatment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Unscheduled Treatment Value</h3>
          <Icon name="DollarSign" className="w-5 h-5 text-gray-500" />
        </div>

        <div className="text-center mb-6">
          <p className="text-3xl font-bold text-primary">{formatCurrency(data?.unscheduledTreatment.value || 0)}</p>
          <p className="text-sm text-gray-500">potential revenue from {formatNumber(data?.unscheduledTreatment.count || 0)} unscheduled treatments</p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Icon name="TrendingUp" className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                On average, treatments have been unscheduled for {data?.unscheduledTreatment.averageAge || 0} days. Treatments older than 90 days have only a 35% conversion rate.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3">AI-Recommended Actions</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-500">✓</div>
                <span className="ml-2">Launch targeted follow-up campaign for high-value unscheduled treatments</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-500">✓</div>
                <span className="ml-2">Offer financing options for treatments over $1,000</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-500">✓</div>
                <span className="ml-2">Implement automatic recalls for treatments unscheduled {'>'}  60 days</span>
              </li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-2">Expected Outcome</h4>
            <p className="text-sm text-gray-700 mb-4">
              Implementing these recommendations could convert 25-30% of unscheduled treatments, resulting in
              {' '}{formatCurrency((data?.unscheduledTreatment.value || 0) * 0.25)} - {formatCurrency((data?.unscheduledTreatment.value || 0) * 0.3)} in additional revenue.
            </p>
            <button className="w-full bg-primary text-white text-sm rounded-md py-2">
              Implement Recommendations
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TreatmentSuccessDashboard;
