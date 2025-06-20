const axios = require('axios');
const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');

// Define required environment variables
const REQUIRED_ENV_VARS = ['NEXHEALTH_API_URL', 'NEXHEALTH_API_KEY'];

/**
 * This is a utility module and not a direct function handler.
 * Adding a dummy handler for Netlify Functions compatibility.
 */
exports.handler = createHandler(async (event, context) => {
  return successResponse({ message: 'This is a utility module, not a direct endpoint.' }, 200);
}, REQUIRED_ENV_VARS);



// Cache for the authentication token
let cachedToken = null;
let tokenExpiry = null;

/**
 * Get a valid NexHealth API token, using cache if available
 * @returns {Promise<string>} The authentication token
 */
exports.getToken = async () => {
  // Return cached token if valid (with 5-minute buffer)
  if (cachedToken && tokenExpiry && new Date() < new Date(tokenExpiry.getTime() - 300000)) {
    return cachedToken;
  }

  try {
    const response = await axios.post(
      `${process.env.NEXHEALTH_API_URL}/authenticates`,
      {},
      {
        headers: {
          'Accept': 'application/vnd.Nexhealth+json;version=2',
          'Authorization': process.env.NEXHEALTH_API_KEY,
          'Nex-Api-Version': 'v2'
        }
      }
    );

    if (response.data.code === true && response.data.data.token) {
      cachedToken = response.data.data.token;
      
      // Parse JWT to get expiration time
      const tokenParts = cachedToken.split('.');
      if (tokenParts.length === 3) {
        try {
          const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
          if (payload.exp) {
            tokenExpiry = new Date(payload.exp * 1000);
          } else {
            // Default expiry (1 hour from now) if not in token
            tokenExpiry = new Date(Date.now() + 3600000);
          }
        } catch (err) {
          console.error('Error parsing token payload:', err);
          // Default expiry (1 hour from now)
          tokenExpiry = new Date(Date.now() + 3600000);
        }
      } else {
        // Default expiry (1 hour from now)
        tokenExpiry = new Date(Date.now() + 3600000);
      }
      
      return cachedToken;
    } else {
      throw new Error('Invalid authentication response');
    }
  } catch (err) {
    console.error('Error getting NexHealth token:', err);
    throw new Error(`Authentication failed: ${err.message}`);
  }
};
