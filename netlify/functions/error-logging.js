/**
 * Error Logging Function
 * 
 * Receives client-side error reports and logs them
 * Also forwards to external monitoring services if configured
 */

const { handleOptions, success, error, logError } = require('./utils/response');

exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions(event);
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return error('Method not allowed', 405, event);
  }

  try {
    // Parse request body
    const payload = JSON.parse(event.body);
    
    // Log the error with structured format
    console.error(JSON.stringify({
      type: 'client_error',
      timestamp: new Date().toISOString(),
      error: {
        message: payload.message,
        stack: payload.stack,
        component: payload.component || 'unknown'
      },
      context: {
        url: payload.url,
        userAgent: payload.userAgent,
        userId: payload.userId || 'anonymous',
        referrer: event.headers.referer || 'unknown',
        timestamp: payload.timestamp
      },
      additionalInfo: payload.additionalInfo || {}
    }));
    
    // Here you would add code to forward to Sentry, New Relic, etc.
    // if those services are configured
    
    // Implement Sentry forwarding if SENTRY_DSN is configured
    if (process.env.SENTRY_DSN) {
      // Placeholder for Sentry integration
      // Would require @sentry/node package
      /*
      const Sentry = require('./utils/sentry');
      Sentry.captureException(new Error(payload.message), {
        tags: { 
          component: payload.component || 'unknown',
          environment: process.env.NODE_ENV || 'production'
        },
        extra: payload
      });
      */
    }
    
    return success({ 
      logged: true,
      timestamp: new Date().toISOString()
    }, 200, event);
  } catch (err) {
    logError('error-logging', err, { 
      path: event.path,
      method: event.httpMethod 
    });
    
    return error('Error processing client error report', 500, event);
  }
};