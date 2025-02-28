import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Types for AI feedback data processing
 */
export type FeedbackSummary = {
  total: number;
  helpful: number;
  unhelpful: number;
  neutral: number;
  validated: number;
  byAgent: {
    [key: string]: {
      total: number;
      helpful: number;
      unhelpful: number;
    }
  };
  byUserRole: {
    [key: string]: number;
  };
  byFeedbackType: {
    [key: string]: number;
  };
  recentTrends: {
    date: string;
    helpful: number;
    unhelpful: number;
  }[];
};

export type TimeRange = 'week' | 'month' | 'quarter' | 'year';

/**
 * Fetches AI feedback summary data from Supabase
 * @param supabase Supabase client instance
 * @param timeRange Time range to fetch data for
 * @returns Promise with feedback summary data
 */
export const fetchFeedbackSummary = async (
  supabase: SupabaseClient, 
  timeRange: TimeRange = 'month'
): Promise<FeedbackSummary | null> => {
  try {
    // Get total counts
    const { data: totalData, error: totalError } = await supabase
      .from('ai_response_feedback')
      .select('*', { count: 'exact', head: true });
      
    if (totalError) throw totalError;
    const totalCount = totalData?.length ?? 0;

    // Get helpful count
    const { data: helpfulData, error: helpfulError } = await supabase
      .from('ai_response_feedback')
      .select('*', { count: 'exact', head: true })
      .eq('was_helpful', true);
      
    if (helpfulError) throw helpfulError;
    const helpfulCount = helpfulData?.length ?? 0;

    // Get unhelpful count
    const { data: unhelpfulData, error: unhelpfulError } = await supabase
      .from('ai_response_feedback')
      .select('*', { count: 'exact', head: true })
      .eq('was_helpful', false);
      
    if (unhelpfulError) throw unhelpfulError;
    const unhelpfulCount = unhelpfulData?.length ?? 0;

    // Get validated count
    const { data: validatedData, error: validatedError } = await supabase
      .from('ai_response_feedback')
      .select('*', { count: 'exact', head: true })
      .eq('is_validated', true);
      
    if (validatedError) throw validatedError;
    const validatedCount = validatedData?.length ?? 0;

    // Get counts by agent type
    const { data: agentData, error: agentError } = await supabase
      .from('ai_response_feedback')
      .select('agent_type, was_helpful')
      .not('agent_type', 'is', null);
      
    if (agentError) throw agentError;
    
    const byAgent: {[key: string]: {total: number, helpful: number, unhelpful: number}} = {};
    
    agentData.forEach((item) => {
      if (!byAgent[item.agent_type]) {
        byAgent[item.agent_type] = { total: 0, helpful: 0, unhelpful: 0 };
      }
      
      byAgent[item.agent_type].total += 1;
      
      if (item.was_helpful === true) {
        byAgent[item.agent_type].helpful += 1;
      } else if (item.was_helpful === false) {
        byAgent[item.agent_type].unhelpful += 1;
      }
    });

    // Get counts by user role
    const { data: roleData, error: roleError } = await supabase
      .from('ai_response_feedback')
      .select('user_role, count')
      .not('user_role', 'is', null)
      .group('user_role');
      
    if (roleError) throw roleError;
    
    const byUserRole: {[key: string]: number} = {};
    
    roleData.forEach((item) => {
      byUserRole[item.user_role] = item.count;
    });

    // Get counts by feedback type
    const { data: typeData, error: typeError } = await supabase
      .from('ai_response_feedback')
      .select('feedback_type, count')
      .not('feedback_type', 'is', null)
      .group('feedback_type');
      
    if (typeError) throw typeError;
    
    const byFeedbackType: {[key: string]: number} = {};
    
    typeData.forEach((item) => {
      byFeedbackType[item.feedback_type] = item.count;
    });

    // Get recent trends based on time range
    let daysToLookBack = 30;
    
    if (timeRange === 'week') {
      daysToLookBack = 7;
    } else if (timeRange === 'quarter') {
      daysToLookBack = 90;
    } else if (timeRange === 'year') {
      daysToLookBack = 365;
    }
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysToLookBack);
    
    const { data: trendData, error: trendError } = await supabase
      .from('ai_response_feedback')
      .select('created_at, was_helpful')
      .gte('created_at', startDate.toISOString());
      
    if (trendError) throw trendError;
    
    // Group by date
    const trendsByDate: {[key: string]: {helpful: number, unhelpful: number}} = {};
    
    trendData.forEach((item) => {
      const date = new Date(item.created_at).toISOString().split('T')[0];
      
      if (!trendsByDate[date]) {
        trendsByDate[date] = { helpful: 0, unhelpful: 0 };
      }
      
      if (item.was_helpful === true) {
        trendsByDate[date].helpful += 1;
      } else if (item.was_helpful === false) {
        trendsByDate[date].unhelpful += 1;
      }
    });
    
    // Convert to array and sort by date
    const recentTrends = Object.keys(trendsByDate).map((date) => ({
      date,
      helpful: trendsByDate[date].helpful,
      unhelpful: trendsByDate[date].unhelpful
    })).sort((a, b) => a.date.localeCompare(b.date));

    // Assemble the summary
    return {
      total: totalCount,
      helpful: helpfulCount,
      unhelpful: unhelpfulCount,
      neutral: totalCount - helpfulCount - unhelpfulCount,
      validated: validatedCount,
      byAgent,
      byUserRole,
      byFeedbackType,
      recentTrends
    };
  } catch (err) {
    console.error('Error fetching feedback summary:', err);
    return null;
  }
}

/**
 * Prepares agent data for charts
 * @param feedbackSummary Feedback summary data
 * @returns Array of agent performance data formatted for charts
 */
export function prepareAgentChartData(feedbackSummary: FeedbackSummary | null) {
  if (!feedbackSummary) return [];
  
  return Object.keys(feedbackSummary.byAgent).map((agent) => ({
    name: agent,
    total: feedbackSummary.byAgent[agent].total,
    helpful: feedbackSummary.byAgent[agent].helpful,
    unhelpful: feedbackSummary.byAgent[agent].unhelpful,
    helpfulRate: Math.round((feedbackSummary.byAgent[agent].helpful / feedbackSummary.byAgent[agent].total) * 100) || 0
  }));
}

/**
 * Prepares helpfulness data for pie chart
 * @param feedbackSummary Feedback summary data
 * @returns Array of helpfulness data formatted for pie chart
 */
export function prepareHelpfulnessData(feedbackSummary: FeedbackSummary | null) {
  if (!feedbackSummary) return [];
  
  return [
    { name: 'Helpful', value: feedbackSummary.helpful },
    { name: 'Unhelpful', value: feedbackSummary.unhelpful },
    { name: 'Neutral', value: feedbackSummary.neutral }
  ].filter(item => item.value > 0);
}

/**
 * Prepares user role data for pie chart
 * @param feedbackSummary Feedback summary data
 * @returns Array of user role data formatted for pie chart
 */
export function prepareUserRoleData(feedbackSummary: FeedbackSummary | null) {
  if (!feedbackSummary) return [];
  
  return Object.keys(feedbackSummary.byUserRole).map((role) => ({
    name: role,
    value: feedbackSummary.byUserRole[role]
  }));
}

/**
 * Sanitizes and validates data for safety
 * @param data Any input data to sanitize and validate
 * @returns Sanitized data
 */
export function sanitizeData(data: any): any {
  if (typeof data === 'string') {
    // Remove any potentially harmful characters
    return data.replace(/[^\w\s.,\-_]/gi, '');
  }
  
  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      return data.map(item => sanitizeData(item));
    }
    
    const sanitizedObj: Record<string, any> = {};
    
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const sanitizedKey = sanitizeData(key);
        sanitizedObj[sanitizedKey] = sanitizeData(data[key]);
      }
    }
    
    return sanitizedObj;
  }
  
  return data;
}
