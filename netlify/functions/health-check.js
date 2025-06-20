const { success, error, getCorsHeaders, logError, createSupabaseAdmin } = require('./utils/response');
const { successResponse, errorResponse, createHandler } = require('./utils/response-helpers');


// Define required environment variables
const REQUIRED_ENV_VARS = ['COMMIT_REF', 'NETLIFY_DEV', 'DEEPSEEK_API_KEY'];


const axios = require('axios');

/**
 * Health check function
 * Tests critical system components and returns their status
 */
exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: getCorsHeaders(event),
      body: ''
    };
  }

  try {
    // Gather health information from various services
    const [dbStatus, aiStatus] = await Promise.allSettled([
      checkDatabase(),
      checkAIService()
    ]);

    // Prepare health status response
    const status = {
      service: 'DentalHub API',
      status: 'operational',
      version: process.env.COMMIT_REF || 'development',
      timestamp: new Date().toISOString(),
      components: {
        api: { status: 'operational' },
        database: { 
          status: dbStatus.status === 'fulfilled' ? dbStatus.value : 'degraded',
          message: dbStatus.status !== 'fulfilled' ? 'Database connection issue' : undefined
        },
        ai: { 
          status: aiStatus.status === 'fulfilled' ? aiStatus.value : 'degraded',
          message: aiStatus.status !== 'fulfilled' ? 'AI service unavailable' : undefined
        }
      },
      environment: process.env.NETLIFY_DEV ? 'development' : 'production'
    };

    // Determine overall system health
    const hasIssues = Object.values(status.components).some(
      component => component.status !== 'operational'
    );

    // Set appropriate HTTP status code based on health
    const statusCode = hasIssues ? 503 : 200;

    if (hasIssues) {
      status.status = 'degraded';
    }

    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        ...getCorsHeaders(event)
      },
      body: JSON.stringify(status)
    };
  } catch (err) {
    logError('health-check', err, { path: event.path });
    return error('Health check failed', 500, event);
  }
};

/**
 * Check database connectivity
 */
async function checkDatabase() {
  try {
    const supabase = createSupabaseAdmin();
    
    if (!supabase) {
      return 'misconfigured';
    }
    
    // Perform a simple query to test database connectivity
    const { data, error: dbError } = await supabase
      .from('health_checks')
      .select('id')
      .limit(1)
      .maybeSingle();
      
    // If the health_checks table doesn't exist, try a different table
    if (dbError && dbError.code === '42P01') {
      // Try system table instead
      const { error: systemError } = await supabase
        .from('locations')
        .select('id')
        .limit(1);
        
      if (systemError) {
        return 'degraded';
      }
    } else if (dbError) {
      return 'degraded';
    }
    
    return 'operational';
  } catch (err) {
    console.error('Database health check failed:', err);
    return 'degraded';
  }
}

/**
 * Check AI service availability
 */
async function checkAIService() {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      return 'misconfigured';
    }
    
    // Simple request to check if the AI service is responding
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'Health check' }],
        max_tokens: 5
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 5000 // 5 second timeout for health checks
      }
    );
    
    return response.status === 200 ? 'operational' : 'degraded';
  } catch (err) {
    console.error('AI service health check failed:', err);
    return 'degraded';
  }
}