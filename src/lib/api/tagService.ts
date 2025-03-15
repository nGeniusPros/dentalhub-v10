import { supabaseClient } from '../supabaseClient';

// Define interfaces for Tag data
export interface Tag {
  id: string;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at?: string | null;
}

// Tag API methods
const tagApi = {
  // Get all tags
  getTags: async () => {
    try {
      const { data, error } = await supabaseClient
        .from('tags')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching tags:', error);
      return { data: null, error };
    }
  },

  // Get a single tag by ID
  getTagById: async (id: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('tags')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching tag:', error);
      return { data: null, error };
    }
  },

  // Create a new tag
  createTag: async (tag: Partial<Tag>) => {
    try {
      const { data, error } = await supabaseClient
        .from('tags')
        .insert([{
          ...tag,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error creating tag:', error);
      return { data: null, error };
    }
  },

  // Update an existing tag
  updateTag: async (id: string, tag: Partial<Tag>) => {
    try {
      const { data, error } = await supabaseClient
        .from('tags')
        .update({
          ...tag,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating tag:', error);
      return { data: null, error };
    }
  },

  // Delete a tag
  deleteTag: async (id: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('tags')
        .delete()
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error deleting tag:', error);
      return { data: null, error };
    }
  },

  // Get prospects with a specific tag
  getTagProspects: async (tagId: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('prospect_tags')
        .select('prospect:prospects(*)')
        .eq('tag_id', tagId);
      
      if (error) throw error;
      
      // Extract the prospects from the result
      const prospects = data ? data.map(item => item.prospect) : [];
      
      return { data: prospects, error: null };
    } catch (error) {
      console.error('Error fetching tag prospects:', error);
      return { data: null, error };
    }
  }
};

export default tagApi;