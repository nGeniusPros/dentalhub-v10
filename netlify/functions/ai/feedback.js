const { initSupabase } = require('../utils/supabase');
const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');

/**
 * AI Feedback API - Handles operations for AI-generated feedback
 * 
 * Endpoints:
 * - POST /api/ai/feedback - Generate AI feedback for a prospect
 * - GET /api/ai/feedback/:id - Get specific AI feedback
 * - GET /api/ai/feedback - List AI feedback with filters
 */
exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  

  try {
    const supabase = initSupabase();
    const path = event.path.split('/').filter(Boolean);
    const resourceId = path[path.length - 1] !== 'feedback' ? path[path.length - 1] : null;
    
    // Extract query parameters
    const queryParams = event.queryStringParameters || {};
    const { 
      prospect_id,
      page = '1', 
      per_page = '20',
      sort_by = 'created_at',
      sort_order = 'desc'
    } = queryParams;
    
    // Parse pagination parameters
    const pageNum = parseInt(page, 10);
    const perPage = parseInt(per_page, 10);
    const start = (pageNum - 1) * perPage;
    const end = start + perPage - 1;

    switch (event.httpMethod) {
      case 'GET':
        if (resourceId) {
          // Get specific feedback
          const { data: feedback, error: getError } = await supabase
            .from('ai_feedback')
            .select('*')
            .eq('id', resourceId)
            .single();
          
          if (getError) throw getError;
          if (!feedback) return errorResponse('Feedback not found', 404, event);
          
          return successResponse(feedback, 200, event);
        } else {
          // List feedback with filters
          let query = supabase
            .from('ai_feedback')
            .select('*', { count: 'exact' });
          
          // Apply filters
          if (prospect_id) query = query.eq('prospect_id', prospect_id);
          
          // Apply sorting
          query = query.order(sort_by, { ascending: sort_order === 'asc' });
          
          // Apply pagination
          query = query.range(start, end);
          
          const { data: feedbackList, error: listError, count } = await query;
          
          if (listError) throw listError;
          
          return successResponse({
            data: feedbackList,
            pagination: {
              total: count,
              page: pageNum,
              per_page: perPage,
              total_pages: Math.ceil(count / perPage)
            }
          }, 200, event);
        }
        
      case 'POST':
        // Generate AI feedback
        const body = JSON.parse(event.body);
        
        // Validate required fields
        const requiredFields = ['prospect_id', 'content'];
        const validationError = validateRequiredFields(body, requiredFields);
        if (validationError) {
          return errorResponse(validationError, 400, event);
        }
        
        // Add timestamps
        const now = new Date().toISOString();
        body.created_at = now;
        body.updated_at = now;
        
        // Insert feedback
        const { data: newFeedback, error: createError } = await supabase
          .from('ai_feedback')
          .insert(body)
          .select();
        
        if (createError) throw createError;
        
        return successResponse(newFeedback[0], 201, event);
        
      case 'PUT':
        if (!resourceId) {
          return errorResponse('Feedback ID is required', 400, event);
        }
        
        const updateBody = JSON.parse(event.body);
        
        // Update timestamp
        updateBody.updated_at = new Date().toISOString();
        
        const { data: updatedFeedback, error: updateError } = await supabase
          .from('ai_feedback')
          .update(updateBody)
          .eq('id', resourceId)
          .select();
        
        if (updateError) throw updateError;
        if (!updatedFeedback || updatedFeedback.length === 0) {
          return errorResponse('Feedback not found', 404, event);
        }
        
        return successResponse(updatedFeedback[0], 200, event);
        
      case 'DELETE':
        if (!resourceId) {
          return errorResponse('Feedback ID is required', 400, event);
        }
        
        const { error: deleteError } = await supabase
          .from('ai_feedback')
          .delete()
          .eq('id', resourceId);
        
        if (deleteError) throw deleteError;
        
        return successResponse({ message: 'Feedback deleted successfully' }, 200, event);
        
      default:
        return errorResponse('Method not allowed', 405, event);
    }
  } catch (err) {
    console.errorResponse('Error in AI feedback function:', err);
    return errorResponse(`Function error: ${err.message}`, 500, event);
  }
};
