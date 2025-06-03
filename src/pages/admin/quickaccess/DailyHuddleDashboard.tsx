import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Icon } from '../../../components/ui/icon-strategy';
// Note: StatsCard is not used in this component but is available if needed

// Types to represent data that would come from API/database
interface DailyHuddleData {
  date: string;
  overallStats: {
    appointmentsTotal: number;
    appointmentsCompleted: number;
    productionGoal: number;
    productionCurrent: number;
    productionProjected: number;
    collectionGoal: number;
    collectionCurrent: number;
  };
  byDepartment: {
    name: string;
    appointmentsTotal: number;
    appointmentsCompleted: number;
    productionGoal: number;
    productionCurrent: number;
    productionRemaining: number;
    completionPercentage: number;
  }[];
  byProvider: {
    name: string;
    appointmentsTotal: number;
    appointmentsCompleted: number;
    appointmentsRemaining: number;
    productionGoal: number;
    productionCurrent: number;
    productionPerHour: number;
    scheduledHours: number;
  }[];
  upcomingAppointments: {
    time: string;
    patientName: string;
    provider: string;
    procedure: string;
    duration: number;
    preApproved: boolean;
    value: number;
  }[];
  huddle: {
    topic: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    assignedTo?: string;
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

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

const DailyHuddleDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DailyHuddleData | null>(null);

  // Simulating data loading from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // In a real implementation, this would fetch data from an API
        try {
          const response = await fetch('/api/dailyhuddle');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") === -1) {
            throw new Error("Response is not JSON");
          }
          const data = await response.json();
          setData(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching daily huddle data:', error);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching daily huddle data:', error);
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
          <h1 className="text-2xl font-bold">Daily Huddle Dashboard</h1>
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
            Daily Huddle Dashboard
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Icon name="Calendar" className="w-4 h-4 mr-2" />
            <span>{formatDate(data?.date || '')}</span>
          </button>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">
            <Icon name="Download" className="w-4 h-4 mr-2" />
            <span>Print Huddle Notes</span>
          </button>
        </div>
      </div>

      {/* Daily progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">Today's Progress</h2>
            <p className="text-gray-500 text-sm">
              {data?.overallStats.appointmentsCompleted || 0} of {data?.overallStats.appointmentsTotal || 0} appointments completed
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-1">
                <p className="text-gray-500 text-sm">Production</p>
                <p className="text-sm font-medium">{((data?.overallStats.productionCurrent || 0) / (data?.overallStats.productionGoal || 1) * 100).toFixed(0)}% of goal</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div
                  className="bg-primary rounded-full h-2.5"
                  style={{ width: `${Math.min(((data?.overallStats.productionCurrent || 0) / (data?.overallStats.productionGoal || 1) * 100), 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <p className="font-medium text-primary">{formatCurrency(data?.overallStats.productionCurrent || 0)}</p>
                <p className="text-gray-500">Goal: {formatCurrency(data?.overallStats.productionGoal || 0)}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-1">
                <p className="text-gray-500 text-sm">Collections</p>
                <p className="text-sm font-medium">{((data?.overallStats.collectionCurrent || 0) / (data?.overallStats.collectionGoal || 1) * 100).toFixed(0)}% of goal</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div
                  className="bg-green-500 rounded-full h-2.5"
                  style={{ width: `${Math.min(((data?.overallStats.collectionCurrent || 0) / (data?.overallStats.collectionGoal || 1) * 100), 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <p className="font-medium text-green-600">{formatCurrency(data?.overallStats.collectionCurrent || 0)}</p>
                <p className="text-gray-500">Goal: {formatCurrency(data?.overallStats.collectionGoal || 0)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <Icon name="Calendar" className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Today's projected production is {formatCurrency(data?.overallStats.productionProjected || 0)} ({((data?.overallStats.productionProjected || 0) / (data?.overallStats.productionGoal || 1) * 100).toFixed(0)}% of goal).
                {data?.overallStats.productionProjected && data?.overallStats.productionGoal && 
                  data.overallStats.productionProjected < data.overallStats.productionGoal && 
                  ` Additional ${formatCurrency(data.overallStats.productionGoal - data.overallStats.productionProjected)} needed to meet daily goal.`}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Department progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Department Progress</h3>
          <Icon name="Users" className="w-5 h-5 text-gray-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data?.byDepartment.map((dept, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{dept.name}</h4>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {dept.appointmentsCompleted} of {dept.appointmentsTotal} appts
                </span>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Production: {formatCurrency(dept.productionCurrent)}</span>
                  <span>Goal: {formatCurrency(dept.productionGoal)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2"
                    style={{ width: `${Math.min((dept.productionCurrent / dept.productionGoal) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-xs flex justify-between">
                <span className="text-gray-500">Completion: {dept.completionPercentage.toFixed(1)}%</span>
                <span className="font-medium">Remaining: {formatCurrency(dept.productionRemaining)}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Provider dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Provider Dashboard</h3>
          <Icon name="DollarSign" className="w-5 h-5 text-gray-500" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Provider</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Appointments</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Production</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Per Hour</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Scheduled</th>
              </tr>
            </thead>
            <tbody>
              {data?.byProvider.map((provider, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{provider.name}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    {provider.appointmentsCompleted}/{provider.appointmentsTotal}
                    <span className="text-xs text-gray-500 ml-1">
                      ({provider.appointmentsRemaining} left)
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex flex-col items-end">
                      <span>{formatCurrency(provider.productionCurrent)}</span>
                      <span className="text-xs text-gray-500">
                        of {formatCurrency(provider.productionGoal)} 
                        ({((provider.productionCurrent / provider.productionGoal) * 100).toFixed(0)}%)
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(provider.productionPerHour)}</td>
                  <td className="px-4 py-3 text-sm text-right">{provider.scheduledHours} hrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Upcoming appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Upcoming Appointments</h3>
          <Icon name="Clock" className="w-5 h-5 text-gray-500" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Time</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Patient</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Provider</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Procedure</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Duration</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Value</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.upcomingAppointments.map((appointment, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{appointment.time}</td>
                  <td className="px-4 py-3 text-sm font-medium">{appointment.patientName}</td>
                  <td className="px-4 py-3 text-sm">{appointment.provider}</td>
                  <td className="px-4 py-3 text-sm">{appointment.procedure}</td>
                  <td className="px-4 py-3 text-sm text-right">{appointment.duration} min</td>
                  <td className="px-4 py-3 text-sm font-medium text-right">{formatCurrency(appointment.value)}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    {appointment.preApproved ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Icon name="CheckCircle" className="w-3 h-3 mr-1" />
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Huddle notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Huddle Notes</h3>
        </div>

        <div className="space-y-4">
          {data?.huddle.map((item, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start">
                <div className={`w-2 h-2 mt-2 rounded-full ${
                  item.priority === 'high' ? 'bg-red-500' :
                  item.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium">{item.topic}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.priority === 'high' ? 'bg-red-100 text-red-800' :
                      item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  {item.assignedTo && (
                    <div className="mt-2 text-xs text-gray-500">
                      Assigned to: <span className="font-medium">{item.assignedTo}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <button className="px-4 py-2 bg-primary text-white text-sm rounded-md">
            Add Huddle Note
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DailyHuddleDashboard;
