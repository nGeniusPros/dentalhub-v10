const axios = require('axios');
const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');


// Define required environment variables
const REQUIRED_ENV_VARS = ['RETELL_PHONE_NUMBER', 'RETELL_AGENT_ID', 'URL', 'DEPLOY_PRIME_URL', 'RETELL_API_KEY'];

// Retell API base URL
const RETELL_API_BASE_URL = 'https://api.retellai.com/v1';

/**
 * Netlify Function for RetellAI API
 * 
 * Endpoints:
 * - POST /api/retell/call - Initiate a call with RetellAI
 * - POST /api/retell/webhook - Handle RetellAI webhooks
 * - GET /api/retell/agent/status - Get RetellAI agent status
 * - PUT /api/retell/agent/config - Update RetellAI agent configuration
 */
exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  

  try {
    const path = event.path.split('/').filter(Boolean);
    const endpoint = path[path.length - 1];

    switch (endpoint) {
      case 'call':
        return await initiateRetellCall(event);
      
      case 'webhook':
        return await handleRetellWebhook(event);
      
      case 'status':
        return await getAgentStatus(event);
      
      case 'config':
        return await updateAgentConfig(event);
      
      default:
        return errorResponse(`Unknown endpoint: ${endpoint}`, 404, event);
    }
  } catch (err) {
    console.errorResponse('Error in RetellAI function:', err);
    return errorResponse(`Function error: ${err.message}`, 500, event);
  }
};

/**
 * Initialize a call with Retell AI voice agent
 * This connects a caller to a Retell AI-powered virtual assistant
 */
const initiateRetellCall = async (event) => {
  try {
    const { phoneNumber, callerId, patientInfo, appointmentContext } = JSON.parse(event.body);
    
    if (!phoneNumber) {
      return errorResponse('Destination phone number is required', 400, event);
    }
    
    // Prepare the request to Retell's API
    const retellRequest = {
      to_phone: phoneNumber,
      from_phone: callerId || process.env.RETELL_PHONE_NUMBER,
      agent_id: process.env.RETELL_AGENT_ID,
      webhook_url: `${process.env.URL || process.env.DEPLOY_PRIME_URL || 'https://dentalhub.netlify.app'}/.netlify/functions/retell/webhook`,
      metadata: {
        patientInfo,
        appointmentContext
      }
    };
    
    // Make the request to Retell to initiate the call
    const response = await axios.post(`${RETELL_API_BASE_URL}/calls`, retellRequest, {
      headers: {
        'Authorization': `Bearer ${process.env.RETELL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return successResponse({
      callId: response.data.call_id,
      status: response.data.status
    }, 200, event);
  } catch (err) {
    console.errorResponse('Error initiating Retell call:', err);
    return errorResponse(`Failed to initiate Retell call: ${err.response?.data || err.message}`, 500, event);
  }
};

/**
 * Handle webhooks from Retell AI
 * This receives updates and events from Retell during an active call
 */
const handleRetellWebhook = async (event) => {
  try {
    const { event: retellEvent, call_id, status, message, audio_url, transcript } = JSON.parse(event.body);
    
    console.log('Retell webhook event:', retellEvent, 'for call:', call_id);
    
    // Handle different event types from Retell
    switch (retellEvent) {
      case 'call_started':
        // The call has been initiated
        console.log('Call started:', call_id);
        break;
        
      case 'call_ended':
        // The call has completed - you might want to store conversation summary
        console.log('Call ended:', call_id, 'Duration:', JSON.parse(event.body).duration);
        // Store call recording or summary in your system
        break;
        
      case 'agent_response':
        // The agent has responded to the user
        console.log('Agent response:', message);
        // You could log all agent responses for quality monitoring
        break;
        
      case 'user_response':
        // The user has said something
        console.log('User said:', transcript);
        // You could analyze user responses for sentiment or keywords
        break;
        
      case 'error':
        // An error occurred during the call
        console.errorResponse('Retell error:', message);
        break;
    }
    
    // Always respond with success to Retell webhooks
    return successResponse({ received: true }, 200, event);
  } catch (err) {
    console.errorResponse('Error handling Retell webhook:', err);
    // Still return 200 to Retell so they don't retry
    return successResponse({ 
      received: true,
      error: err.message
    }, 200, event);
  }
};

/**
 * Get the status of the Retell AI agent
 */
const getAgentStatus = async (event) => {
  try {
    const queryParams = event.queryStringParameters || {};
    const agentId = queryParams.agentId || process.env.RETELL_AGENT_ID;
    
    const response = await axios.get(`${RETELL_API_BASE_URL}/agents/${agentId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.RETELL_API_KEY}`
      }
    });
    
    return successResponse({
      agent: response.data
    }, 200, event);
  } catch (err) {
    console.errorResponse('Error getting Retell agent status:', err);
    return errorResponse(`Failed to get agent status: ${err.response?.data || err.message}`, 500, event);
  }
};

/**
 * Update the configuration of the Retell AI agent
 */
const updateAgentConfig = async (event) => {
  try {
    const { 
      agentId = process.env.RETELL_AGENT_ID,
      name,
      voiceId,
      llmConfig,
      useCase,
      parameters
    } = JSON.parse(event.body);
    
    // Prepare the update request
    const updateRequest = {};
    
    if (name) updateRequest.name = name;
    if (voiceId) updateRequest.voice_id = voiceId;
    if (llmConfig) updateRequest.llm_config = llmConfig;
    if (useCase) updateRequest.use_case = useCase;
    if (parameters) updateRequest.parameters = parameters;
    
    // Only make the API call if there's at least one field to update
    if (Object.keys(updateRequest).length === 0) {
      return errorResponse('No update parameters provided', 400, event);
    }
    
    const response = await axios.patch(
      `${RETELL_API_BASE_URL}/agents/${agentId}`,
      updateRequest,
      {
        headers: {
          'Authorization': `Bearer ${process.env.RETELL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return successResponse({
      agent: response.data
    }, 200, event);
  } catch (err) {
    console.errorResponse('Error updating Retell agent:', err);
    return errorResponse(`Failed to update agent configuration: ${err.response?.data || err.message}`, 500, event);
  }
};
