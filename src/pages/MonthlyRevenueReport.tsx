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

// Sample data - would be replaced with real data from API
const sampleData: MonthlyReportData = {
  currentMonth: "February 2025",
  overview: {
    revenue: 146000,
    goal: 185000,
    lastMonth: 138500,
    changePercentage: 5.4,
    projectedEnd: 172000,
    remainingDays: 2,
  },
  collections: {
    total: 128500,
    goal: 170000,
    pending: 24000,
    overdue: 14500,
  },
  categories: [
    { name: "Preventive", revenue: 42800, appointments: 245, changePercentage: 3.2 },
    { name: "Restorative", revenue: 56700, appointments: 162, changePercentage: 8.5 },
    { name: "Cosmetic", revenue: 28500, appointments: 48, changePercentage: 12.4 },
    { name: "Orthodontics", revenue: 18000, appointments: 15, changePercentage: -2.1 },
  ],
  dailyRevenue: [
    { day: "Feb 1", revenue: 6200, goal: 6500 },
    { day: "Feb 2", revenue: 5100, goal: 6500 },
    { day: "Feb 3", revenue: 0, goal: 0 }, // Weekend
    { day: "Feb 4", revenue: 0, goal: 0 }, // Weekend
    { day: "Feb 5", revenue: 7300, goal: 6500 },
    { day: "Feb 6", revenue: 6800, goal: 6500 },
    { day: "Feb 7", revenue: 7100, goal: 6500 },
    { day: "Feb 8", revenue: 6500, goal: 6500 },
    { day: "Feb 9", revenue: 5900, goal: 6500 },
    { day: "Feb 10", revenue: 0, goal: 0 }, // Weekend
    { day: "Feb 11", revenue: 0, goal: 0 }, // Weekend
    { day: "Feb 12", revenue: 7600, goal: 6500 },
    { day: "Feb 13", revenue: 6800, goal: 6500 },
    { day: "Feb 14", revenue: 4900, goal: 6500 },
    { day: "Feb 15", revenue: 7200, goal: 6500 },
    { day: "Feb 16", revenue: 6300, goal: 6500 },
    { day: "Feb 17", revenue: 0, goal: 0 }, // Weekend
    { day: "Feb 18", revenue: 0, goal: 0 }, // Weekend
    { day: "Feb 19", revenue: 8100, goal: 6500 },
    { day: "Feb 20", revenue: 7400, goal: 6500 },
    { day: "Feb 21", revenue: 6900, goal: 6500 },
    { day: "Feb 22", revenue: 7200, goal: 6500 },
    { day: "Feb 23", revenue: 6800, goal: 6500 },
    { day: "Feb 24", revenue: 0, goal: 0 }, // Weekend
    { day: "Feb 25", revenue: 0, goal: 0 }, // Weekend
    { day: "Feb 26", revenue: 4200, goal: 6500 }, // Current day (partial)
  ],
  campaigns: [
    {
      name: "February Patient Reactivation",
      type: "Email + SMS",
      targetAudience: "Inactive patients (6+ months)",
      estimatedRevenue: 12500,
      roi: 4.2,
    },
    {
      name: "Valentine's Day Whitening Special",
      type: "Social Media + Email",
      targetAudience: "All active patients",
      estimatedRevenue: 8700,
      roi: 3.5,
    },
    {
      name: "Winter Invisalign Promotion",
      type: "Targeted SMS",
      targetAudience: "Patients with orthodontic treatment plans",
      estimatedRevenue: 22000,
      roi: 5.8,
    },
  ],
};

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

  // Simulating data loading from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // In a real implementation, this would fetch data from an API
        // Using sample data for now
        setTimeout(() => {
          setData(sampleData);
          setLoading(false);
        }, 1000);
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
          variant="primary"
        />
        <StatsCard
          title="Total Appointments"
          value={formatNumber(data?.categories.reduce((sum, cat) => sum + cat.appointments, 0) || 0)}
          change={0}
          icon="Calendar"
          variant="secondary"
        />
        <StatsCard
          title="Average Revenue Per Appointment"
          value={formatCurrency(
            (data?.overview.revenue || 0) / 
            (data?.categories.reduce((sum, cat) => sum + cat.appointments, 0) || 1)
          )}
          icon="BarChart2"
          variant="accent1"
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