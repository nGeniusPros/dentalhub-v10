const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');
const { initSupabase } = require('../utils/supabase');

// Initialize Supabase client
const supabase = initSupabase();

/**
 * Helper function to build date range filter
 */
function buildDateRangeFilter(startDate, endDate) {
  const filters = [];
  
  if (startDate) {
    filters.push(`created_at.gte.${startDate}`);
  }
  
  if (endDate) {
    filters.push(`created_at.lte.${endDate}`);
  }
  
  return filters.join(',');
}

/**
 * Get call analytics for a specific campaign or all campaigns
 */
exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    // Parse query parameters
    const params = event.queryStringParameters || {};
    const { 
      campaignId, 
      agentId, 
      status, 
      startDate, 
      endDate,
      timezone = 'UTC',
      limit = '100',
      offset = '0'
    } = params;

    // Build base query
    let query = supabase
      .from('retell_calls')
      .select('*', { count: 'exact' });

    // Apply filters
    if (campaignId) {
      query = query.eq('campaign_id', campaignId);
    }
    
    if (agentId) {
      query = query.eq('agent_id', agentId);
    }
    
    if (status) {
      query = query.in('status', status.split(','));
    }
    
    // Apply date range filter
    const dateFilter = buildDateRangeFilter(startDate, endDate);
    if (dateFilter) {
      query = query.or(dateFilter);
    }
    
    // Apply pagination
    const limitNum = Math.min(parseInt(limit, 10) || 100, 1000);
    const offsetNum = parseInt(offset, 10) || 0;
    
    query = query
      .order('created_at', { ascending: false })
      .range(offsetNum, offsetNum + limitNum - 1);

    // Execute the query
    const { data: calls, error: queryError, count } = await query;
    
    if (queryError) {
      console.errorResponse('Error fetching call analytics:', queryError);
      throw new Error('Failed to fetch call analytics');
    }
    
    // If no calls found, return empty results
    if (!calls || calls.length === 0) {
      return successResponse({
        calls: [],
        total: 0,
        summary: {
          totalCalls: 0,
          completedCalls: 0,
          failedCalls: 0,
          avgDuration: 0,
          totalDuration: 0
        }
      });
    }
    
    // Calculate summary statistics
    const completedCalls = calls.filter(call => call.status === 'completed');
    const failedCalls = calls.filter(call => call.status === 'failed');
    
    const totalDuration = completedCalls.reduce((sum, call) => {
      return sum + (call.metadata?.duration_seconds || 0);
    }, 0);
    
    const avgDuration = completedCalls.length > 0 
      ? Math.round(totalDuration / completedCalls.length) 
      : 0;
    
    // Format the response
    const response = {
      calls: calls.map(call => ({
        id: call.id,
        callId: call.call_id,
        agentId: call.agent_id,
        campaignId: call.campaign_id,
        phoneNumber: call.phone_number,
        userPhoneNumber: call.user_phone_number,
        status: call.status,
        duration: call.metadata?.duration_seconds || 0,
        startedAt: call.created_at,
        endedAt: call.updated_at,
        recordingUrl: call.metadata?.recording_url,
        metadata: call.metadata
      })),
      total: count || 0,
      summary: {
        totalCalls: calls.length,
        completedCalls: completedCalls.length,
        failedCalls: failedCalls.length,
        avgDuration,
        totalDuration,
        completionRate: calls.length > 0 
          ? Math.round((completedCalls.length / calls.length) * 100) 
          : 0
      },
      pagination: {
        limit: limitNum,
        offset: offsetNum,
        hasMore: (offsetNum + limitNum) < (count || 0)
      }
    };
    
    return successResponse(response);
  } catch (err) {
    console.errorResponse('Error in get-call-analytics:', err);
    
    // Log the error to the database if possible
    try {
      await supabase
        .from('call_events')
        .insert({
          event_type: 'analytics_error',
          timestamp: new Date().toISOString(),
          metadata: {
            error: err.message,
            stack: err.stack,
            query: event.queryStringParameters
          }
        });
    } catch (logErr) {
      console.errorResponse('Failed to log analytics error:', logErr);
    }
    
    return errorResponse(`Failed to retrieve call analytics: ${err.message}`, 500);
  }
};
