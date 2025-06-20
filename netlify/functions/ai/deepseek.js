const axios = require('axios');
const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');

// Define required environment variables
const REQUIRED_ENV_VARS = ['DEEPSEEK_API_KEY'];

// Validate required fields in the request payload
function validateRequiredFields(payload, requiredFields) {
  for (const field of requiredFields) {
    if (!payload[field]) {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}

// Main handler function
async function deepseekHandler(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    // Parse request body
    const payload = JSON.parse(event.body);
    
    // Validate required fields
    const validationError = validateRequiredFields(payload, ['messages']);
    if (validationError) {
      console.error('Validation error:', validationError, {
        path: event.path,
        payload: JSON.stringify(payload)
      });
      return errorResponse(validationError, 400);
    }
    
    // Get DeepSeek API key from environment variables
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    const {
      messages,
      model = "deepseek-chat",
      temperature = 0.7,
      max_tokens = 2000,
      top_p = 0.95,
      stream = false,
      user = "dental-hub-user"
    } = payload;
    
    // Prepare request for DeepSeek API
    const requestData = {
      model,
      messages,
      temperature,
      max_tokens,
      top_p,
      stream,
      user
    };

    // Make request to DeepSeek API
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    // Return the DeepSeek API response
    return successResponse(response.data);
  } catch (err) {
    // Enhanced structured error logging
    const errorContext = {
      path: event.path,
      method: event.httpMethod,
      hasResponse: !!err.response,
      statusCode: err.response?.status,
      requestId: event.headers['x-dentalhub-request-id'] || 'unknown'
    };
    
    console.error('DeepSeek API error:', err, errorContext);
    
    // Handle DeepSeek API errors
    if (err.response && err.response.data) {
      return errorResponse(
        `DeepSeek API error: ${err.response.data.error?.message || err.message}`,
        err.response.status || 500
      );
    }
    
    return errorResponse(`AI consultation failed: ${err.message}`, 500);
  }
}

// Export the handler with environment variable validation
exports.handler = createHandler(deepseekHandler, REQUIRED_ENV_VARS);