import { supabaseClient } from '../supabaseClient';

// Define interfaces for Campaign data
export interface Campaign {
  id: string;
  name: string;
  description?: string | null;
  status?: string | null;
  location_id?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface CampaignFilter {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

// Campaign API methods
const campaignApi = {
  // Get a list of campaigns with optional filtering
  getCampaigns: async (filters?: CampaignFilter) => {
    try {
      let query = supabaseClient
        .from('campaigns')
        .select('*');
      
      // Apply filters
      if (filters) {
        if (filters.search) {
          query = query.ilike('name', `%${filters.search}%`);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
      }
      
      // Add pagination
      if (filters?.page && filters?.pageSize) {
        const from = (filters.page - 1) * filters.pageSize;
        const to = from + filters.pageSize - 1;
        query = query.range(from, to);
      }
      
      // Sort by most recently created first
      query = query.order('created_at', { ascending: false });
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return { 
        data, 
        total: count || (data ? data.length : 0),
        error: null 
      };
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return { data: null, error };
    }
  },

  // Get a single campaign by ID
  getCampaignById: async (id: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching campaign:', error);
      return { data: null, error };
    }
  },

  // Create a new campaign
  createCampaign: async (campaign: Partial<Campaign>) => {
    try {
      const { data, error } = await supabaseClient
        .from('campaigns')
        .insert([{
          ...campaign,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error creating campaign:', error);
      return { data: null, error };
    }
  },

  // Update an existing campaign
  updateCampaign: async (id: string, campaign: Partial<Campaign>) => {
    try {
      const { data, error } = await supabaseClient
        .from('campaigns')
        .update({
          ...campaign,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating campaign:', error);
      return { data: null, error };
    }
  },

  // Delete a campaign
  deleteCampaign: async (id: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('campaigns')
        .delete()
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error deleting campaign:', error);
      return { data: null, error };
    }
  },

  // Get prospects for a campaign
  getCampaignProspects: async (campaignId: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('prospect_campaigns')
        .select('prospect:prospects(*)')
        .eq('campaign_id', campaignId);
      
      if (error) throw error;
      
      // Extract the prospects from the result
      const prospects = data ? data.map(item => item.prospect) : [];
      
      return { data: prospects, error: null };
    } catch (error) {
      console.error('Error fetching campaign prospects:', error);
      return { data: null, error };
    }
  },

  // Add a prospect to a campaign
  addProspectToCampaign: async (campaignId: string, prospectId: string) => {
    try {
      // Check if the relationship already exists
      const { data: existing } = await supabaseClient
        .from('prospect_campaigns')
        .select('id')
        .eq('campaign_id', campaignId)
        .eq('prospect_id', prospectId)
        .maybeSingle();
      
      if (existing) {
        // Relationship already exists, no need to create again
        return { data: existing, error: null };
      }
      
      // Create the relationship
      const { data, error } = await supabaseClient
        .from('prospect_campaigns')
        .insert([{
          campaign_id: campaignId,
          prospect_id: prospectId,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error adding prospect to campaign:', error);
      return { data: null, error };
    }
  },

  // Remove a prospect from a campaign
  removeProspectFromCampaign: async (campaignId: string, prospectId: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('prospect_campaigns')
        .delete()
        .eq('campaign_id', campaignId)
        .eq('prospect_id', prospectId)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error removing prospect from campaign:', error);
      return { data: null, error };
    }
  },
  
  // Add multiple prospects to a campaign
  addProspectsToCampaign: async (campaignId: string, prospectIds: string[]) => {
    try {
      // Format the data for batch insert
      const batch = prospectIds.map(prospectId => ({
        campaign_id: campaignId,
        prospect_id: prospectId,
        created_at: new Date().toISOString()
      }));
      
      const { data, error } = await supabaseClient
        .from('prospect_campaigns')
        .upsert(batch, { 
          onConflict: 'campaign_id,prospect_id',
          ignoreDuplicates: true 
        })
        .select();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error adding prospects to campaign:', error);
      return { data: null, error };
    }
  }
};

export default campaignApi;