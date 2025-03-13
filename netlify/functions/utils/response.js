/**
 * Utility functions for handling Netlify Function responses
 * These helpers ensure consistent responses across all functions
 */

// Determine appropriate CORS origin based on request
const getCorsHeaders = (event) => {
  // Get the origin from the request
  const origin = event?.headers?.origin || '';
  
  // List of allowed origins
  const allowedOrigins = [
    'https://dentalhub.netlify.app',      // Production
    'https://dentalhub-v10.netlify.app',  // Original production
    'http://localhost:5173',              // Vite dev server
    'http://localhost:8888'               // Netlify dev
  ];
  
  // Check if the request origin is allowed
  // Also allow all *.netlify.app domains for preview deployments
  const isAllowed = allowedOrigins.includes(origin) ||
                   origin.endsWith('.netlify.app');
                   
  // Set the appropriate origin or deny
  const allowOrigin = isAllowed ? origin : allowedOrigins[0];
  
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-dentalhub-client',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Max-Age': '2592000', // 30 days
    'Access-Control-Allow-Credentials': 'true'
  };
};

/**
 * Handle OPTIONS requests for CORS preflight
 * @param {Object} event - The Netlify Function event object
 * @returns {Object} Response with CORS headers
 */
const handleOptions = (event) => {
  return {
    statusCode: 204, // No content
    headers: getCorsHeaders(event),
    body: ''
  };
};

/**
 * Create a success response with proper formatting and CORS headers
 * @param {any} data - The data to return in the response
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {Object} event - The Netlify Function event object
 * @returns {Object} Formatted success response
 */
const success = (data, statusCode = 200, event = null) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...getCorsHeaders(event)
    },
    body: JSON.stringify(data)
  };
};

/**
 * Create an error response with proper formatting and CORS headers
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {Object} event - The Netlify Function event object
 * @returns {Object} Formatted error response
 */
const error = (message, statusCode = 500, event = null) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...getCorsHeaders(event)
    },
    body: JSON.stringify({
      error: message,
      timestamp: new Date().toISOString()
    })
  };
};

/**
 * Validate required fields in a request payload
 * @param {Object} payload - The request payload to validate
 * @param {Array<string>} requiredFields - Array of required field names
 * @returns {string|null} Error message or null if validation passes
 */
const validateRequiredFields = (payload, requiredFields) => {
  if (!payload) {
    return 'Missing request body';
  }
  
  const missingFields = requiredFields.filter(field => {
    return payload[field] === undefined || payload[field] === null;
  });
  
  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(', ')}`;
  }
  
  return null;
};

/**
 * Create a Supabase client with admin privileges
 * @returns {Object} Supabase client or null if environment variables are missing
 */
const createSupabaseAdmin = () => {
  const { createClient } = require('@supabase/supabase-js');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false
    }
  });
};

/**
 * Structured error logging for serverless functions
 * @param {string} functionName - Name of the function where error occurred
 * @param {Error} error - The error object
 * @param {Object} context - Additional context information
 */
const logError = (functionName, error, context = {}) => {
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    function: functionName,
    error: error.message,
    stack: error.stack,
    context: context
  }));
  
  // Additional integrations could be added here (Sentry, etc.)
};

module.exports = {
  getCorsHeaders,
  handleOptions,
  success,
  error,
  validateRequiredFields,
  createSupabaseAdmin,
  logError
};