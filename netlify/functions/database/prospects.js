const { initSupabase } = require('../utils/supabase');
const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');

/**
 * Prospects API - Handles CRUD operations for prospects
 * 
 * Endpoints:
 * - GET /api/database/prospects - List all prospects
 * - GET /api/database/prospects/:id - Get a specific prospect
 * - POST /api/database/prospects - Create a new prospect
 * - PUT /api/database/prospects/:id - Update a prospect
 * - DELETE /api/database/prospects/:id - Delete a prospect
 */
exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  

  try {
    const supabase = initSupabase();
    const path = event.path.split('/').filter(Boolean);
    const resourceId = path[path.length - 1] !== 'prospects' ? path[path.length - 1] : null;
    
    // Extract query parameters
    const queryParams = event.queryStringParameters || {};
    const { 
      page = '1', 
      per_page = '20',
      status,
      lead_source,
      assignee_id,
      location_id,
      search,
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
          // Get specific prospect
          const { data: prospect, error: getError } = await supabase
            .from('prospects')
            .select(`
              *,
              assignee:profiles(*),
              location:locations(*),
              tags:prospect_tags(tag:tags(*)),
              campaigns:prospect_campaigns(campaign:campaigns(*))
            `)
            .eq('id', resourceId)
            .single();
          
          if (getError) throw getError;
          if (!prospect) return errorResponse('Prospect not found', 404, event);
          
          return successResponse(prospect, 200, event);
        } else {
          // List prospects with filters
          let query = supabase
            .from('prospects')
            .select(`
              *,
              assignee:profiles!prospects_assignee_id_fkey(id, first_name, last_name, avatar_url),
              location:locations!prospects_location_id_fkey(id, name),
              tags:prospect_tags(tag:tags(*))
            `, { count: 'exact' });
          
          // Apply filters
          if (status) query = query.eq('status', status);
          if (lead_source) query = query.eq('lead_source', lead_source);
          if (assignee_id) query = query.eq('assignee_id', assignee_id);
          if (location_id) query = query.eq('location_id', location_id);
          
          // Apply search if provided
          if (search) {
            query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
          }
          
          // Apply sorting
          query = query.order(sort_by, { ascending: sort_order === 'asc' });
          
          // Apply pagination
          query = query.range(start, end);
          
          const { data: prospects, error: listError, count } = await query;
          
          if (listError) throw listError;
          
          return successResponse({
            data: prospects,
            pagination: {
              total: count,
              page: pageNum,
              per_page: perPage,
              total_pages: Math.ceil(count / perPage)
            }
          }, 200, event);
        }
        
      case 'POST':
        // Create prospect
        const body = JSON.parse(event.body);
        
        // Validate required fields
        const requiredFields = ['first_name', 'last_name'];
        const validationError = validateRequiredFields(body, requiredFields);
        if (validationError) {
          return errorResponse(validationError, 400, event);
        }
        
        // Add timestamps
        const now = new Date().toISOString();
        body.created_at = now;
        body.updated_at = now;
        
        const { data: newProspect, error: createError } = await supabase
          .from('prospects')
          .insert(body)
          .select();
        
        if (createError) throw createError;
        
        return successResponse(newProspect[0], 201, event);
        
      case 'PUT':
        if (!resourceId) {
          return errorResponse('Prospect ID is required', 400, event);
        }
        
        const updateBody = JSON.parse(event.body);
        
        // Update timestamp
        updateBody.updated_at = new Date().toISOString();
        
        const { data: updatedProspect, error: updateError } = await supabase
          .from('prospects')
          .update(updateBody)
          .eq('id', resourceId)
          .select();
        
        if (updateError) throw updateError;
        if (!updatedProspect || updatedProspect.length === 0) {
          return errorResponse('Prospect not found', 404, event);
        }
        
        return successResponse(updatedProspect[0], 200, event);
        
      case 'DELETE':
        if (!resourceId) {
          return errorResponse('Prospect ID is required', 400, event);
        }
        
        const { error: deleteError } = await supabase
          .from('prospects')
          .delete()
          .eq('id', resourceId);
        
        if (deleteError) throw deleteError;
        
        return successResponse({ message: 'Prospect deleted successfully' }, 200, event);
        
      default:
        return errorResponse('Method not allowed', 405, event);
    }
  } catch (err) {
    console.errorResponse('Error in prospects function:', err);
    return errorResponse(`Function error: ${err.message}`, 500, event);
  }
};
