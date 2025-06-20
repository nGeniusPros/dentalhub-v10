const { initSupabase } = require('../utils/supabase');
const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');

/**
 * Prospect Tags API - Handles operations for prospect-tag relationships
 * 
 * Endpoints:
 * - GET /api/database/prospect-tags - List all prospect-tag relationships
 * - GET /api/database/prospect-tags/:id - Get a specific relationship
 * - POST /api/database/prospect-tags - Create a new relationship
 * - DELETE /api/database/prospect-tags/:id - Delete a relationship
 * - GET /api/database/prospect-tags/prospect/:prospectId - Get tags for a prospect
 * - GET /api/database/prospect-tags/tag/:tagId - Get prospects for a tag
 */
exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  

  try {
    const supabase = initSupabase();
    const path = event.path.split('/').filter(Boolean);
    const resourceType = path[path.length - 2]; // 'prospect-tags', 'prospect', or 'tag'
    const resourceId = path[path.length - 1];
    
    // Extract query parameters
    const queryParams = event.queryStringParameters || {};
    const { 
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
        // Special routes for getting tags by prospect or prospects by tag
        if (resourceType === 'prospect' && resourceId) {
          // Get tags for a specific prospect
          let query = supabase
            .from('prospect_tags')
            .select(`
              id,
              created_at,
              tag:tags(*)
            `, { count: 'exact' })
            .eq('prospect_id', resourceId);
          
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
        else if (resourceType === 'tag' && resourceId) {
          // Get prospects for a specific tag
          let query = supabase
            .from('prospect_tags')
            .select(`
              id,
              created_at,
              prospect:prospects(*)
            `, { count: 'exact' })
            .eq('tag_id', resourceId);
          
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
        else if (resourceType === 'prospect-tags' && resourceId && resourceId !== 'prospect-tags') {
          // Get specific prospect-tag relationship
          const { data: relationship, error: getError } = await supabase
            .from('prospect_tags')
            .select(`
              *,
              prospect:prospects(*),
              tag:tags(*)
            `)
            .eq('id', resourceId)
            .single();
          
          if (getError) throw getError;
          if (!relationship) return errorResponse('Relationship not found', 404, event);
          
          return successResponse(relationship, 200, event);
        } 
        else {
          // List all prospect-tag relationships
          let query = supabase
            .from('prospect_tags')
            .select(`
              *,
              prospect:prospects(id, first_name, last_name),
              tag:tags(id, name)
            `, { count: 'exact' });
          
          // Apply sorting
          query = query.order(sort_by, { ascending: sort_order === 'asc' });
          
          // Apply pagination
          query = query.range(start, end);
          
          const { data: relationships, error: listError, count } = await query;
          
          if (listError) throw listError;
          
          return successResponse({
            data: relationships,
            pagination: {
              total: count,
              page: pageNum,
              per_page: perPage,
              total_pages: Math.ceil(count / perPage)
            }
          }, 200, event);
        }
        
      case 'POST':
        // Create prospect-tag relationship
        const body = JSON.parse(event.body);
        
        // Validate required fields
        const requiredFields = ['prospect_id', 'tag_id'];
        const validationError = validateRequiredFields(body, requiredFields);
        if (validationError) {
          return errorResponse(validationError, 400, event);
        }
        
        // Add timestamp
        body.created_at = new Date().toISOString();
        
        const { data: newRelationship, error: createError } = await supabase
          .from('prospect_tags')
          .insert(body)
          .select();
        
        if (createError) {
          // Check if it's a unique constraint error
          if (createError.code === '23505') {
            return errorResponse('This prospect already has this tag', 409, event);
          }
          throw createError;
        }
        
        return successResponse(newRelationship[0], 201, event);
        
      case 'DELETE':
        if (!resourceId || resourceId === 'prospect-tags') {
          return errorResponse('Relationship ID is required', 400, event);
        }
        
        const { error: deleteError } = await supabase
          .from('prospect_tags')
          .delete()
          .eq('id', resourceId);
        
        if (deleteError) throw deleteError;
        
        return successResponse({ message: 'Relationship deleted successfully' }, 200, event);
        
      default:
        return errorResponse('Method not allowed', 405, event);
    }
  } catch (err) {
    console.errorResponse('Error in prospect-tags function:', err);
    return errorResponse(`Function error: ${err.message}`, 500, event);
  }
};
