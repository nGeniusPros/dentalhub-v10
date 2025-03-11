/**
 * Utility functions for handling Netlify Function responses
 * These helpers ensure consistent responses across all functions
 */

// CORS headers to allow cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Can be restricted to specific domains in production
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-dentalhub-client',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '2592000', // 30 days
  'Access-Control-Allow-Credentials': 'true'
};

/**
 * Handle OPTIONS requests for CORS preflight
 * @returns {Object} Response with CORS headers
 */
const handleOptions = () => {
  return {
    statusCode: 204, // No content
    headers: corsHeaders,
    body: ''
  };
};

/**
 * Create a success response with proper formatting and CORS headers
 * @param {any} data - The data to return in the response
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {Object} Formatted success response
 */
const success = (data, statusCode = 200) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    },
    body: JSON.stringify(data)
  };
};

/**
 * Create an error response with proper formatting and CORS headers
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @returns {Object} Formatted error response
 */
const error = (message, statusCode = 500) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
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

module.exports = {
  corsHeaders,
  handleOptions,
  success,
  error,
  validateRequiredFields,
  createSupabaseAdmin
};