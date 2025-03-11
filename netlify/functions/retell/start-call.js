const axios = require('axios');
const { handleOptions, success, error } = require('../utils/response');
const { initSupabase } = require('../utils/supabase');

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
      return error('Missing Retell API key', 500);
    }

    // Get request body
    const {
      agentId,
      phoneNumber,
      userPhoneNumber,
      metadata = {},
      callbackUrl,
    } = JSON.parse(event.body);

    // Validate required parameters
    if (!agentId || !phoneNumber) {
      return error('Missing required parameters: agentId, phoneNumber', 400);
    }

    // Prepare request for Retell API
    const callData = {
      agent_id: agentId,
      caller_id: phoneNumber,
      to: userPhoneNumber,
      metadata: {
        ...metadata,
        source: 'dentalhub-netlify',
      },
    };

    // Add optional webhook callback URL if provided
    if (callbackUrl) {
      callData.webhook_url = callbackUrl;
    }

    // Make request to Retell API
    const retellResponse = await axios.post(
      'https://api.retellai.com/v1/calls',
      callData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
      }
    );

    // Store call information in Supabase
    const supabase = initSupabase();
    
    const { data: callRecord, error: dbError } = await supabase
      .from('retell_calls')
      .insert({
        call_id: retellResponse.data.call_id,
        agent_id: agentId,
        phone_number: phoneNumber,
        user_phone_number: userPhoneNumber,
        status: 'initiated',
        metadata,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error storing call record:', dbError);
    }

    return success({
      callId: retellResponse.data.call_id,
      status: retellResponse.data.status,
      message: 'Call initiated successfully',
    });
  } catch (err) {
    console.error('Retell call initiation error:', err);
    
    // Handle Retell API errors
    if (err.response && err.response.data) {
      return error(`Retell API error: ${err.response.data.error || err.message}`, 
                 err.response.status || 500);
    }
    
    return error(`Failed to initiate call: ${err.message}`);
  }
};