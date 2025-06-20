const { initSupabase } = require('../utils/supabase');
const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');

/**
 * Tags API - Handles CRUD operations for tags
 * 
 * Endpoints:
 * - GET /api/database/tags - List all tags
 * - GET /api/database/tags/:id - Get a specific tag
 * - POST /api/database/tags - Create a new tag
 * - PUT /api/database/tags/:id - Update a tag
 * - DELETE /api/database/tags/:id - Delete a tag
 */
exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  

  try {
    const supabase = initSupabase();
    const path = event.path.split('/').filter(Boolean);
    const resourceId = path[path.length - 1] !== 'tags' ? path[path.length - 1] : null;
    
    // Extract query parameters
    const queryParams = event.queryStringParameters || {};
    const { 
      page = '1', 
      per_page = '50',
      search,
      sort_by = 'name',
      sort_order = 'asc'
    } = queryParams;
    
    // Parse pagination parameters
    const pageNum = parseInt(page, 10);
    const perPage = parseInt(per_page, 10);
    const start = (pageNum - 1) * perPage;
    const end = start + perPage - 1;

    switch (event.httpMethod) {
      case 'GET':
        if (resourceId) {
          // Get specific tag
          const { data: tag, error: getError } = await supabase
            .from('tags')
            .select(`
              *,
              prospects:prospect_tags(prospect:prospects(id, first_name, last_name))
            `)
            .eq('id', resourceId)
            .single();
          
          if (getError) throw getError;
          if (!tag) return errorResponse('Tag not found', 404, event);
          
          return successResponse(tag, 200, event);
        } else {
          // List tags with filters
          let query = supabase
            .from('tags')
            .select(`
              *,
              prospect_count:prospect_tags(count)
            `, { count: 'exact' });
          
          // Apply search if provided
          if (search) {
            query = query.ilike('name', `%${search}%`);
          }
          
          // Apply sorting
          query = query.order(sort_by, { ascending: sort_order === 'asc' });
          
          // Apply pagination
          query = query.range(start, end);
          
          const { data: tags, error: listError, count } = await query;
          
          if (listError) throw listError;
          
          return successResponse({
            data: tags,
            pagination: {
              total: count,
              page: pageNum,
              per_page: perPage,
              total_pages: Math.ceil(count / perPage)
            }
          }, 200, event);
        }
        
      case 'POST':
        // Create tag
        const body = JSON.parse(event.body);
        
        // Validate required fields
        const requiredFields = ['name'];
        const validationError = validateRequiredFields(body, requiredFields);
        if (validationError) {
          return errorResponse(validationError, 400, event);
        }
        
        // Add timestamps
        const now = new Date().toISOString();
        body.created_at = now;
        
        const { data: newTag, error: createError } = await supabase
          .from('tags')
          .insert(body)
          .select();
        
        if (createError) {
          // Check if it's a unique constraint error
          if (createError.code === '23505') {
            return errorResponse('A tag with this name already exists', 409, event);
          }
          throw createError;
        }
        
        return successResponse(newTag[0], 201, event);
        
      case 'PUT':
        if (!resourceId) {
          return errorResponse('Tag ID is required', 400, event);
        }
        
        const updateBody = JSON.parse(event.body);
        
        const { data: updatedTag, error: updateError } = await supabase
          .from('tags')
          .update(updateBody)
          .eq('id', resourceId)
          .select();
        
        if (updateError) {
          // Check if it's a unique constraint error
          if (updateError.code === '23505') {
            return errorResponse('A tag with this name already exists', 409, event);
          }
          throw updateError;
        }
        
        if (!updatedTag || updatedTag.length === 0) {
          return errorResponse('Tag not found', 404, event);
        }
        
        return successResponse(updatedTag[0], 200, event);
        
      case 'DELETE':
        if (!resourceId) {
          return errorResponse('Tag ID is required', 400, event);
        }
        
        const { error: deleteError } = await supabase
          .from('tags')
          .delete()
          .eq('id', resourceId);
        
        if (deleteError) throw deleteError;
        
        return successResponse({ message: 'Tag deleted successfully' }, 200, event);
        
      default:
        return errorResponse('Method not allowed', 405, event);
    }
  } catch (err) {
    console.errorResponse('Error in tags function:', err);
    return errorResponse(`Function error: ${err.message}`, 500, event);
  }
};
