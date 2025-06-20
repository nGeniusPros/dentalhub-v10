/**
 * Main router for dashboard API endpoints
 * 
 * This function routes requests to the appropriate dashboard handler
 * based on the path. It centralizes error handling and response formatting.
 */
const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');
const revenueHandler = require('./revenue');
const monthlyReportHandler = require('./monthly-report');
const activePatientsHandler = require('./active-patients');
const treatmentSuccessHandler = require('./treatment-success');
const patientSatisfactionHandler = require('./patient-satisfaction');
const dailyHuddleHandler = require('./daily-huddle');

exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  

  try {
    // Extract path and parameters
    const path = event.path.replace('/api/dashboard/', '').replace(/^\/+/, '');
    const params = event.httpMethod === 'GET' 
      ? event.queryStringParameters || {} 
      : JSON.parse(event.body || '{}');
    
    // Route to appropriate handler based on path
    switch (path) {
      case 'revenue':
        return await revenueHandler.handler(event, context);
      case 'monthly-report':
        return await monthlyReportHandler.handler(event, context);
      case 'active-patients':
        return await activePatientsHandler.handler(event, context);
      case 'treatment-success':
        return await treatmentSuccessHandler.handler(event, context);
      case 'patient-satisfaction':
        return await patientSatisfactionHandler.handler(event, context);
      case 'daily-huddle':
        return await dailyHuddleHandler.handler(event, context);
      default:
        return errorResponse('Endpoint not found', 404, event);
    }
  } catch (err) {
    console.errorResponse('Error in dashboard function:', err);
    return errorResponse(`Function error: ${err.message}`, 500, event);
  }
};
