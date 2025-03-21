import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/icon-strategy';
import StatsCard from '../components/dashboard/StatsCard';

// Types to represent data that would come from API
interface MonthlyReportData {
  currentMonth: string;
  overview: {
    revenue: number;
    goal: number;
    lastMonth: number;
    changePercentage: number;
    projectedEnd: number;
    remainingDays: number;
  };
  collections: {
    total: number;
    goal: number;
    pending: number;
    overdue: number;
  };
  categories: {
    name: string;
    revenue: number;
    appointments: number;
    changePercentage: number;
  }[];
  dailyRevenue: {
    day: string;
    revenue: number;
    goal: number;
  }[];
  campaigns: {
    name: string;
    type: string;
    targetAudience: string;
    estimatedRevenue: number;
    roi: number;
  }[];
}


// Helper functions
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value);
};

const MonthlyRevenueReport = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MonthlyReportData | null>(null);

  // Fetching data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch('/api/monthlyRevenueReport');
        const data = await response.json();
        setData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching monthly report data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate completion percentage for the month
  const calculateCompletionPercentage = () => {
    if (!data) return 0;
    return Math.min((data.overview.revenue / data.overview.goal) * 100, 100);
  };

  // Calculate percentage of month passed
  const calculateMonthProgressPercentage = () => {
    const daysInMonth = 28; // For February 2025
    const daysPassed = 26;
    return (daysPassed / daysInMonth) * 100;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-primary mr-4">
            <Icon name="ArrowLeft" className="w-4 h-4 mr-1" />
            <span>Back</span>
          </Link>
          <h1 className="text-2xl font-bold">Monthly Revenue Report</h1>
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
            Monthly Revenue Report
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Icon name="Calendar" className="w-4 h-4 mr-2" />
            <span>{data?.currentMonth}</span>
          </button>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">
            <Icon name="Download" className="w-4 h-4 mr-2" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Monthly overview card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">Monthly Revenue Overview</h2>
            <p className="text-gray-500 text-sm">{data?.currentMonth} • {data?.overview.remainingDays} days remaining</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Current</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(data?.overview.revenue || 0)}
              </p>
              <p className="text-xs text-gray-500">
                {((data?.overview.revenue || 0) / (data?.overview.goal || 1) * 100).toFixed(1)}% of goal
              </p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Goal</p>
              <p className="text-2xl font-bold text-gray-700">
                {formatCurrency(data?.overview.goal || 0)}
              </p>
              <p className="text-xs text-gray-500">
                {formatCurrency((data?.overview.goal || 0) - (data?.overview.revenue || 0))} remaining
              </p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">vs. Last Month</p>
              <p className={`text-2xl font-bold ${(data?.overview.changePercentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(data?.overview.changePercentage || 0) >= 0 ? '+' : ''}{data?.overview.changePercentage || 0}%
              </p>
              <p className="text-xs text-gray-500">
                {formatCurrency(data?.overview.lastMonth || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress toward monthly goal</span>
            <span className="font-medium">{calculateCompletionPercentage().toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 relative">
            <div
              className="bg-primary rounded-l-full h-4"
              style={{ width: `${calculateCompletionPercentage()}%` }}
            ></div>
            <div 
              className="absolute top-0 h-4 border-l-2 border-dashed border-yellow-500" 
              style={{ left: `${calculateMonthProgressPercentage()}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-gray-500">
              Month is {calculateMonthProgressPercentage().toFixed(0)}% complete
            </span>
            <span className="text-purple-600 font-medium">
              Projected: {formatCurrency(data?.overview.projectedEnd || 0)} 
              ({((data?.overview.projectedEnd || 0) / (data?.overview.goal || 1) * 100).toFixed(1)}% of goal)
            </span>
          </div>
        </div>
      </motion.div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Monthly Revenue"
          value={formatCurrency(data?.overview.revenue || 0)}
          change={data?.overview.changePercentage || 0}
          icon="DollarSign"
          variant="ocean"
        />
        <StatsCard
          title="Total Appointments"
          value={formatNumber(data?.categories.reduce((sum, cat) => sum + cat.appointments, 0) || 0)}
          change={0}
          icon="Calendar"
          variant="gold"
        />
        <StatsCard
          title="Average Revenue Per Appointment"
          value={formatCurrency(
            (data?.overview.revenue || 0) /
            (data?.categories.reduce((sum, cat) => sum + cat.appointments, 0) || 1)
          )}
          icon="BarChart2"
          variant="tropical"
        />
      </div>

      {/* Revenue by category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Revenue by Category</h3>
          <Icon name="BarChart2" className="w-5 h-5 text-gray-500" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Category</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Revenue</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Appointments</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Avg. per Appt</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Change</th>
              </tr>
            </thead>
            <tbody>
              {data?.categories.map((category, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{category.name}</td>
                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(category.revenue)}</td>
                  <td className="px-4 py-3 text-sm text-right">{formatNumber(category.appointments)}</td>
                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(category.revenue / category.appointments)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${category.changePercentage >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {category.changePercentage >= 0 ? '+' : ''}{category.changePercentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default MonthlyRevenueReport;
