const axios = require('axios');
const { handleOptions, success, error, validateRequiredFields, logError } = require('../utils/response');

exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions(event);
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return error('Method not allowed', 405, event);
  }

  try {
    // Get DeepSeek API key from environment variables
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      logError('deepseek', new Error('Missing API key'), { path: event.path });
      return error('Missing DeepSeek API key', 500, event);
    }

    // Parse request body
    const payload = JSON.parse(event.body);
    
    // Validate required fields
    const validationError = validateRequiredFields(payload, ['messages']);
    if (validationError) {
      logError('deepseek', new Error(validationError), {
        path: event.path,
        payload: JSON.stringify(payload)
      });
      return error(validationError, 400, event);
    }
    
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
    return success(response.data, 200, event);
  } catch (err) {
    // Enhanced structured error logging
    const errorContext = {
      path: event.path,
      method: event.httpMethod,
      hasResponse: !!err.response,
      statusCode: err.response?.status,
      requestId: event.headers['x-dentalhub-request-id'] || 'unknown'
    };
    
    logError('deepseek', err, errorContext);
    
    // Handle DeepSeek API errors
    if (err.response && err.response.data) {
      return error(`DeepSeek API error: ${err.response.data.error?.message || err.message}`,
                  err.response.status || 500, event);
    }
    
    return error(`AI consultation failed: ${err.message}`, 500, event);
  }
};