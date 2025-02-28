import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { Card, Spinner, Button } from 'flowbite-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { 
  prepareAgentChartData,
  prepareHelpfulnessData,
  prepareUserRoleData
} from '../../utils/ai-feedback-utils';
import { useAIFeedbackAnalytics } from '../../hooks/useAIFeedbackAnalytics';
import { RefreshCw } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

/**
 * AI Feedback Analytics Component
 * Visualizes patterns and trends in AI feedback data
 */
const AIFeedbackAnalytics: React.FC = () => {
  const { user } = useAuthContext();
  const { 
    feedbackSummary, 
    loading, 
    error, 
    timeRange, 
    setTimeRange,
    refreshData
  } = useAIFeedbackAnalytics();

  // Check if user has access to this dashboard
  const hasAccess = 
    user?.role === 'admin' || 
    user?.role === 'expert' || 
    user?.role === 'staff';

  // If user doesn't have access
  if (!hasAccess) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
        <p className="mt-2">You don't have permission to view this dashboard.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">AI Feedback Analytics</h1>
        <Button 
          color="light" 
          onClick={refreshData} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh Data
        </Button>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <Spinner size="xl" />
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="p-4 mb-4 text-red-800 bg-red-100 rounded-lg">
          <p>{error}</p>
        </div>
      )}
      
      {/* Analytics Dashboard */}
      {!loading && !error && feedbackSummary && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="text-center">
              <h3 className="text-lg font-semibold">Total Feedback</h3>
              <p className="text-3xl font-bold text-blue-600">{feedbackSummary.total}</p>
            </Card>
            
            <Card className="text-center">
              <h3 className="text-lg font-semibold">Helpful Responses</h3>
              <p className="text-3xl font-bold text-green-600">
                {feedbackSummary.helpful} 
                <span className="text-sm text-gray-500 ml-2">
                  ({Math.round((feedbackSummary.helpful / feedbackSummary.total) * 100) || 0}%)
                </span>
              </p>
            </Card>
            
            <Card className="text-center">
              <h3 className="text-lg font-semibold">Unhelpful Responses</h3>
              <p className="text-3xl font-bold text-red-600">
                {feedbackSummary.unhelpful}
                <span className="text-sm text-gray-500 ml-2">
                  ({Math.round((feedbackSummary.unhelpful / feedbackSummary.total) * 100) || 0}%)
                </span>
              </p>
            </Card>
            
            <Card className="text-center">
              <h3 className="text-lg font-semibold">Validated Feedback</h3>
              <p className="text-3xl font-bold text-purple-600">
                {feedbackSummary.validated}
                <span className="text-sm text-gray-500 ml-2">
                  ({Math.round((feedbackSummary.validated / feedbackSummary.total) * 100) || 0}%)
                </span>
              </p>
            </Card>
          </div>
          
          {/* Time Range Selection */}
          <div className="flex justify-end mb-4">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setTimeRange('week')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  timeRange === 'week' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-4 py-2 text-sm font-medium ${
                  timeRange === 'month' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeRange('quarter')}
                className={`px-4 py-2 text-sm font-medium ${
                  timeRange === 'quarter' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Quarter
              </button>
              <button
                onClick={() => setTimeRange('year')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  timeRange === 'year' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Year
              </button>
            </div>
          </div>
          
          {/* Charts */}
          <Tabs>
            <TabList>
              <Tab>Agent Performance</Tab>
              <Tab>Feedback Distribution</Tab>
              <Tab>Trends Over Time</Tab>
            </TabList>
            
            <TabPanel>
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Agent Performance</h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepareAgentChartData(feedbackSummary)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="helpful" stackId="a" fill="#00C49F" name="Helpful" />
                      <Bar dataKey="unhelpful" stackId="a" fill="#FF8042" name="Unhelpful" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabPanel>
            
            <TabPanel>
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Feedback Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-80">
                    <h4 className="text-md font-medium mb-2 text-center">By Helpfulness</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareHelpfulnessData(feedbackSummary)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {prepareHelpfulnessData(feedbackSummary).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="h-80">
                    <h4 className="text-md font-medium mb-2 text-center">By User Role</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareUserRoleData(feedbackSummary)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {prepareUserRoleData(feedbackSummary).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>
            </TabPanel>
            
            <TabPanel>
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Feedback Trends Over Time</h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={feedbackSummary.recentTrends}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        angle={-45} 
                        textAnchor="end" 
                        height={80}
                        interval={timeRange === 'year' ? 30 : timeRange === 'quarter' ? 7 : 0}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="helpful" fill="#00C49F" name="Helpful" />
                      <Bar dataKey="unhelpful" fill="#FF8042" name="Unhelpful" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabPanel>
          </Tabs>
        </div>
      )}
      
      {!loading && !error && (!feedbackSummary || feedbackSummary.total === 0) && (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No feedback data available yet. Once users start providing feedback, analytics will be shown here.</p>
        </div>
      )}
    </div>
  );
};

export default AIFeedbackAnalytics;
