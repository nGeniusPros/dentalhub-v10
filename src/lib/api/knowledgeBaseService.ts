import { supabaseClient } from '../supabaseClient';

// Define interfaces for Knowledge Base data
export interface KnowledgeArticle {
  id: string;
  content: string;
  embedding?: number[] | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
}

export interface KnowledgeBundle {
  id: string;
  name: string;
  description?: string | null;
  created_at: string;
  articles?: KnowledgeArticle[];
}

// Filter options for knowledge queries
export interface KnowledgeFilter {
  search?: string;
  bundleId?: string;
  page?: number;
  pageSize?: number;
}

// Knowledge Base API methods
const knowledgeBaseApi = {
  // Get a list of knowledge bundles
  getKnowledgeBundles: async () => {
    try {
      const { data, error } = await supabaseClient
        .from('knowledge_bundles')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching knowledge bundles:', error);
      return { data: null, error };
    }
  },
  
  // Get a single knowledge bundle with its articles
  getKnowledgeBundle: async (id: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('knowledge_bundles')
        .select(`
          *,
          articles:knowledge_base(id, content, metadata, created_at)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching knowledge bundle:', error);
      return { data: null, error };
    }
  },
  
  // Get knowledge articles with filtering and pagination
  getKnowledgeArticles: async (filters?: KnowledgeFilter) => {
    try {
      let query = supabaseClient
        .from('knowledge_base')
        .select('*');
      
      // Apply filters
      if (filters) {
        if (filters.bundleId) {
          query = query.eq('bundle_id', filters.bundleId);
        }
        
        if (filters.search) {
          // Text search in content
          query = query.textSearch('content', filters.search);
        }
      }
      
      // Order by creation date
      query = query.order('created_at', { ascending: false });
      
      // Apply pagination if specified
      let total = 0;
      if (filters?.page && filters?.pageSize) {
        // Get count first
        const { count, error: countError } = await supabaseClient
          .from('knowledge_base')
          .select('*', { count: 'exact', head: true })
          .eq(filters.bundleId ? 'bundle_id' : 'id', filters.bundleId || 'id')
          .textSearch(filters.search ? 'content' : 'id', filters.search || 'id');
        
        if (countError) throw countError;
        total = count || 0;
        
        // Apply pagination
        const from = (filters.page - 1) * filters.pageSize;
        const to = from + filters.pageSize - 1;
        query = query.range(from, to);
      }
      
      // Execute query
      const { data, error } = await query;
      
      if (error) throw error;
      
      return {
        data: {
          articles: data,
          total: total
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching knowledge articles:', error);
      return { data: null, error };
    }
  },
  
  // Search knowledge articles using vector similarity
  searchSimilarArticles: async (searchText: string, limit: number = 5) => {
    try {
      // This assumes you have a vectorize function or API to convert text to embedding
      // In a real implementation, you might call an external API like OpenAI
      // For now, we'll make a simplified version that searches text directly
      
      const { data, error } = await supabaseClient
        .from('knowledge_base')
        .select('*')
        .textSearch('content', searchText)
        .limit(limit);
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error searching similar articles:', error);
      return { data: null, error };
    }
  },
  
  // Create a new knowledge article
  createKnowledgeArticle: async (article: Partial<KnowledgeArticle> & { bundle_id: string }) => {
    try {
      const { data, error } = await supabaseClient
        .from('knowledge_base')
        .insert([{
          ...article,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error creating knowledge article:', error);
      return { data: null, error };
    }
  },
  
  // Update an existing knowledge article
  updateKnowledgeArticle: async (id: string, article: Partial<KnowledgeArticle>) => {
    try {
      const { data, error } = await supabaseClient
        .from('knowledge_base')
        .update(article)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating knowledge article:', error);
      return { data: null, error };
    }
  },
  
  // Delete a knowledge article
  deleteKnowledgeArticle: async (id: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('knowledge_base')
        .delete()
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error deleting knowledge article:', error);
      return { data: null, error };
    }
  },
  
  // Create a new knowledge bundle
  createKnowledgeBundle: async (bundle: Partial<KnowledgeBundle>) => {
    try {
      const { data, error } = await supabaseClient
        .from('knowledge_bundles')
        .insert([{
          ...bundle,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error creating knowledge bundle:', error);
      return { data: null, error };
    }
  },
  
  // Update an existing knowledge bundle
  updateKnowledgeBundle: async (id: string, bundle: Partial<KnowledgeBundle>) => {
    try {
      const { data, error } = await supabaseClient
        .from('knowledge_bundles')
        .update(bundle)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating knowledge bundle:', error);
      return { data: null, error };
    }
  },
  
  // Delete a knowledge bundle
  deleteKnowledgeBundle: async (id: string) => {
    try {
      // First check if bundle has articles
      const { count, error: countError } = await supabaseClient
        .from('knowledge_base')
        .select('id', { count: 'exact' })
        .eq('bundle_id', id);
      
      if (countError) throw countError;
      
      if (count && count > 0) {
        throw new Error(`Cannot delete bundle with ${count} articles. Remove articles first.`);
      }
      
      const { data, error } = await supabaseClient
        .from('knowledge_bundles')
        .delete()
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error deleting knowledge bundle:', error);
      return { data: null, error };
    }
  }
};

export default knowledgeBaseApi;