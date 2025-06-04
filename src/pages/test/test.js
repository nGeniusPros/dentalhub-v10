/**
 * Test function for NexHealth integration
 * 
 * This is a simple test endpoint to verify that the NexHealth API client
 * is working correctly. It attempts to authenticate and fetch some basic data.
 */
const { nexhealthClient } = require('../../../netlify/functions/nexhealth/client');
const { success, error, handleOptions } = require('../../../netlify/functions/utils/response');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions(event);
  }
  
  try {
    console.log('Testing NexHealth API connection...');
    
    // Test authentication and fetch basic data
    const results = await Promise.allSettled([
      nexhealthClient.get('/institutions'),
      nexhealthClient.get('/locations'),
      nexhealthClient.get('/payments', { per_page: 5 })
    ]);
    
    // Process results
    const testResults = results.map((result, index) => {
      const endpoint = ['/institutions', '/locations', '/payments'][index];
      
      if (result.status === 'fulfilled') {
        return {
          endpoint,
          success: true,
          count: Array.isArray(result.value.data) ? result.value.data.length : 1,
          sample: Array.isArray(result.value.data) 
            ? (result.value.data.length > 0 ? { id: result.value.data[0].id } : null)
            : { id: result.value.data.id }
        };
      } else {
        return {
          endpoint,
          success: false,
          error: result.reason.message
        };
      }
    });
    
    return success({
      message: 'NexHealth API test completed',
      results: testResults,
      allSuccessful: testResults.every(r => r.success)
    });
  } catch (err) {
    console.error('Error testing NexHealth API:', err);
    return error(`Test failed: ${err.message}`, 500, event);
  }
};
