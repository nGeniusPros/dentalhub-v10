const { success, error, handleOptions } = require('../../utils/response');

// Import the client with error handling
let nexhealthClient;
try {
  nexhealthClient = require('../../../netlify/functions/nexhealth/client').nexhealthClient;
  console.log('NexHealth client loaded successfully');
} catch (clientErr) {
  console.error('Error loading NexHealth client:', clientErr);
  throw new Error(`Failed to load NexHealth client: ${clientErr.message}`);
}

/**
 * Test endpoint to inspect NexHealth patients API response
 * This is for development purposes only and should be disabled in production
 */
module.exports.handler = async (event, context) => {
  console.log('=== Test Patients Endpoint Hit ===');
  console.log('HTTP Method:', event.httpMethod);
  
  if (event.httpMethod === 'OPTIONS') {
    console.log('Handling OPTIONS preflight');
    return handleOptions(event);
  }

  try {
    console.log('Testing NexHealth patients API...');
    
    // Log environment variables (without sensitive values)
    const envVars = {
      NEXHEALTH_API_URL: process.env.NEXHEALTH_API_URL ? '***' : 'NOT SET',
      NEXHEALTH_SUBDOMAIN: process.env.NEXHEALTH_SUBDOMAIN ? '***' : 'NOT SET',
      NEXHEALTH_LOCATION_ID: process.env.NEXHEALTH_LOCATION_ID ? '***' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'development',
      // List other relevant environment variables
      NETLIFY_DEV: process.env.NETLIFY_DEV,
      CONTEXT: process.env.CONTEXT
    };
    
    console.log('Environment Variables:', JSON.stringify(envVars, null, 2));
    
    // Test the client configuration
    console.log('Testing NexHealth client...');
    
    if (!nexhealthClient) {
      throw new Error('NexHealth client not properly initialized');
    }
    
    // Make a test request to the NexHealth API
    console.log('Making request to NexHealth API...');
    const requestParams = {
      per_page: 1, // Just get one patient to see the structure
      page: 1
    };
    
    console.log('Request params:', JSON.stringify(requestParams, null, 2));
    
    const response = await nexhealthClient.get('/patients', requestParams);
    
    // Log the response structure for inspection
    console.log('NexHealth API Response:', JSON.stringify(response, null, 2));
    
    return success({
      message: 'NexHealth patients API test successful',
      data: response,
      structure: {
        data: 'Array of patients',
        meta: 'Pagination and metadata',
        // Add other relevant fields based on actual response
      },
      environment: process.env.NODE_ENV || 'development'
    });
    
  } catch (err) {
    console.error('Error testing NexHealth patients API:', err);
    
    // Log detailed error information
    const errorInfo = {
      message: err.message,
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      config: {
        url: err.config?.url,
        method: err.config?.method,
        headers: err.config?.headers ? Object.keys(err.config.headers) : [],
        params: err.config?.params
      }
    };
    
    console.error('Error details:', JSON.stringify(errorInfo, null, 2));
    
    return error(
      'Failed to fetch patients from NexHealth API. Check server logs for details.',
      err.response?.status || 500,
      event
    );
  }
};
