const axios = require('axios');
const { getToken } = require('./auth');

/**
 * Helper to add common query parameters required by NexHealth API
 * @param {Object} params - Additional query parameters
 * @returns {Object} - Combined parameters with subdomain and location_id
 */
const addCommonParams = (params = {}) => {
  return {
    ...params,
    subdomain: process.env.NEXHEALTH_SUBDOMAIN,
    location_id: process.env.NEXHEALTH_LOCATION_ID
  };
};

/**
 * Rate limiting helper with exponential backoff
 * @param {Function} requestFn - Async function that makes the actual request
 * @returns {Promise<any>} - Response data
 */
const rateLimitedRequest = async (requestFn) => {
  let retries = 0;
  const maxRetries = 5;
  
  while (retries < maxRetries) {
    try {
      return await requestFn();
    } catch (err) {
      if (err.response && err.response.status === 429 && retries < maxRetries - 1) {
        // Rate limited, wait with exponential backoff
        const delay = Math.pow(2, retries) * 1000 + Math.random() * 1000;
        console.log(`Rate limited, retrying in ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        retries++;
      } else {
        throw err;
      }
    }
  }
};

/**
 * NexHealth API client with authentication and rate limiting
 */
exports.nexhealthClient = {
  /**
   * Make a GET request to the NexHealth API
   * @param {string} endpoint - API endpoint path
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Response data
   */
  async get(endpoint, params = {}) {
    return rateLimitedRequest(async () => {
      const token = await getToken();
      const queryParams = addCommonParams(params);
      
      const response = await axios.get(
        `${process.env.NEXHEALTH_API_BASE_URL}${endpoint}`,
        {
          headers: {
            'Accept': 'application/vnd.Nexhealth+json;version=2',
            'Authorization': `Bearer ${token}`,
            'Nex-Api-Version': 'v2'
          },
          params: queryParams
        }
      );
      
      if (response.data.code !== true) {
        throw new Error(`API Error: ${response.data.error?.join(', ') || 'Unknown error'}`);
      }
      
      return response.data;
    });
  },
  
  /**
   * Make a POST request to the NexHealth API
   * @param {string} endpoint - API endpoint path
   * @param {Object} data - Request body
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Response data
   */
  async post(endpoint, data = {}, params = {}) {
    return rateLimitedRequest(async () => {
      const token = await getToken();
      const queryParams = addCommonParams(params);
      
      const response = await axios.post(
        `${process.env.NEXHEALTH_API_BASE_URL}${endpoint}`,
        data,
        {
          headers: {
            'Accept': 'application/vnd.Nexhealth+json;version=2',
            'Authorization': `Bearer ${token}`,
            'Nex-Api-Version': 'v2'
          },
          params: queryParams
        }
      );
      
      if (response.data.code !== true) {
        throw new Error(`API Error: ${response.data.error?.join(', ') || 'Unknown error'}`);
      }
      
      return response.data;
    });
  },
  
  /**
   * Make a PATCH request to the NexHealth API
   * @param {string} endpoint - API endpoint path
   * @param {Object} data - Request body
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Response data
   */
  async patch(endpoint, data = {}, params = {}) {
    return rateLimitedRequest(async () => {
      const token = await getToken();
      const queryParams = addCommonParams(params);
      
      const response = await axios.patch(
        `${process.env.NEXHEALTH_API_BASE_URL}${endpoint}`,
        data,
        {
          headers: {
            'Accept': 'application/vnd.Nexhealth+json;version=2',
            'Authorization': `Bearer ${token}`,
            'Nex-Api-Version': 'v2'
          },
          params: queryParams
        }
      );
      
      if (response.data.code !== true) {
        throw new Error(`API Error: ${response.data.error?.join(', ') || 'Unknown error'}`);
      }
      
      return response.data;
    });
  }
};
