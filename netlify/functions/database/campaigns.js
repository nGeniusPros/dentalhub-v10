const { initSupabase } = require('../utils/supabase');
const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');

/**
 * Campaigns API - Handles CRUD operations for campaigns
 * 
 * Endpoints:
 * - GET /api/database/campaigns - List all campaigns
 * - GET /api/database/campaigns/:id - Get a specific campaign
 * - POST /api/database/campaigns - Create a new campaign
 * - PUT /api/database/campaigns/:id - Update a campaign
 * - DELETE /api/database/campaigns/:id - Delete a campaign
 */
exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  

  try {
    const supabase = initSupabase();
    const path = event.path.split('/').filter(Boolean);
    const resourceId = path[path.length - 1] !== 'campaigns' ? path[path.length - 1] : null;
    
    // Extract query parameters
    const queryParams = event.queryStringParameters || {};
    const { 
      page = '1', 
      per_page = '20',
      status,
      campaign_type,
      created_by,
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
          // Get specific campaign
          const { data: campaign, error: getError } = await supabase
            .from('campaigns')
            .select(`
              *,
              creator:profiles(id, first_name, last_name, avatar_url),
              prospects:prospect_campaigns(prospect:prospects(*))
            `)
            .eq('id', resourceId)
            .single();
          
          if (getError) throw getError;
          if (!campaign) return errorResponse('Campaign not found', 404, event);
          
          return successResponse(campaign, 200, event);
        } else {
          // List campaigns with filters
          let query = supabase
            .from('campaigns')
            .select(`
              *,
              creator:profiles!campaigns_created_by_fkey(id, first_name, last_name, avatar_url),
              prospect_count:prospect_campaigns(count)
            `, { count: 'exact' });
          
          // Apply filters
          if (status) query = query.eq('status', status);
          if (campaign_type) query = query.eq('campaign_type', campaign_type);
          if (created_by) query = query.eq('created_by', created_by);
          
          // Apply search if provided
          if (search) {
            query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
          }
          
          // Apply sorting
          query = query.order(sort_by, { ascending: sort_order === 'asc' });
          
          // Apply pagination
          query = query.range(start, end);
          
          const { data: campaigns, error: listError, count } = await query;
          
          if (listError) throw listError;
          
          return successResponse({
            data: campaigns,
            pagination: {
              total: count,
              page: pageNum,
              per_page: perPage,
              total_pages: Math.ceil(count / perPage)
            }
          }, 200, event);
        }
        
      case 'POST':
        // Create campaign
        const body = JSON.parse(event.body);
        
        // Validate required fields
        const requiredFields = ['name', 'campaign_type'];
        const validationError = validateRequiredFields(body, requiredFields);
        if (validationError) {
          return errorResponse(validationError, 400, event);
        }
        
        // Add timestamps
        const now = new Date().toISOString();
        body.created_at = now;
        body.updated_at = now;
        
        const { data: newCampaign, error: createError } = await supabase
          .from('campaigns')
          .insert(body)
          .select();
        
        if (createError) throw createError;
        
        return successResponse(newCampaign[0], 201, event);
        
      case 'PUT':
        if (!resourceId) {
          return errorResponse('Campaign ID is required', 400, event);
        }
        
        const updateBody = JSON.parse(event.body);
        
        // Update timestamp
        updateBody.updated_at = new Date().toISOString();
        
        const { data: updatedCampaign, error: updateError } = await supabase
          .from('campaigns')
          .update(updateBody)
          .eq('id', resourceId)
          .select();
        
        if (updateError) throw updateError;
        if (!updatedCampaign || updatedCampaign.length === 0) {
          return errorResponse('Campaign not found', 404, event);
        }
        
        return successResponse(updatedCampaign[0], 200, event);
        
      case 'DELETE':
        if (!resourceId) {
          return errorResponse('Campaign ID is required', 400, event);
        }
        
        const { error: deleteError } = await supabase
          .from('campaigns')
          .delete()
          .eq('id', resourceId);
        
        if (deleteError) throw deleteError;
        
        return successResponse({ message: 'Campaign deleted successfully' }, 200, event);
        
      default:
        return errorResponse('Method not allowed', 405, event);
    }
  } catch (err) {
    console.errorResponse('Error in campaigns function:', err);
    return errorResponse(`Function error: ${err.message}`, 500, event);
  }
};
