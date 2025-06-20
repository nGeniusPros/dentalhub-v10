const { initSupabase } = require('../utils/supabase');
const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');

/**
 * Profiles API - Handles CRUD operations for user profiles
 * 
 * Endpoints:
 * - GET /api/database/profiles - List all profiles
 * - GET /api/database/profiles/:id - Get a specific profile
 * - POST /api/database/profiles - Create a new profile
 * - PUT /api/database/profiles/:id - Update a profile
 * - DELETE /api/database/profiles/:id - Delete a profile
 */
exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  

  try {
    const supabase = initSupabase();
    const path = event.path.split('/').filter(Boolean);
    const resourceId = path[path.length - 1] !== 'profiles' ? path[path.length - 1] : null;
    
    // Extract query parameters
    const queryParams = event.queryStringParameters || {};
    const { 
      page = '1', 
      per_page = '20',
      role,
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
          // Get specific profile
          const { data: profile, error: getError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', resourceId)
            .single();
          
          if (getError) throw getError;
          if (!profile) return errorResponse('Profile not found', 404, event);
          
          return successResponse(profile, 200, event);
        } else {
          // List profiles with filters
          let query = supabase
            .from('profiles')
            .select('*', { count: 'exact' });
          
          // Apply filters
          if (role) query = query.eq('role', role);
          
          // Apply search if provided
          if (search) {
            query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
          }
          
          // Apply sorting
          query = query.order(sort_by, { ascending: sort_order === 'asc' });
          
          // Apply pagination
          query = query.range(start, end);
          
          const { data: profiles, error: listError, count } = await query;
          
          if (listError) throw listError;
          
          return successResponse({
            data: profiles,
            pagination: {
              total: count,
              page: pageNum,
              per_page: perPage,
              total_pages: Math.ceil(count / perPage)
            }
          }, 200, event);
        }
        
      case 'POST':
        // Create profile
        const body = JSON.parse(event.body);
        
        // Validate required fields
        const requiredFields = ['id', 'email'];
        const validationError = validateRequiredFields(body, requiredFields);
        if (validationError) {
          return errorResponse(validationError, 400, event);
        }
        
        // Add timestamps
        const now = new Date().toISOString();
        body.created_at = now;
        body.updated_at = now;
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert(body)
          .select();
        
        if (createError) throw createError;
        
        return successResponse(newProfile[0], 201, event);
        
      case 'PUT':
        if (!resourceId) {
          return errorResponse('Profile ID is required', 400, event);
        }
        
        const updateBody = JSON.parse(event.body);
        
        // Update timestamp
        updateBody.updated_at = new Date().toISOString();
        
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update(updateBody)
          .eq('id', resourceId)
          .select();
        
        if (updateError) throw updateError;
        if (!updatedProfile || updatedProfile.length === 0) {
          return errorResponse('Profile not found', 404, event);
        }
        
        return successResponse(updatedProfile[0], 200, event);
        
      case 'DELETE':
        if (!resourceId) {
          return errorResponse('Profile ID is required', 400, event);
        }
        
        const { error: deleteError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', resourceId);
        
        if (deleteError) throw deleteError;
        
        return successResponse({ message: 'Profile deleted successfully' }, 200, event);
        
      default:
        return errorResponse('Method not allowed', 405, event);
    }
  } catch (err) {
    console.errorResponse('Error in profiles function:', err);
    return errorResponse(`Function error: ${err.message}`, 500, event);
  }
};
