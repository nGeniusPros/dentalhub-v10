const axios = require('axios');
const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');
const { initSupabase } = require('../utils/supabase');


// Define required environment variables
const REQUIRED_ENV_VARS = ['RETELL_AGENT_ID', 'RETELL_API_KEY'];

// Retell API base URL
const RETELL_API_BASE_URL = 'https://api.retellai.com/v1';

/**
 * Netlify Function for RetellAI Analytics
 * 
 * Endpoints:
 * - GET /api/retell/analytics - Get call analytics with optional filters
 * - GET /api/retell/analytics/:callId - Get details for a specific call
 */
exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  

  try {
    const path = event.path.split('/').filter(Boolean);
    const resourceId = path[path.length - 1] !== 'analytics' ? path[path.length - 1] : null;
    
    if (event.httpMethod === 'GET') {
      if (resourceId) {
        // Get specific call details
        return await getCallDetails(event, resourceId);
      } else {
        // Get call analytics with filters
        return await getCallAnalytics(event);
      }
    } else {
      return errorResponse('Method not allowed', 405, event);
    }
  } catch (err) {
    console.errorResponse('Error in RetellAI analytics function:', err);
    return errorResponse(`Function error: ${err.message}`, 500, event);
  }
};

/**
 * Get call analytics with optional filters
 */
const getCallAnalytics = async (event) => {
  try {
    // Extract query parameters
    const queryParams = event.queryStringParameters || {};
    const { 
      campaignId,
      agentId = process.env.RETELL_AGENT_ID,
      status,
      startDate,
      endDate,
      limit = '20',
      offset = '0'
    } = queryParams;
    
    // Prepare the request parameters
    const params = new URLSearchParams();
    if (agentId) params.append('agent_id', agentId);
    if (status) params.append('status', status);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (limit) params.append('limit', limit);
    if (offset) params.append('offset', offset);
    
    // Make the request to Retell's API
    const response = await axios.get(`${RETELL_API_BASE_URL}/calls?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${process.env.RETELL_API_KEY}`
      }
    });
    
    // If campaignId is provided, filter the results
    let calls = response.data.calls || [];
    if (campaignId) {
      const supabase = initSupabase();
      
      // Get campaign-call associations from the database
      const { data: campaignCalls, error: dbError } = await supabase
        .from('campaign_calls')
        .select('call_id')
        .eq('campaign_id', campaignId);
      
      if (dbError) throw dbError;
      
      // Filter calls by campaign
      const campaignCallIds = campaignCalls.map(cc => cc.call_id);
      calls = calls.filter(call => campaignCallIds.includes(call.call_id));
    }
    
    // Calculate analytics
    const analytics = {
      total: calls.length,
      completed: calls.filter(call => call.status === 'completed').length,
      failed: calls.filter(call => ['failed', 'error'].includes(call.status)).length,
      inProgress: calls.filter(call => ['in-progress', 'ringing'].includes(call.status)).length,
      averageDuration: calls.length > 0 ? 
        calls.reduce((sum, call) => sum + (call.duration || 0), 0) / calls.length : 0,
      calls: calls
    };
    
    return successResponse(analytics, 200, event);
  } catch (err) {
    console.errorResponse('Error getting call analytics:', err);
    return errorResponse(`Failed to get call analytics: ${err.response?.data || err.message}`, 500, event);
  }
};

/**
 * Get details for a specific call
 */
const getCallDetails = async (event, callId) => {
  try {
    // Make the request to Retell's API
    const response = await axios.get(`${RETELL_API_BASE_URL}/calls/${callId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.RETELL_API_KEY}`
      }
    });
    
    // Get call transcript if available
    let transcript = null;
    try {
      const transcriptResponse = await axios.get(`${RETELL_API_BASE_URL}/calls/${callId}/transcript`, {
        headers: {
          'Authorization': `Bearer ${process.env.RETELL_API_KEY}`
        }
      });
      transcript = transcriptResponse.data;
    } catch (transcriptErr) {
      console.warn(`Transcript not available for call ${callId}:`, transcriptErr.message);
    }
    
    // Get call recording if available
    let recording = null;
    try {
      const recordingResponse = await axios.get(`${RETELL_API_BASE_URL}/calls/${callId}/recording`, {
        headers: {
          'Authorization': `Bearer ${process.env.RETELL_API_KEY}`
        }
      });
      recording = recordingResponse.data;
    } catch (recordingErr) {
      console.warn(`Recording not available for call ${callId}:`, recordingErr.message);
    }
    
    // Combine all data
    const callDetails = {
      ...response.data,
      transcript,
      recording
    };
    
    return successResponse(callDetails, 200, event);
  } catch (err) {
    console.errorResponse(`Error getting call details for ${callId}:`, err);
    return errorResponse(`Failed to get call details: ${err.response?.data || err.message}`, 500, event);
  }
};
