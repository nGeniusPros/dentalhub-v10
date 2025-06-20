const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');

/**
 * Database API Router
 * 
 * This function routes database requests to the appropriate handler based on the path.
 * It serves as the main entry point for all database operations in production.
 * 
 * Supported resources:
 * - prospects
 * - campaigns
 * - tags
 * - prospect-campaigns
 * - prospect-tags
 * - profiles
 */
exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  

  try {
    // Parse the path to determine which resource is being requested
    const path = event.path.split('/').filter(Boolean);
    
    // The resource should be the first segment after 'database'
    const databaseIndex = path.findIndex(segment => segment === 'database');
    const resourceType = path[databaseIndex + 1];
    
    // Route to the appropriate handler based on the resource type
    switch (resourceType) {
      case 'prospects':
        return require('./prospects').handler(event, context);
      
      case 'campaigns':
        return require('./campaigns').handler(event, context);
      
      case 'tags':
        return require('./tags').handler(event, context);
      
      case 'prospect-campaigns':
        return require('./prospect-campaigns').handler(event, context);
      
      case 'prospect-tags':
        return require('./prospect-tags').handler(event, context);
      
      case 'profiles':
        return require('./profiles').handler(event, context);
      
      default:
        return errorResponse(`Unknown resource type: ${resourceType}`, 404, event);
    }
  } catch (err) {
    console.errorResponse('Error in database router:', err);
    return errorResponse(`Router error: ${err.message}`, 500, event);
  }
};
