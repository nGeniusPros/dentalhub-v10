const axios = require('axios');
const { handleOptions, success, error } = require('../utils/response');
const { initSupabase } = require('../utils/supabase');
const { formatPhoneNumber, isValidPhoneNumber } = require('../utils/retell');

// Maximum call duration in seconds (15 minutes)
const MAX_CALL_DURATION = 15 * 60;

// Initialize Supabase client
const supabase = initSupabase();

/**
 * Validates the request body for starting a call
 */
function validateCallRequest(body) {
  const { agentId, phoneNumber, userPhoneNumber, campaignId } = body;
  const errors = [];

  // Required fields
  if (!agentId) errors.push('agentId is required');
  if (!phoneNumber) errors.push('phoneNumber is required');
  if (!userPhoneNumber) errors.push('userPhoneNumber is required');

  // Validate phone numbers if provided
  if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
    errors.push('Invalid phone number format. Use E.164 format (e.g., +12345678900)');
  }
  
  if (userPhoneNumber && !isValidPhoneNumber(userPhoneNumber)) {
    errors.push('Invalid user phone number format. Use E.164 format (e.g., +12345678900)');
  }

  // Validate campaign ID format if provided
  if (campaignId && !/^[a-f\d]{24}$/i.test(campaignId)) {
    errors.push('Invalid campaign ID format');
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      agentId,
      phoneNumber: phoneNumber ? formatPhoneNumber(phoneNumber) : null,
      userPhoneNumber: userPhoneNumber ? formatPhoneNumber(userPhoneNumber) : null,
      campaignId,
      metadata: body.metadata || {},
      maxDuration: Math.min(parseInt(body.maxDuration, 10) || MAX_CALL_DURATION, MAX_CALL_DURATION)
    }
  };
}

exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return error('Method not allowed', 405);
  }

  try {
    // Get Retell API key from environment variables
    const apiKey = process.env.RETELL_API_KEY;
    if (!apiKey) {
      console.error('Missing Retell API key');
      return error('Service configuration error', 500);
    }

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
    } catch (e) {
      return error('Invalid JSON payload', 400);
    }

    const validation = validateCallRequest(requestBody);
    if (!validation.isValid) {
      return error(`Invalid request: ${validation.errors.join(', ')}`, 400);
    }

    const { 
      agentId, 
      phoneNumber, 
      userPhoneNumber, 
      campaignId, 
      metadata, 
      maxDuration 
    } = validation.data;

    // Check if agent exists and is active
    const { data: agent, error: agentError } = await supabase
      .from('retell_agents')
      .select('id, status, settings')
      .eq('id', agentId)
      .single();

    if (agentError || !agent) {
      console.error('Agent not found:', agentError);
      return error('Agent not found', 404);
    }

    if (agent.status !== 'active') {
      return error('Agent is not active', 400);
    }

    // Prepare call data
    const callData = {
      agent_id: agentId,
      from_phone_number: phoneNumber,
      to_phone_number: userPhoneNumber,
      max_duration_seconds: maxDuration,
      metadata: {
        ...metadata,
        source: 'dentalhub-voice-campaign',
        campaign_id: campaignId,
        user_agent: event.headers['user-agent']
      },
      webhook_url: `${process.env.APP_URL || 'https://your-app-url.com'}/.netlify/functions/retell/webhook`,
      // Use agent's voice settings if available
      ...(agent.settings?.voice ? { voice_settings: agent.settings.voice } : {})
    };

    // Make request to Retell API
    const response = await axios.post(
      'https://api.retellai.com/v1/calls',
      callData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'User-Agent': 'DentalHub/1.0 (Netlify Function)'
        },
        timeout: 10000 // 10 second timeout
      }
    ).catch(err => {
      console.error('Retell API error:', err.response?.data || err.message);
      throw new Error(`Failed to initiate call: ${err.response?.data?.error || err.message}`);
    });

    // Store call information in Supabase
    const callRecord = {
      call_id: response.data.call_id,
      agent_id: agentId,
      phone_number: phoneNumber,
      user_phone_number: userPhoneNumber,
      campaign_id: campaignId,
      status: 'initiated',
      metadata: {
        ...metadata,
        retell_response: response.data
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: savedCall, error: dbError } = await supabase
      .from('retell_calls')
      .insert(callRecord)
      .select()
      .single();

    if (dbError) {
      console.error('Error storing call record:', dbError);
      throw new Error('Failed to store call record');
    }

    // Log the call initiation event
    await supabase
      .from('call_events')
      .insert({
        call_id: response.data.call_id,
        event_type: 'initiated',
        timestamp: new Date().toISOString(),
        metadata: {
          ...callRecord,
          retell_response: response.data
        }
      });

    return success({
      callId: response.data.call_id,
      status: response.data.status,
      message: 'Call initiated successfully',
      data: savedCall
    });
  } catch (err) {
    console.error('Error in start-call:', err);
    
    // Log the error to the database if possible
    try {
      await supabase
        .from('call_events')
        .insert({
          event_type: 'call_initiation_error',
          timestamp: new Date().toISOString(),
          metadata: {
            error: err.message,
            stack: err.stack,
            request: event.body,
            headers: event.headers
          }
        });
    } catch (logErr) {
      console.error('Failed to log error:', logErr);
    }
    
    return error(err.message || 'Failed to initiate call', 500);
  }
};