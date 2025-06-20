import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { DateRangePicker } from './filters/DateRangePicker';
import { FilterDialog } from './filters/FilterDialog';
import { DetailsDialog } from './filters/DetailsDialog';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCommunication } from '../../../../../contexts/CommunicationContext';
import { format, parseISO, startOfDay, endOfDay, isSameDay, subDays } from 'date-fns';
import { RetellAnalyticsParams, RetellCall } from '../../../../../services/retellService';

export const VoiceAnalytics = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getCallAnalytics, callAnalytics, retellLoading, retellError } = useCommunication();

  const handleExport = (chartName: string, data: any[]) => {
    if (!data || data.length === 0) {
      console.warn('No data available to export');
      return;
    }

    const csvContent = [
      // Add headers
      Object.keys(data[0]).join(','),
      // Add data rows
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chartName}-${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  
  // Process time of day data from call analytics
  const processTimeOfDayData = () => {
    if (!callAnalytics || !callAnalytics.calls || callAnalytics.calls.length === 0) {
      return timeOfDayData; // Return default data if no calls
    }
    
    // Group calls by hour of day
    const callsByHour = callAnalytics.calls.reduce((acc, call) => {
      // Parse the created_at timestamp
      const callDate = parseISO(call.created_at);
      const hour = format(callDate, 'ha'); // Format as '1am', '2pm', etc.
      
      if (!acc[hour]) {
        acc[hour] = { time: hour, calls: 0 };
      }
      
      acc[hour].calls++;
      return acc;
    }, {} as Record<string, { time: string; calls: number }>);
    
    return Object.values(callsByHour);
  };
  
  // Process campaign performance data
  const processCampaignPerformanceData = () => {
    if (!callAnalytics || !callAnalytics.calls || callAnalytics.calls.length === 0) {
      return campaignPerformanceData; // Return default data if no calls
    }
    
    // In a real implementation, we would extract campaign data from the calls
    // For now, we'll return the default data
    return campaignPerformanceData;
  };

  // Fetch call analytics when component mounts or date range changes
  useEffect(() => {
    const fetchCallAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Prepare analytics parameters based on filters and date range
        const params: RetellAnalyticsParams = {};
        
        // Apply date range if specified
        if (dateRange.start) {
          params.startDate = dateRange.start;
        }
        
        if (dateRange.end) {
          params.endDate = dateRange.end;
        }
        
        // Apply status filters if specified
        if (filters.status && filters.status.length > 0) {
          // Convert UI status names to API status values
          const statusMap: Record<string, string> = {
            'Completed': 'completed',
            'Failed': 'failed',
            'Answered': 'in-progress'
          };
          
          // Use the first status for the API (RetellAI API may not support multiple status filters)
          const apiStatus = statusMap[filters.status[0]];
          if (apiStatus) {
            params.status = apiStatus;
          }
        }
        
        // Set a reasonable limit
        params.limit = 100;
        
        await getCallAnalytics(params);
      } catch (err) {
        console.error('Error fetching call analytics:', err);
        setError('Failed to fetch call analytics. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCallAnalytics();
  }, [dateRange, filters, getCallAnalytics]);
  
  // Process call analytics data for charts
  const processCallTrendData = () => {
    if (!callAnalytics || !callAnalytics.calls || callAnalytics.calls.length === 0) {
      return defaultCallTrendData;
    }
    
    // Group calls by day and count statuses
    const callsByDay = callAnalytics.calls.reduce((acc, call) => {
      // Parse the created_at timestamp to a Date object
      const callDate = parseISO(call.created_at);
      const day = format(callDate, 'EEE'); // Get day abbreviation (Mon, Tue, etc.)
      
      if (!acc[day]) {
        acc[day] = { date: day, completed: 0, failed: 0, answered: 0 };
      }
      
      if (call.status === 'completed') acc[day].completed++;
      else if (call.status === 'failed') acc[day].failed++;
      else if (call.status === 'in-progress') acc[day].answered++;
      
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(callsByDay);
  };
  
  // Process outcome data
  const processCallOutcomeData = () => {
    if (!callAnalytics || !callAnalytics.calls || callAnalytics.calls.length === 0) {
      return defaultCallOutcomeData;
    }
    
    // Count calls by outcome
    const outcomes = callAnalytics.calls.reduce((acc, call) => {
      // Extract outcome from metadata if available, otherwise use status
      const outcome = call.metadata?.outcome || call.status || 'Unknown';
      acc[outcome] = (acc[outcome] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Map to chart format with colors
    const colors = ['#4BC5BD', '#6B4C9A', '#C5A572', '#1B2B5B'];
    return Object.entries(outcomes).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  };
  
  // Default sample data when no API data is available
  const defaultCallTrendData = [
    { date: 'Mon', completed: 45, failed: 5, answered: 35 },
    { date: 'Tue', completed: 52, failed: 3, answered: 42 },
    { date: 'Wed', completed: 48, failed: 7, answered: 38 },
    { date: 'Thu', completed: 61, failed: 4, answered: 51 },
    { date: 'Fri', completed: 55, failed: 6, answered: 45 },
    { date: 'Sat', completed: 38, failed: 2, answered: 32 },
    { date: 'Sun', completed: 42, failed: 4, answered: 35 }
  ];

  const defaultCallOutcomeData = [
    { name: 'Appointment Scheduled', value: 35, color: '#4BC5BD' },
    { name: 'Call Back Later', value: 25, color: '#6B4C9A' },
    { name: 'Not Interested', value: 15, color: '#C5A572' },
    { name: 'Voicemail', value: 25, color: '#1B2B5B' }
  ];

  const timeOfDayData = [
    { time: '8am', calls: 25 },
    { time: '10am', calls: 45 },
    { time: '12pm', calls: 35 },
    { time: '2pm', calls: 50 },
    { time: '4pm', calls: 40 },
    { time: '6pm', calls: 30 }
  ];

  const campaignPerformanceData = [
    { name: 'Recall', success: 85, response: 65 },
    { name: 'Reactivation', success: 75, response: 55 },
    { name: 'Appointment', success: 90, response: 70 },
    { name: 'Treatment', success: 80, response: 60 },
    { name: 'Event', success: 70, response: 50 }
  ];

  // Calculate the call trend data once to avoid recalculations
  const callTrendData = processCallTrendData();
  const callOutcomeData = processCallOutcomeData();
  const timeData = processTimeOfDayData();
  const campaignData = processCampaignPerformanceData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Loading and error states */}
      {loading && (
        <div className="lg:col-span-2 p-4 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center">
          <Icons.Loader className="w-6 h-6 animate-spin text-primary mr-2" />
          <span>Loading call analytics data...</span>
        </div>
      )}
      
      {error && (
        <div className="lg:col-span-2 p-4 bg-white rounded-xl shadow-lg border border-red-200 flex items-center">
          <Icons.AlertCircle className="w-6 h-6 text-red-500 mr-2" />
          <span className="text-red-500">{error}</span>
        </div>
      )}
      
      {retellError && (
        <div className="lg:col-span-2 p-4 bg-white rounded-xl shadow-lg border border-red-200 flex items-center">
          <Icons.AlertCircle className="w-6 h-6 text-red-500 mr-2" />
          <span className="text-red-500">{retellError}</span>
        </div>
      )}
      {/* Call Volume Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Call Volume Trends</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDatePicker(true)}
            >
              <Icons.Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (callTrendData && callTrendData.length > 0) {
                  handleExport('call-volume', callTrendData);
                } else {
                  alert('No call volume data available to export');
                }
              }}
              disabled={loading || !callTrendData || callTrendData.length === 0}
            >
              <Icons.Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        <div className="h-80">
          {retellLoading ? (
            <div className="h-full flex items-center justify-center">
              <Icons.Loader className="w-6 h-6 animate-spin text-primary mr-2" />
              <span>Loading data...</span>
            </div>
          ) : callTrendData.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <Icons.Info className="w-6 h-6 text-gray-400 mr-2" />
              <span className="text-gray-500">No call data available</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={callTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="completed" stackId="1" stroke="#4BC5BD" fill="#4BC5BD" />
                <Area type="monotone" dataKey="failed" stackId="1" stroke="#C5A572" fill="#C5A572" />
                <Area type="monotone" dataKey="answered" stackId="1" stroke="#6B4C9A" fill="#6B4C9A" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>

      {/* Call Outcomes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Call Outcomes</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilter(true)}
            >
              <Icons.Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (callOutcomeData && callOutcomeData.length > 0) {
                  handleExport('call-outcomes', callOutcomeData);
                } else {
                  alert('No call outcome data available to export');
                }
              }}
              disabled={loading || !callOutcomeData || callOutcomeData.length === 0}
            >
              <Icons.Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        <div className="h-80">
          {retellLoading ? (
            <div className="h-full flex items-center justify-center">
              <Icons.Loader className="w-6 h-6 animate-spin text-primary mr-2" />
              <span>Loading data...</span>
            </div>
          ) : callOutcomeData.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <Icons.Info className="w-6 h-6 text-gray-400 mr-2" />
              <span className="text-gray-500">No outcome data available</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={callOutcomeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {callOutcomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>

      {/* Best Time to Call */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Best Time to Call</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              if (timeData && timeData.length > 0) {
                handleExport('best-time', timeData);
              } else {
                alert('No time data available to export');
              }
            }}
            disabled={loading || !timeData || timeData.length === 0}
          >
            <Icons.Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
        <div className="h-80">
          {retellLoading ? (
            <div className="h-full flex items-center justify-center">
              <Icons.Loader className="w-6 h-6 animate-spin text-primary mr-2" />
              <span>Loading data...</span>
            </div>
          ) : timeData.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <Icons.Info className="w-6 h-6 text-gray-400 mr-2" />
              <span className="text-gray-500">No time data available</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" fill="#1B2B5B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>

      {/* Campaign Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Campaign Performance</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDetails(true)}
              disabled={loading || !campaignData || campaignData.length === 0}
            >
              <Icons.BarChart2 className="w-4 h-4 mr-2" />
              Details
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (campaignData && campaignData.length > 0) {
                  handleExport('campaign-performance', campaignData);
                } else {
                  alert('No campaign data available to export');
                }
              }}
              disabled={loading || !campaignData || campaignData.length === 0}
            >
              <Icons.Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        <div className="h-80">
          {retellLoading ? (
            <div className="h-full flex items-center justify-center">
              <Icons.Loader className="w-6 h-6 animate-spin text-primary mr-2" />
              <span>Loading data...</span>
            </div>
          ) : campaignData.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <Icons.Info className="w-6 h-6 text-gray-400 mr-2" />
              <span className="text-gray-500">No campaign data available</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="success" stroke="#4BC5BD" strokeWidth={2} />
                <Line type="monotone" dataKey="response" stroke="#6B4C9A" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>

      {/* Dialogs */}
      <DateRangePicker
        open={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={(range) => {
          setDateRange(range);
          // Log the selected date range for debugging
          console.log('Date range selected:', range);
        }}
      />
      
      <FilterDialog
        open={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={(newFilters) => {
          setFilters(newFilters);
          // Log the applied filters for debugging
          console.log('Filters applied:', newFilters);
        }}
      />
      
      <DetailsDialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        data={campaignData}
      />
    </div>
  );
};