const { initSupabase } = require('../utils/supabase');
const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');

/**
 * Prospect Campaigns API - Handles operations for prospect-campaign relationships
 * 
 * Endpoints:
 * - GET /api/database/prospect-campaigns - List all prospect-campaign relationships
 * - GET /api/database/prospect-campaigns/:id - Get a specific relationship
 * - POST /api/database/prospect-campaigns - Create a new relationship
 * - PUT /api/database/prospect-campaigns/:id - Update a relationship
 * - DELETE /api/database/prospect-campaigns/:id - Delete a relationship
 * - GET /api/database/prospect-campaigns/prospect/:prospectId - Get campaigns for a prospect
 * - GET /api/database/prospect-campaigns/campaign/:campaignId - Get prospects for a campaign
 */
exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  

  try {
    const supabase = initSupabase();
    const path = event.path.split('/').filter(Boolean);
    const resourceType = path[path.length - 2]; // 'prospect-campaigns', 'prospect', or 'campaign'
    const resourceId = path[path.length - 1];
    
    // Extract query parameters
    const queryParams = event.queryStringParameters || {};
    const { 
      page = '1', 
      per_page = '20',
      status,
      sort_by = 'assigned_at',
      sort_order = 'desc'
    } = queryParams;
    
    // Parse pagination parameters
    const pageNum = parseInt(page, 10);
    const perPage = parseInt(per_page, 10);
    const start = (pageNum - 1) * perPage;
    const end = start + perPage - 1;

    switch (event.httpMethod) {
      case 'GET':
        // Special routes for getting campaigns by prospect or prospects by campaign
        if (resourceType === 'prospect' && resourceId) {
          // Get campaigns for a specific prospect
          let query = supabase
            .from('prospect_campaigns')
            .select(`
              id,
              status,
              assigned_at,
              campaign:campaigns(*)
            `, { count: 'exact' })
            .eq('prospect_id', resourceId);
          
          // Apply status filter if provided
          if (status) query = query.eq('status', status);
          
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
        else if (resourceType === 'campaign' && resourceId) {
          // Get prospects for a specific campaign
          let query = supabase
            .from('prospect_campaigns')
            .select(`
              id,
              status,
              assigned_at,
              prospect:prospects(*)
            `, { count: 'exact' })
            .eq('campaign_id', resourceId);
          
          // Apply status filter if provided
          if (status) query = query.eq('status', status);
          
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
        else if (resourceType === 'prospect-campaigns' && resourceId && resourceId !== 'prospect-campaigns') {
          // Get specific prospect-campaign relationship
          const { data: relationship, error: getError } = await supabase
            .from('prospect_campaigns')
            .select(`
              *,
              prospect:prospects(*),
              campaign:campaigns(*)
            `)
            .eq('id', resourceId)
            .single();
          
          if (getError) throw getError;
          if (!relationship) return errorResponse('Relationship not found', 404, event);
          
          return successResponse(relationship, 200, event);
        } 
        else {
          // List all prospect-campaign relationships
          let query = supabase
            .from('prospect_campaigns')
            .select(`
              *,
              prospect:prospects(id, first_name, last_name),
              campaign:campaigns(id, name)
            `, { count: 'exact' });
          
          // Apply status filter if provided
          if (status) query = query.eq('status', status);
          
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
        // Create prospect-campaign relationship
        const body = JSON.parse(event.body);
        
        // Validate required fields
        const requiredFields = ['prospect_id', 'campaign_id'];
        const validationError = validateRequiredFields(body, requiredFields);
        if (validationError) {
          return errorResponse(validationError, 400, event);
        }
        
        // Add timestamps
        const now = new Date().toISOString();
        body.assigned_at = body.assigned_at || now;
        body.created_at = now;
        body.updated_at = now;
        
        const { data: newRelationship, error: createError } = await supabase
          .from('prospect_campaigns')
          .insert(body)
          .select();
        
        if (createError) {
          // Check if it's a unique constraint error
          if (createError.code === '23505') {
            return errorResponse('This prospect is already assigned to this campaign', 409, event);
          }
          throw createError;
        }
        
        return successResponse(newRelationship[0], 201, event);
        
      case 'PUT':
        if (!resourceId || resourceId === 'prospect-campaigns') {
          return errorResponse('Relationship ID is required', 400, event);
        }
        
        const updateBody = JSON.parse(event.body);
        
        // Update timestamp
        updateBody.updated_at = new Date().toISOString();
        
        const { data: updatedRelationship, error: updateError } = await supabase
          .from('prospect_campaigns')
          .update(updateBody)
          .eq('id', resourceId)
          .select();
        
        if (updateError) throw updateError;
        if (!updatedRelationship || updatedRelationship.length === 0) {
          return errorResponse('Relationship not found', 404, event);
        }
        
        return successResponse(updatedRelationship[0], 200, event);
        
      case 'DELETE':
        if (!resourceId || resourceId === 'prospect-campaigns') {
          return errorResponse('Relationship ID is required', 400, event);
        }
        
        const { error: deleteError } = await supabase
          .from('prospect_campaigns')
          .delete()
          .eq('id', resourceId);
        
        if (deleteError) throw deleteError;
        
        return successResponse({ message: 'Relationship deleted successfully' }, 200, event);
        
      default:
        return errorResponse('Method not allowed', 405, event);
    }
  } catch (err) {
    console.errorResponse('Error in prospect-campaigns function:', err);
    return errorResponse(`Function error: ${err.message}`, 500, event);
  }
};
