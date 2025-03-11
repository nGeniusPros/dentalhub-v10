const axios = require('axios');
const { handleOptions, success, error, validateRequiredFields } = require('../utils/response');

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
    // Get DeepSeek API key from environment variables
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return error('Missing DeepSeek API key', 500);
    }

    // Parse request body
    const payload = JSON.parse(event.body);
    
    // Validate required fields
    const validationError = validateRequiredFields(payload, ['messages']);
    if (validationError) {
      return error(validationError, 400);
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
    return success(response.data);
  } catch (err) {
    console.error('DeepSeek API error:', err);
    
    // Handle DeepSeek API errors
    if (err.response && err.response.data) {
      return error(`DeepSeek API error: ${err.response.data.error?.message || err.message}`, 
                  err.response.status || 500);
    }
    
    return error(`AI consultation failed: ${err.message}`);
  }
};