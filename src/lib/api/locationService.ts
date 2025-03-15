import { supabaseClient } from '../supabaseClient';

// Define interfaces for Location data
export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  contact_phone: string;
  contact_email: string;
  created_at: string;
}

// Location API methods
const locationApi = {
  // Get all locations
  getLocations: async () => {
    try {
      const { data, error } = await supabaseClient
        .from('locations')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching locations:', error);
      return { data: null, error };
    }
  },
  
  // Get a single location by ID
  getLocationById: async (id: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('locations')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching location:', error);
      return { data: null, error };
    }
  },
  
  // Create a new location
  createLocation: async (location: Partial<Location>) => {
    try {
      const { data, error } = await supabaseClient
        .from('locations')
        .insert([{
          ...location,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error creating location:', error);
      return { data: null, error };
    }
  },
  
  // Update an existing location
  updateLocation: async (id: string, location: Partial<Location>) => {
    try {
      const { data, error } = await supabaseClient
        .from('locations')
        .update(location)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating location:', error);
      return { data: null, error };
    }
  },
  
  // Delete a location
  deleteLocation: async (id: string) => {
    try {
      // Check for related records first
      const relatedTables = [
        { name: 'appointments', column: 'location_id' },
        { name: 'prospects', column: 'location_id' },
        { name: 'profiles', column: 'location_id' }
      ];
      
      for (const table of relatedTables) {
        const { count, error } = await supabaseClient
          .from(table.name)
          .select('id', { count: 'exact' })
          .eq(table.column, id);
        
        if (error) throw error;
        
        if (count && count > 0) {
          throw new Error(`Cannot delete location with ${count} related records in ${table.name}`);
        }
      }
      
      // Delete the location if no related records
      const { data, error } = await supabaseClient
        .from('locations')
        .delete()
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error deleting location:', error);
      return { data: null, error };
    }
  }
};

export default locationApi;