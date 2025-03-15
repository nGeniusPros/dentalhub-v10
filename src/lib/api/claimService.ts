import { supabaseClient } from '../supabaseClient';

// Define interfaces for Claim data
export interface Claim {
  id: string;
  profile_id: string;
  amount: number;
  status: 'submitted' | 'in_review' | 'approved' | 'denied' | 'paid';
  created_at: string;
  tenant_id: string;
  location_id: string;
  profile?: {
    first_name: string;
    last_name: string;
  };
}

// Filter options for claim queries
export interface ClaimFilter {
  profileId?: string;
  status?: string;
  locationId?: string;
  startDate?: string;
  endDate?: string;
}

// Claims API methods
const claimApi = {
  // Get claims with filters
  getClaims: async (filters?: ClaimFilter) => {
    try {
      let query = supabaseClient
        .from('claims')
        .select(`
          *,
          profile:profiles(id, first_name, last_name)
        `);
      
      // Apply filters
      if (filters) {
        if (filters.profileId) {
          query = query.eq('profile_id', filters.profileId);
        }
        
        if (filters.locationId) {
          query = query.eq('location_id', filters.locationId);
        }
        
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        
        if (filters.startDate) {
          query = query.gte('created_at', filters.startDate);
        }
        
        if (filters.endDate) {
          query = query.lte('created_at', filters.endDate);
        }
      }
      
      // Order by created_at
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching claims:', error);
      return { data: null, error };
    }
  },
  
  // Get a single claim by ID
  getClaimById: async (id: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('claims')
        .select(`
          *,
          profile:profiles(id, first_name, last_name)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching claim:', error);
      return { data: null, error };
    }
  },
  
  // Create a new claim
  createClaim: async (claim: Partial<Claim>) => {
    try {
      const { data, error } = await supabaseClient
        .from('claims')
        .insert([{
          ...claim,
          status: claim.status || 'submitted',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error creating claim:', error);
      return { data: null, error };
    }
  },
  
  // Update an existing claim
  updateClaim: async (id: string, claim: Partial<Claim>) => {
    try {
      const { data, error } = await supabaseClient
        .from('claims')
        .update(claim)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating claim:', error);
      return { data: null, error };
    }
  },
  
  // Update claim status
  updateClaimStatus: async (id: string, status: Claim['status']) => {
    try {
      const { data, error } = await supabaseClient
        .from('claims')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating claim status:', error);
      return { data: null, error };
    }
  },
  
  // Delete a claim
  deleteClaim: async (id: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('claims')
        .delete()
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error deleting claim:', error);
      return { data: null, error };
    }
  }
};

export default claimApi;