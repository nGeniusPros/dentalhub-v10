/**
 * Performance monitoring middleware for Netlify Functions
 * 
 * This utility wraps function handlers to track and log performance metrics
 * such as execution time, success rates, and resource usage.
 */

/**
 * Creates a middleware that wraps a function handler to track performance
 * 
 * @param {Function} originalHandler - The original function handler to wrap
 * @param {Object} options - Configuration options
 * @param {string} options.functionName - Name of the function (defaults to context.functionName)
 * @param {boolean} options.logParams - Whether to log request parameters (default: false)
 * @param {boolean} options.logHeaders - Whether to log request headers (default: false)
 * @returns {Function} Wrapped handler function with performance monitoring
 */
const createPerformanceMiddleware = (originalHandler, options = {}) => {
  return async (event, context) => {
    const start = Date.now();
    const functionName = options.functionName || context.functionName || 'unknown';
    
    // Extract request metadata
    const requestId = event.headers['x-dentalhub-request-id'] || 
                     event.headers['x-request-id'] || 
                     `req_${Math.random().toString(36).substring(2, 15)}`;
    
    // Track memory usage (if available)
    const startMemory = process.memoryUsage?.() || {};
    
    try {
      // Execute the original handler
      const result = await originalHandler(event, context);
      
      // Calculate execution time
      const duration = Date.now() - start;
      
      // Get end memory usage
      const endMemory = process.memoryUsage?.() || {};
      
      // Calculate memory differences
      const memoryDiff = {};
      for (const key in endMemory) {
        if (startMemory[key]) {
          memoryDiff[key] = endMemory[key] - startMemory[key];
        }
      }
      
      // Log performance data in structured format
      console.log(JSON.stringify({
        type: 'performance',
        timestamp: new Date().toISOString(),
        function: functionName,
        requestId,
        duration,
        path: event.path,
        method: event.httpMethod,
        status: result.statusCode,
        memory: memoryDiff,
        // Conditionally include additional details
        ...(options.logParams ? { params: event.queryStringParameters } : {}),
        ...(options.logHeaders ? { 
          headers: {
            origin: event.headers.origin,
            referer: event.headers.referer,
            'user-agent': event.headers['user-agent']
          } 
        } : {})
      }));
      
      return result;
    } catch (err) {
      // Still track performance even if there's an error
      const duration = Date.now() - start;
      
      console.log(JSON.stringify({
        type: 'performance',
        timestamp: new Date().toISOString(),
        function: functionName,
        requestId,
        duration,
        path: event.path,
        method: event.httpMethod,
        error: true,
        errorType: err.name,
        errorMessage: err.message
      }));
      
      // Re-throw the error to be handled by the function's error handler
      throw err;
    }
  };
};

/**
 * Creates an enhanced function handler that combines performance monitoring
 * with proper error handling and response formatting
 * 
 * @param {Function} handlerFn - The core function logic
 * @param {Object} options - Performance monitoring options
 * @returns {Function} Complete function handler with monitoring and error handling
 */
const createMonitoredHandler = (handlerFn, options = {}) => {
  const { error, logError } = require('./response');
  
  // The core handler that will be wrapped with performance monitoring
  const coreHandler = async (event, context) => {
    try {
      return await handlerFn(event, context);
    } catch (err) {
      // Log the error using our structured logger
      logError(options.functionName || context.functionName || 'unknown', err, {
        path: event.path,
        method: event.httpMethod
      });
      
      // Return a properly formatted error response
      return error(`Operation failed: ${err.message}`, 500, event);
    }
  };
  
  // Wrap the core handler with performance monitoring
  return createPerformanceMiddleware(coreHandler, options);
};

module.exports = {
  createPerformanceMiddleware,
  createMonitoredHandler
};