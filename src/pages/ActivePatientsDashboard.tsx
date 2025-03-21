import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, Users, PieChart, BarChart3 } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';

// Types to represent data that would come from API/database
interface PatientData {
  activePatients: {
    total: number;
    newLast30Days: number;
    changePercentage: number;
  };
  demographics: {
    ageGroups: { label: string; value: number; color: string }[];
    gender: { label: string; value: number; color: string }[];
    insuranceTypes: { label: string; value: number; color: string }[];
  };
  recalls: {
    due: number;
    upcoming30Days: number;
    overdue: number;
    completed30Days: number;
  };
  patientTypes: {
    regular: number;
    periodontal: number;
    cosmetic: number;
    pediatric: number;
    orthodontic: number;
  };
  procedureRevenue: {
    procedure: string;
    count: number;
    revenue: number;
    changePercentage: number;
  }[];
}

// Sample data - would be replaced with real data from API

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

const ActivePatientsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState<PatientData | null>(null);

  // Simulating data loading from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // In a real implementation, this would fetch data from an API
        // const response = await fetch('/api/patients/dashboard');
        // const data = await response.json();

        // Using sample data for now
        try {
          const response = await fetch('/api/patients/dashboard');
          const data = await response.json();
          setPatientData(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching patient data:', error);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
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
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back</span>
          </Link>
          <h1 className="text-2xl font-bold">Active Patients Dashboard</h1>
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
            Active Patients Dashboard
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

      {/* Active patients summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">Patient Overview</h2>
            <p className="text-gray-500 text-sm">Current active patient base</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Total Active</p>
              <p className="text-2xl font-bold text-primary">
                {formatNumber(patientData?.activePatients.total || 0)}
              </p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">New (30 days)</p>
              <p className="text-2xl font-bold text-accent1">
                {formatNumber(patientData?.activePatients.newLast30Days || 0)}
              </p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Growth Rate</p>
              <p className={`text-2xl font-bold ${(patientData?.activePatients.changePercentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(patientData?.activePatients.changePercentage || 0) >= 0 ? '+' : ''}{patientData?.activePatients.changePercentage || 0}%
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Patient metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Recalls Due"
          value={formatNumber(patientData?.recalls.due || 0)}
          change={10.2}
          icon="Bell"
          variant="ocean"
        />
        <StatsCard
          title="Upcoming Recalls (30 days)"
          value={formatNumber(patientData?.recalls.upcoming30Days || 0)}
          change={5.8}
          icon="Calendar"
          variant="gold"
        />
        <StatsCard
          title="Overdue Recalls"
          value={formatNumber(patientData?.recalls.overdue || 0)}
          change={-12.4}
          icon="AlertCircle"
          variant="tropical"
        />
      </div>

      {/* Demographics section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">Age Demographics</h3>
            <PieChart className="w-5 h-5 text-gray-500" />
          </div>

          <div className="space-y-4">
            {patientData?.demographics.ageGroups.map((group, index) => (
              <div key={index} className="flex items-center">
                <div className="w-16 text-sm">{group.label}</div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(group.value / patientData.activePatients.total) * 100}%`,
                        backgroundColor: group.color
                      }}
                    ></div>
                  </div>
                </div>
                <div className="w-20 text-right text-sm font-medium">
                  {formatNumber(group.value)}
                </div>
                <div className="w-16 text-right text-xs text-gray-500">
                  {((group.value / patientData.activePatients.total) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">Insurance Distribution</h3>
            <PieChart className="w-5 h-5 text-gray-500" />
          </div>

          <div className="space-y-4">
            {patientData?.demographics.insuranceTypes.map((type, index) => (
              <div key={index} className="flex items-center">
                <div className="w-20 text-sm">{type.label}</div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(type.value / patientData.activePatients.total) * 100}%`,
                        backgroundColor: type.color
                      }}
                    ></div>
                  </div>
                </div>
                <div className="w-20 text-right text-sm font-medium">
                  {formatNumber(type.value)}
                </div>
                <div className="w-16 text-right text-xs text-gray-500">
                  {((type.value / patientData.activePatients.total) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Patient types and procedures */}
      <div className="grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">Procedure Revenue</h3>
            <BarChart3 className="w-5 h-5 text-gray-500" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Procedure</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Count</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Revenue</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Change</th>
                </tr>
              </thead>
              <tbody>
                {patientData?.procedureRevenue.map((proc, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{proc.procedure}</td>
                    <td className="px-4 py-3 text-sm text-right">{formatNumber(proc.count)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-right">{formatCurrency(proc.revenue)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${proc.changePercentage >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {proc.changePercentage >= 0 ? '+' : ''}{proc.changePercentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium mb-2">AI Recommendation</h4>
            <p className="text-sm text-gray-600">
              Implants and Orthodontics show the highest growth and revenue per procedure. Consider allocating more chair time for these procedures and implementing a targeted marketing campaign to attract more patients seeking these high-value treatments.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Patient type distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Patient Type Distribution</h3>
          <Users className="w-5 h-5 text-gray-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(patientData?.patientTypes || {}).map(([key, value], index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500 text-sm mb-1 capitalize">{key}</p>
              <p className="text-xl font-bold text-primary">{formatNumber(value)}</p>
              <p className="text-xs text-gray-500">
                {((value / (patientData?.activePatients.total || 1)) * 100).toFixed(1)}% of patients
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium mb-2">Recall Status</h4>
          <div className="flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-l-full" style={{ width: `${(patientData?.recalls.completed30Days || 0) / ((patientData?.recalls.due || 0) + (patientData?.recalls.upcoming30Days || 0) + (patientData?.recalls.overdue || 0) + (patientData?.recalls.completed30Days || 0)) * 100}%` }}></div>
            </div>
            <div className="ml-3 text-sm text-gray-600">
              {patientData?.recalls.completed30Days} completed of {(patientData?.recalls.due || 0) + (patientData?.recalls.upcoming30Days || 0) + (patientData?.recalls.overdue || 0) + (patientData?.recalls.completed30Days || 0)} total recalls
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ActivePatientsDashboard;
