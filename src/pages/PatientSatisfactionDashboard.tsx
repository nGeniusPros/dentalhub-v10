import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, Star, MessageSquare } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';

// Types to represent data that would come from API/database
interface SatisfactionData {
  overallRating: number;
  totalReviews: number;
  changePercentage: number;
  reviewsByPlatform: {
    platform: string;
    count: number;
    averageRating: number;
    trend: number;
  }[];
  recentSentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  recentFeedback: {
    patientName: string;
    rating: number;
    comment: string;
    date: string;
    platform: string;
    responded: boolean;
  }[];
  campaignRecommendations: {
    title: string;
    description: string;
    impact: string;
  }[];
}

// Sample data - would be replaced with real data from API
const sampleData: SatisfactionData = {
  overallRating: 4.7,
  totalReviews: 328,
  changePercentage: 5.2,
  reviewsByPlatform: [
    { platform: 'Google', count: 187, averageRating: 4.8, trend: 3.2 },
    { platform: 'Yelp', count: 73, averageRating: 4.5, trend: 1.8 },
    { platform: 'Facebook', count: 42, averageRating: 4.9, trend: 7.5 },
    { platform: 'Healthgrades', count: 26, averageRating: 4.6, trend: 5.0 },
  ],
  recentSentiment: {
    positive: 82,
    neutral: 12,
    negative: 6,
  },
  recentFeedback: [
    {
      patientName: 'Sarah Johnson',
      rating: 5,
      comment: 'Dr. Miller and the entire staff were amazing! Very thorough cleaning and they took the time to explain everything.',
      date: '2025-02-21',
      platform: 'Google',
      responded: true,
    },
    {
      patientName: 'Michael Chen',
      rating: 4,
      comment: 'Great experience overall. The only issue was waiting a bit longer than expected, but the care was excellent.',
      date: '2025-02-18',
      platform: 'Yelp',
      responded: false,
    },
    {
      patientName: 'Jessica Williams',
      rating: 5,
      comment: 'Best dental practice I\'ve ever been to! The staff is incredibly friendly and they use state-of-the-art technology.',
      date: '2025-02-15',
      platform: 'Facebook',
      responded: true,
    },
  ],
  campaignRecommendations: [
    {
      title: 'Launch post-appointment voice feedback campaign',
      description: 'Use automated voice calls to collect feedback from patients 24-48 hours after their appointment.',
      impact: 'Could generate 15-20 new positive reviews',
    },
    {
      title: 'Address wait time concerns',
      description: 'Recent feedback shows increased mentions of wait times. Consider reviewing scheduling practices.',
      impact: 'Could improve satisfaction scores by 0.3 points',
    },
    {
      title: 'Respond to outstanding reviews',
      description: '7 recent reviews across platforms have no response. Personalized responses could improve engagement.',
      impact: 'Demonstrates responsiveness to all patients',
    },
  ],
};

// Helper functions
const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value);
};

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      {halfStar && <Star className="w-4 h-4 text-yellow-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      ))}
    </div>
  );
};

const PatientSatisfactionDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SatisfactionData | null>(null);

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
        console.error('Error fetching satisfaction data:', error);
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
          <h1 className="text-2xl font-bold">Patient Satisfaction Dashboard</h1>
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
            Patient Satisfaction Dashboard
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

      {/* Overall satisfaction rating */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">Overall Satisfaction Rating</h2>
            <p className="text-gray-500 text-sm">Based on {formatNumber(data?.totalReviews || 0)} total reviews</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Average Rating</p>
              <div className="flex justify-center mb-1">
                {renderStars(data?.overallRating || 0)}
              </div>
              <p className="text-2xl font-bold text-primary">{data?.overallRating.toFixed(1) || 0}</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Total Reviews</p>
              <p className="text-2xl font-bold text-accent1">{formatNumber(data?.totalReviews || 0)}</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Change</p>
              <p className={`text-2xl font-bold ${(data?.changePercentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(data?.changePercentage || 0) >= 0 ? '+' : ''}{data?.changePercentage || 0}%
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Platform metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {data?.reviewsByPlatform.map((platform, index) => (
          <StatsCard
            key={index}
            title={`${platform.platform} Reviews`}
            value={platform.averageRating.toFixed(1)}
            change={platform.trend}
            icon="Star"
            variant={index === 0 ? "primary" : index === 1 ? "secondary" : index === 2 ? "accent1" : "accent2"}
          />
        ))}
      </div>

      {/* Sentiment analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light"
      >
        <h3 className="text-lg font-medium mb-4">Recent Sentiment Analysis</h3>
        
        <div className="flex items-center mb-6">
          <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
            <div className="flex h-full">
              <div 
                className="bg-green-500 h-full" 
                style={{ width: `${(data?.recentSentiment.positive || 0) / ((data?.recentSentiment.positive || 0) + (data?.recentSentiment.neutral || 0) + (data?.recentSentiment.negative || 0)) * 100}%` }}
              ></div>
              <div 
                className="bg-gray-400 h-full" 
                style={{ width: `${(data?.recentSentiment.neutral || 0) / ((data?.recentSentiment.positive || 0) + (data?.recentSentiment.neutral || 0) + (data?.recentSentiment.negative || 0)) * 100}%` }}
              ></div>
              <div 
                className="bg-red-500 h-full" 
                style={{ width: `${(data?.recentSentiment.negative || 0) / ((data?.recentSentiment.positive || 0) + (data?.recentSentiment.neutral || 0) + (data?.recentSentiment.negative || 0)) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="ml-6 flex gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm">{data?.recentSentiment.positive || 0}% Positive</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
              <span className="text-sm">{data?.recentSentiment.neutral || 0}% Neutral</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm">{data?.recentSentiment.negative || 0}% Negative</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent feedback section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Recent Patient Feedback</h3>
          <MessageSquare className="w-5 h-5 text-gray-500" />
        </div>

        <div className="space-y-6">
          {data?.recentFeedback.map((feedback, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{feedback.patientName}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{feedback.date}</span>
                    <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full">{feedback.platform}</span>
                  </div>
                </div>
                <div className="flex">
                  {renderStars(feedback.rating)}
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-2">{feedback.comment}</p>
              <div className="flex justify-between items-center">
                {feedback.responded ? (
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Responded</span>
                ) : (
                  <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">Response needed</span>
                )}
                <button className="text-xs text-primary">View details</button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Recommendations section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">AI Campaign Recommendations</h3>
        </div>

        <div className="space-y-4">
          {data?.campaignRecommendations.map((rec, index) => (
            <div key={index} className="border border-gray-200 p-4 rounded-lg">
              <h4 className="font-medium text-purple-600 mb-1">{rec.title}</h4>
              <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{rec.impact}</span>
                <button className="text-xs px-3 py-1 bg-primary text-white rounded-md">Implement</button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PatientSatisfactionDashboard;