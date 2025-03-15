import { supabaseClient } from '../supabaseClient';
import { Tag } from './tagService';

// Define interfaces for Prospect data
export interface Prospect {
  id: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
  status?: string | null;
  lead_source?: string | null;
  interest_level?: string | null;
  notes?: string | null;
  assignee_id?: string | null;
  location_id?: string | null;
  created_at: string;
  updated_at?: string | null;
  last_contacted?: string | null;
  tags?: Tag[];
  campaign_assignments?: {
    campaign_id: string;
    campaign_name: string;
    created_at: string;
  }[];
}

// Filter options for prospect queries
export interface ProspectFilter {
  search?: string;
  status?: string;
  tag?: string;
  campaign?: string;
  assignee?: string;
  locationId?: string;
  page?: number;
  pageSize?: number;
}

// Import options
export interface ImportOptions {
  duplicateHandling: 'skip' | 'update' | 'create_new';
  assignCampaign?: string | null;
  assignTags?: string[] | null;
  assignUser?: string | null;
  locationId?: string | null;
}

// Import request
export interface ImportRequest {
  prospects: Partial<Prospect>[];
  options: ImportOptions;
}

// Assignment requests
export interface CampaignAssignmentRequest {
  prospectIds: string[];
  campaignId: string;
}

export interface TagAssignmentRequest {
  prospectIds: string[];
  tagIds: string[];
}

export interface UserAssignmentRequest {
  prospectIds: string[];
  userId: string;
}

// Prospect API methods
const prospectApi = {
  // Get a list of prospects with filtering, pagination, and related data
  getProspects: async (filters?: ProspectFilter) => {
    try {
      let query = supabaseClient
        .from('prospects')
        .select(`
          *,
          tags:prospect_tags(tag_id, tag:tags(id, name)),
          campaign_assignments:prospect_campaigns(campaign_id, campaign:campaigns(id, name))
        `);
      
      // Apply filters
      if (filters) {
        // Location filter (always applied if provided)
        if (filters.locationId) {
          query = query.eq('location_id', filters.locationId);
        }
        
        // Search across multiple fields
        if (filters.search) {
          const searchTerm = `%${filters.search}%`;
          query = query.or(
            `first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},email.ilike.${searchTerm},phone.ilike.${searchTerm}`
          );
        }
        
        // Status filter
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        
        // Assignee filter
        if (filters.assignee) {
          query = query.eq('assignee_id', filters.assignee);
        }
      }
      
      // Count before applying pagination
      const { count, error: countError } = await query.count();
      
      if (countError) throw countError;
      
      // Apply pagination
      if (filters?.page && filters?.pageSize) {
        const from = (filters.page - 1) * filters.pageSize;
        const to = from + filters.pageSize - 1;
        query = query.range(from, to);
      }
      
      // Order by most recently created first
      query = query.order('created_at', { ascending: false });
      
      // Execute query
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Process the data to transform nested structures
      const processedData = data?.map(prospect => {
        // Transform tags from array of objects to array of tag objects
        const tags = prospect.tags?.map((tag: any) => tag.tag) || [];
        
        // Transform campaign assignments
        const campaignAssignments = prospect.campaign_assignments?.map((assignment: any) => ({
          campaign_id: assignment.campaign_id,
          campaign_name: assignment.campaign?.name || 'Unknown Campaign',
          created_at: assignment.created_at
        })) || [];
        
        return {
          ...prospect,
          tags,
          campaign_assignments: campaignAssignments
        };
      });
      
      return { 
        data: { 
          prospects: processedData, 
          total: count || 0 
        },
        error: null 
      };
    } catch (error) {
      console.error('Error fetching prospects:', error);
      return { data: null, error };
    }
  },
  
  // Get a single prospect by ID with related data
  getProspectById: async (id: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('prospects')
        .select(`
          *,
          tags:prospect_tags(tag_id, tag:tags(id, name)),
          campaign_assignments:prospect_campaigns(campaign_id, campaign:campaigns(id, name))
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Process the data to transform nested structures
      if (data) {
        // Transform tags from array of objects to array of tag objects
        const tags = data.tags?.map((tag: any) => tag.tag) || [];
        
        // Transform campaign assignments
        const campaignAssignments = data.campaign_assignments?.map((assignment: any) => ({
          campaign_id: assignment.campaign_id,
          campaign_name: assignment.campaign?.name || 'Unknown Campaign',
          created_at: assignment.created_at
        })) || [];
        
        return { 
          data: {
            ...data,
            tags,
            campaign_assignments: campaignAssignments
          }, 
          error: null 
        };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching prospect:', error);
      return { data: null, error };
    }
  },
  
  // Create a new prospect
  createProspect: async (prospect: Partial<Prospect>) => {
    try {
      const { data, error } = await supabaseClient
        .from('prospects')
        .insert([{
          ...prospect,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: prospect.status || 'new'
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // If tags were provided, assign them
      if (prospect.tags && prospect.tags.length > 0 && data) {
        await prospectApi.assignTags({
          prospectIds: [data.id],
          tagIds: prospect.tags.map(tag => typeof tag === 'string' ? tag : tag.id)
        });
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error creating prospect:', error);
      return { data: null, error };
    }
  },
  
  // Update an existing prospect
  updateProspect: async (id: string, prospect: Partial<Prospect>) => {
    try {
      // Remove tags from the data as they're handled separately
      const { tags, campaign_assignments, ...prospectData } = prospect;
      
      const { data, error } = await supabaseClient
        .from('prospects')
        .update({
          ...prospectData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Handle tags update if provided
      if (tags && data) {
        // First, remove all existing tags
        await supabaseClient
          .from('prospect_tags')
          .delete()
          .eq('prospect_id', id);
        
        // Then add the new tags
        if (tags.length > 0) {
          await prospectApi.assignTags({
            prospectIds: [id],
            tagIds: tags.map(tag => typeof tag === 'string' ? tag : tag.id)
          });
        }
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating prospect:', error);
      return { data: null, error };
    }
  },
  
  // Delete a prospect
  deleteProspect: async (id: string) => {
    try {
      // First remove any related records
      await Promise.all([
        supabaseClient.from('prospect_tags').delete().eq('prospect_id', id),
        supabaseClient.from('prospect_campaigns').delete().eq('prospect_id', id)
      ]);
      
      // Then delete the prospect
      const { data, error } = await supabaseClient
        .from('prospects')
        .delete()
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error deleting prospect:', error);
      return { data: null, error };
    }
  },
  
  // Import prospects from file
  importProspects: async (request: ImportRequest) => {
    try {
      const { prospects, options } = request;
      
      if (!prospects || prospects.length === 0) {
        throw new Error('No prospects to import');
      }
      
      // Initialize results
      const results = {
        imported: 0,
        updated: 0,
        skipped: 0,
        errors: [] as string[]
      };
      
      // Process each prospect
      for (const prospect of prospects) {
        try {
          // Check for required fields
          if (!prospect.first_name || !prospect.last_name) {
            results.errors.push(`Missing required fields for prospect: ${prospect.email || prospect.phone || 'Unknown'}`);
            continue;
          }
          
          // Prepare data for insert/update
          const prospectData = {
            ...prospect,
            status: prospect.status || 'new',
            location_id: options.locationId || null,
            assignee_id: options.assignUser || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          // Check for duplicates based on email or phone
          let existingProspect = null;
          if (prospect.email) {
            const { data } = await supabaseClient
              .from('prospects')
              .select('id')
              .eq('email', prospect.email)
              .maybeSingle();
            
            existingProspect = data;
          }
          
          if (!existingProspect && prospect.phone) {
            const { data } = await supabaseClient
              .from('prospects')
              .select('id')
              .eq('phone', prospect.phone)
              .maybeSingle();
            
            existingProspect = data;
          }
          
          // Handle based on duplicate strategy
          let newProspectId: string | null = null;
          
          if (existingProspect) {
            // Handle duplicate
            switch (options.duplicateHandling) {
              case 'skip':
                results.skipped++;
                continue;
              
              case 'update':
                const { data: updatedData, error: updateError } = await supabaseClient
                  .from('prospects')
                  .update(prospectData)
                  .eq('id', existingProspect.id)
                  .select('id')
                  .single();
                
                if (updateError) throw updateError;
                
                newProspectId = updatedData.id;
                results.updated++;
                break;
              
              case 'create_new':
                // Fall through to create new
                break;
            }
          }
          
          // Create new if no duplicate or if strategy is create_new
          if (!newProspectId) {
            const { data: insertedData, error: insertError } = await supabaseClient
              .from('prospects')
              .insert([prospectData])
              .select('id')
              .single();
            
            if (insertError) throw insertError;
            
            newProspectId = insertedData.id;
            results.imported++;
          }
          
          // Add to campaign if specified
          if (options.assignCampaign && newProspectId) {
            await prospectApi.assignCampaign({
              prospectIds: [newProspectId],
              campaignId: options.assignCampaign
            });
          }
          
          // Add tags if specified
          if (options.assignTags && options.assignTags.length > 0 && newProspectId) {
            await prospectApi.assignTags({
              prospectIds: [newProspectId],
              tagIds: options.assignTags
            });
          }
        } catch (prospectError: any) {
          results.errors.push(
            `Error processing prospect ${prospect.email || prospect.phone || 'Unknown'}: ${prospectError.message || 'Unknown error'}`
          );
        }
      }
      
      return { data: results, error: null };
    } catch (error: any) {
      console.error('Error importing prospects:', error);
      return { 
        data: null, 
        error: { message: error.message || 'Failed to import prospects' } 
      };
    }
  },
  
  // Assign campaign to prospects
  assignCampaign: async (request: CampaignAssignmentRequest) => {
    try {
      const { prospectIds, campaignId } = request;
      
      if (!prospectIds || prospectIds.length === 0) {
        throw new Error('No prospects specified');
      }
      
      // Create batch assignments
      const assignments = prospectIds.map(prospectId => ({
        prospect_id: prospectId,
        campaign_id: campaignId,
        created_at: new Date().toISOString()
      }));
      
      const { data, error } = await supabaseClient
        .from('prospect_campaigns')
        .upsert(assignments, {
          onConflict: 'prospect_id,campaign_id',
          ignoreDuplicates: true
        });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error assigning campaign:', error);
      return { data: null, error };
    }
  },
  
  // Assign tags to prospects
  assignTags: async (request: TagAssignmentRequest) => {
    try {
      const { prospectIds, tagIds } = request;
      
      if (!prospectIds || prospectIds.length === 0 || !tagIds || tagIds.length === 0) {
        throw new Error('No prospects or tags specified');
      }
      
      // Create all combinations of prospect and tag
      const assignments = [];
      for (const prospectId of prospectIds) {
        for (const tagId of tagIds) {
          assignments.push({
            prospect_id: prospectId,
            tag_id: tagId,
            created_at: new Date().toISOString()
          });
        }
      }
      
      const { data, error } = await supabaseClient
        .from('prospect_tags')
        .upsert(assignments, {
          onConflict: 'prospect_id,tag_id',
          ignoreDuplicates: true
        });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error assigning tags:', error);
      return { data: null, error };
    }
  },
  
  // Assign prospects to a user
  assignToUser: async (request: UserAssignmentRequest) => {
    try {
      const { prospectIds, userId } = request;
      
      if (!prospectIds || prospectIds.length === 0) {
        throw new Error('No prospects specified');
      }
      
      // Update all prospects with the new assignee
      const { data, error } = await supabaseClient
        .from('prospects')
        .update({ 
          assignee_id: userId,
          updated_at: new Date().toISOString()
        })
        .in('id', prospectIds);
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error assigning user:', error);
      return { data: null, error };
    }
  },
  
  // Remove a tag from a prospect
  removeTag: async (prospectId: string, tagId: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('prospect_tags')
        .delete()
        .eq('prospect_id', prospectId)
        .eq('tag_id', tagId);
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error removing tag:', error);
      return { data: null, error };
    }
  },
  
  // Remove a prospect from a campaign
  removeFromCampaign: async (prospectId: string, campaignId: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('prospect_campaigns')
        .delete()
        .eq('prospect_id', prospectId)
        .eq('campaign_id', campaignId);
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error removing from campaign:', error);
      return { data: null, error };
    }
  }
};

export default prospectApi;