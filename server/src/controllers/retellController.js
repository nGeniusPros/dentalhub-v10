const axios = require('axios');

// Retell API base URL
const RETELL_API_BASE_URL = 'https://api.retellai.com/v1';

/**
 * Initialize a call with Retell AI voice agent
 * This connects a caller to a Retell AI-powered virtual assistant
 */
const initiateRetellCall = async (req, res) => {
  try {
    const { phoneNumber, callerId, patientInfo, appointmentContext } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Destination phone number is required' });
    }
    
    // Prepare the request to Retell's API
    const retellRequest = {
      to_phone: phoneNumber,
      from_phone: callerId || process.env.TWILIO_PHONE_NUMBER,
      agent_id: process.env.RETELL_AGENT_ID,
      webhook_url: `${req.protocol}://${req.get('host')}/api/retell/webhook`,
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
    
    res.json({
      success: true,
      callId: response.data.call_id,
      status: response.data.status
    });
  } catch (error) {
    console.error('Error initiating Retell call:', error);
    res.status(500).json({
      error: {
        message: 'Failed to initiate Retell call',
        details: error.response?.data || error.message
      }
    });
  }
};

/**
 * Handle webhooks from Retell AI
 * This receives updates and events from Retell during an active call
 */
const handleRetellWebhook = async (req, res) => {
  try {
    const { event, call_id, status, message, audio_url, transcript } = req.body;
    
    console.log('Retell webhook event:', event, 'for call:', call_id);
    
    // Handle different event types from Retell
    switch (event) {
      case 'call_started':
        // The call has been initiated
        console.log('Call started:', call_id);
        break;
        
      case 'call_ended':
        // The call has completed - you might want to store conversation summary
        console.log('Call ended:', call_id, 'Duration:', req.body.duration);
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
        console.error('Retell error:', message);
        break;
    }
    
    // Always respond with success to Retell webhooks
    res.json({ success: true });
    
    // In a real application, you would likely store this data in a database
    // and potentially update your UI in real-time using WebSockets
  } catch (error) {
    console.error('Error handling Retell webhook:', error);
    // Still return 200 to Retell so they don't retry
    res.json({ 
      success: false,
      error: error.message
    });
  }
};

/**
 * Get the status of the Retell AI agent
 */
const getAgentStatus = async (req, res) => {
  try {
    const { agentId = process.env.RETELL_AGENT_ID } = req.query;
    
    const response = await axios.get(`${RETELL_API_BASE_URL}/agents/${agentId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.RETELL_API_KEY}`
      }
    });
    
    res.json({
      success: true,
      agent: response.data
    });
  } catch (error) {
    console.error('Error getting Retell agent status:', error);
    res.status(500).json({
      error: {
        message: 'Failed to get agent status',
        details: error.response?.data || error.message
      }
    });
  }
};

/**
 * Update the configuration of the Retell AI agent
 */
const updateAgentConfig = async (req, res) => {
  try {
    const { 
      agentId = process.env.RETELL_AGENT_ID,
      name,
      voiceId,
      llmConfig,
      useCase,
      parameters
    } = req.body;
    
    // Prepare the update request
    const updateRequest = {};
    
    if (name) updateRequest.name = name;
    if (voiceId) updateRequest.voice_id = voiceId;
    if (llmConfig) updateRequest.llm_config = llmConfig;
    if (useCase) updateRequest.use_case = useCase;
    if (parameters) updateRequest.parameters = parameters;
    
    // Only make the API call if there's at least one field to update
    if (Object.keys(updateRequest).length === 0) {
      return res.status(400).json({ error: 'No update parameters provided' });
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
    
    res.json({
      success: true,
      agent: response.data
    });
  } catch (error) {
    console.error('Error updating Retell agent:', error);
    res.status(500).json({
      error: {
        message: 'Failed to update agent configuration',
        details: error.response?.data || error.message
      }
    });
  }
};

module.exports = {
  initiateRetellCall,
  handleRetellWebhook,
  getAgentStatus,
  updateAgentConfig
};