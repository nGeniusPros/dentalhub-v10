/**
 * Response Helper Utilities for Netlify Functions
 * 
 * This module provides standardized response formatting and CORS handling
 * for Netlify Functions to ensure consistent behavior across all endpoints.
 */

// Standard CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // In production, replace with specific domains
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-requested-with',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

/**
 * Creates a standardized success response with CORS headers
 * 
 * @param {Object} data - The data to include in the response
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {Object} additionalHeaders - Additional headers to include
 * @returns {Object} Formatted response object for Netlify Functions
 */
function successResponse(data, statusCode = 200, additionalHeaders = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...additionalHeaders,
    },
    body: JSON.stringify(data),
  };
}

/**
 * Creates a standardized error response with CORS headers
 * 
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {Object} additionalData - Additional data to include in the response
 * @param {Object} additionalHeaders - Additional headers to include
 * @returns {Object} Formatted error response object for Netlify Functions
 */
function errorResponse(message, statusCode = 400, additionalData = {}, additionalHeaders = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...additionalHeaders,
    },
    body: JSON.stringify({
      error: message,
      ...additionalData,
    }),
  };
}

/**
 * Handles OPTIONS requests for CORS preflight
 * 
 * @returns {Object} CORS preflight response
 */
function handleCorsPreflightRequest() {
  return {
    statusCode: 204, // No content
    headers: corsHeaders,
    body: '',
  };
}

/**
 * Validates required environment variables
 * 
 * @param {Array<string>} requiredVars - Array of required environment variable names
 * @returns {Object|null} Error object if validation fails, null if successful
 */
function validateEnvVars(requiredVars) {
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    return {
      error: `Missing required environment variables: ${missingVars.join(', ')}`,
      statusCode: 500,
    };
  }
  
  return null;
}

/**
 * Common wrapper for Netlify Function handlers
 * Provides consistent error handling and CORS support
 * 
 * @param {Function} handlerFn - The actual handler function
 * @param {Array<string>} requiredEnvVars - Required environment variables
 * @returns {Function} Wrapped handler function
 */
function createHandler(handlerFn, requiredEnvVars = []) {
  return async (event, context) => {
    // Handle CORS preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return handleCorsPreflightRequest();
    }
    
    // Validate environment variables
    const envError = validateEnvVars(requiredEnvVars);
    if (envError) {
      return errorResponse(envError.error, envError.statusCode);
    }
    
    try {
      // Call the actual handler function
      return await handlerFn(event, context);
    } catch (error) {
      console.error('Function error:', error);
      
      // Determine if this is a known error with a status code
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal server error';
      
      return errorResponse(message, statusCode);
    }
  };
}

module.exports = {
  corsHeaders,
  successResponse,
  errorResponse,
  handleCorsPreflightRequest,
  validateEnvVars,
  createHandler,
};
