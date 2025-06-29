const { createClient } = require('@supabase/supabase-js');
const { successResponse, errorResponse, createHandler } = require('./response-helpers');

// Define required environment variables
const REQUIRED_ENV_VARS = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY'];

/**
 * This is a utility module and not a direct function handler.
 * Adding a dummy handler for Netlify Functions compatibility.
 */
exports.handler = createHandler(async (event, context) => {
  return successResponse({ message: 'This is a utility module, not a direct endpoint.' }, 200);
}, REQUIRED_ENV_VARS);

/**
 * Initialize Supabase client with environment variables
 * @returns {Object} Supabase client
 */
const initSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false
    }
  });

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return supabase;
};

/**
 * Get user information from Supabase by JWT token
 * @param {string} token JWT token from request
 * @returns {Promise<Object>} User information
 */
const getUserByToken = async (token) => {
  if (!token) {
    throw new Error('No authentication token provided');
  }
  
  const supabase = initSupabase();
  
  // Set auth token and get user
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  
  if (userError) {
    throw new Error(`Authentication error: ${userError.message}`);
  }
  
  if (!userData.user) {
    throw new Error('Invalid user token');
  }
  
  return userData.user;
};

/**
 * Get a secure Supabase client authenticated as a specific user
 * @param {string} token JWT token from request
 * @returns {Object} Supabase client authenticated as user
 */
const getSupabaseForUser = (token) => {
  const supabase = initSupabase();
  // Set auth token
  supabase.auth.setAuth(token);
  return supabase;
};

/**
 * Verify a JWT token
 * @param {string} token JWT token from request
 * @returns {Promise<Object>} Decoded token payload
 */
const verifyToken = async (token) => {
  // This is a simplified implementation
  // In production, use a proper JWT verification library
  if (!token) {
    throw new Error('No token provided');
  }
  
  try {
    // Basic validation - token is in the format header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    // Decode the payload (second part)
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    
    // Check if token is expired
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token has expired');
    }
    
    return payload;
  } catch (error) {
    throw new Error(`Token validation error: ${error.message}`);
  }
};

module.exports = {
  initSupabase,
  getUserByToken,
  getSupabaseForUser,
  verifyToken,
};