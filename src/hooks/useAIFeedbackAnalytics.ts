import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase-client';
import { FeedbackSummary, TimeRange, fetchFeedbackSummary } from '../utils/ai-feedback-utils';

/**
 * Custom hook for fetching and managing AI feedback analytics data
 * @param initialTimeRange Initial time range for analytics data
 * @returns Analytics data state and controls
 */
export function useAIFeedbackAnalytics(initialTimeRange: TimeRange = 'month') {
  const [feedbackSummary, setFeedbackSummary] = useState<FeedbackSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);

  useEffect(() => {
    const loadFeedbackSummary = async () => {
      setLoading(true);
      try {
        const summary = await fetchFeedbackSummary(supabase, timeRange);
        setFeedbackSummary(summary);
      } catch (err) {
        console.error('Error fetching feedback summary:', err);
        setError('Failed to load feedback analytics data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadFeedbackSummary();
  }, [timeRange]);

  /**
   * Refresh the feedback data
   */
  const refreshData = async () => {
    setLoading(true);
    try {
      const summary = await fetchFeedbackSummary(supabase, timeRange);
      setFeedbackSummary(summary);
      setError(null);
    } catch (err) {
      console.error('Error refreshing feedback summary:', err);
      setError('Failed to refresh feedback analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    feedbackSummary,
    loading,
    error,
    timeRange,
    setTimeRange,
    refreshData
  };
}

export default useAIFeedbackAnalytics;
