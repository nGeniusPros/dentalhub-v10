/**
 * DeepSeekClient - Vector similarity search using Supabase pgvector
 *
 * This implementation uses Supabase's pgvector extension to provide
 * vector similarity search capabilities. It uses pg_embedding to generate
 * embeddings directly in the database, avoiding external API calls.
 */
import { supabase } from '../../config/auth';

/**
 * Result from Supabase vector search
 */
interface VectorSearchResult {
  id: string;
  content: string;
  similarity: number;
  metadata?: Record<string, unknown>;
}

/**
 * Options for knowledge retrieval
 */
export interface KnowledgeQueryOptions {
  agentId?: string;        // If provided, only retrieve knowledge accessible to this agent
  bundleId?: string;       // If provided, only retrieve knowledge from this bundle
  category?: string;       // If provided, only retrieve knowledge from this category
  includeMetadata?: boolean; // If true, include metadata in results
}

export class DeepSeekClient {
  constructor() {
    console.log('Initializing DeepSeekClient with Supabase pgvector');
  }

  /**
   * Query for relevant knowledge using vector similarity search
   * @param question The user's question
   * @param topK Number of results to return
   * @param options Optional query parameters
   * @returns Array of relevant text passages
   */
  async queryEmbeddings(
    question: string,
    topK: number = 3,
    options?: KnowledgeQueryOptions
  ): Promise<string[]> {
    try {
      console.log(`DeepSeek: Searching for relevant context for: "${question}"`);
      
      // If agent ID is provided, use the agent-specific search function
      if (options?.agentId) {
        return this.queryEmbeddingsForAgent(question, options.agentId, topK);
      }
      
      // Call the Supabase RPC function that handles embedding and similarity search
      const { data, error } = await supabase.rpc('search_knowledge_base', {
        query_text: question,
        match_count: topK
      });

      if (error) {
        console.error('Error querying vector database:', error);
        return this.getFallbackResults();
      }
      
      // Check if we got results
      if (!data || data.length === 0) {
        console.log('No vector search results found');
        return this.getFallbackResults();
      }
      
      // Filter results if bundle or category is specified
      let filteredResults = data;
      
      if (options?.bundleId) {
        filteredResults = filteredResults.filter((item: VectorSearchResult) =>
          item.metadata?.bundle === options.bundleId
        );
      }
      
      if (options?.category) {
        filteredResults = filteredResults.filter((item: VectorSearchResult) =>
          item.metadata?.category === options.category
        );
      }
      
      // Return either just the content or content with metadata
      if (options?.includeMetadata) {
        return filteredResults.map((item: VectorSearchResult) =>
          `[${item.metadata?.title || 'Untitled'}] ${item.content}`
        );
      }
      
      // Map results to strings
      return filteredResults.map((item: VectorSearchResult) => item.content);
    } catch (err) {
      console.error('Error in vector similarity search:', err);
      return this.getFallbackResults();
    }
  }

  /**
   * Query for knowledge specific to an agent
   * @param question The user's question
   * @param agentId The agent ID to filter by
   * @param topK Number of results to return
   * @returns Array of relevant text passages
   */
  private async queryEmbeddingsForAgent(
    question: string,
    agentId: string,
    topK: number = 3
  ): Promise<string[]> {
    try {
      console.log(`DeepSeek: Searching for knowledge accessible to agent: ${agentId}`);
      
      // Call the agent-specific search function
      const { data, error } = await supabase.rpc('search_knowledge_for_agent', {
        query_text: question,
        agent_id: agentId,
        match_count: topK
      });

      if (error) {
        console.error('Error querying agent-specific knowledge:', error);
        return this.getFallbackResults();
      }
      
      // Check if we got results
      if (!data || data.length === 0) {
        console.log(`No knowledge found for agent: ${agentId}`);
        return this.getFallbackResults();
      }
      
      // Map results to strings
      return data.map((item: VectorSearchResult) => item.content);
    } catch (err) {
      console.error('Error in agent-specific knowledge search:', err);
      return this.getFallbackResults();
    }
  }

  /**
   * Provide fallback results when vector search fails
   * @returns Array of generic knowledge entries
   */
  private getFallbackResults(): string[] {
    return [
      "Dental practice KPIs should include production goals, collection rate, new patient numbers, and hygiene department metrics.",
      "Effective recall systems combine multiple communication channels and pre-scheduled appointments.",
      "Consider implementing a staff training program for treatment presentation to improve case acceptance rates."
    ];
  }
}