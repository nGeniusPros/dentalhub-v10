const { handleOptions, success, error } = require('./utils/response');

/**
 * Simple Hello World function to test API connectivity
 * Acts as a health check endpoint for Netlify Functions
 */
exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  try {
    // Get environment information
    const supabaseUrl = process.env.SUPABASE_URL;
    const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;
    
    // Return success response with environment details
    return success({
      message: "Hello from DentalHub Netlify Function!",
      status: "online",
      timestamp: new Date().toISOString(),
      environment: {
        // Verify which environment variables are available
        // Only show existence, not the actual values for security
        supabase: supabaseUrl ? "configured" : "missing",
        firebase: firebaseProjectId ? "configured" : "missing",
        node: process.version,
        region: context.functionName ? "netlify" : "local"
      }
    });
  } catch (err) {
    console.error('Error in hello-world function:', err);
    return error(`Function error: ${err.message}`);
  }
};