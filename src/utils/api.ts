import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { createClient } from '@supabase/supabase-js';

/**
 * API Utility
 * 
 * This utility provides a smart API interface that automatically:
 * - Uses direct Supabase calls in development environment
 * - Routes through Netlify Functions in production environment
 * 
 * This approach ensures your app works both locally and when deployed to Netlify
 * without requiring code changes.
 */

// Initialize Supabase client for direct database access in development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Determine if we're in development or production
const isProduction = import.meta.env.PROD || 
  window.location.hostname === 'dentalhub-v10.netlify.app' || 
  window.location.hostname.endsWith('.netlify.app');

// Base URL for API requests
const baseURL = isProduction 
  ? '/api' 
  : 'http://localhost:8888/.netlify/functions';

// Create an axios instance for Netlify Functions
const netlifyApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Smart API utility that routes requests appropriately based on environment
 */
export const api = {
  /**
   * Make a GET request
   * @param endpoint The API endpoint or table name
   * @param params Query parameters
   * @param config Additional Axios config
   * @returns Promise resolving to the response data
   */
  async get<T = unknown>(
    endpoint: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    // Handle special endpoints that must use Netlify Functions even in development
    const forceNetlify = endpoint.startsWith('ai/') || 
      endpoint.startsWith('social/') || 
      endpoint.startsWith('newsletter/') ||
      endpoint.startsWith('retell/') ||
      endpoint.startsWith('notifications/');
    
    // In development and not a special endpoint, use direct Supabase
    if (!isProduction && !forceNetlify) {
      try {
        // Assume endpoint is a table name
        const { data, error } = await supabase
          .from(endpoint)
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as T;
      } catch (error) {
        console.error(`Error making direct Supabase call to ${endpoint}:`, error);
        throw error;
      }
    }
    
    // Otherwise use Netlify Functions
    try {
      // Add query parameters to config
      const requestConfig: AxiosRequestConfig = {
        ...config,
        params
      };
      
      // Make the request
      const response: AxiosResponse = await netlifyApi.get(endpoint, requestConfig);
      return response.data as T;
    } catch (error) {
      console.error(`Error making GET request to ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * Make a POST request
   * @param endpoint The API endpoint or table name
   * @param data The data to send
   * @param config Additional Axios config
   * @returns Promise resolving to the response data
   */
  async post<T = unknown>(
    endpoint: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    // Handle special endpoints that must use Netlify Functions even in development
    const forceNetlify = endpoint.startsWith('ai/') || 
      endpoint.startsWith('social/') || 
      endpoint.startsWith('newsletter/') ||
      endpoint.startsWith('retell/') ||
      endpoint.startsWith('notifications/');
    
    // In development and not a special endpoint, use direct Supabase
    if (!isProduction && !forceNetlify) {
      try {
        // Assume endpoint is a table name and data is a record to insert
        const { data: responseData, error } = await supabase
          .from(endpoint)
          .insert(data)
          .select();
        
        if (error) throw error;
        return responseData as T;
      } catch (error) {
        console.error(`Error making direct Supabase call to ${endpoint}:`, error);
        throw error;
      }
    }
    
    // Otherwise use Netlify Functions
    try {
      // Make the request
      const response: AxiosResponse = await netlifyApi.post(endpoint, data, config);
      return response.data as T;
    } catch (error) {
      console.error(`Error making POST request to ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * Make a PUT request
   * @param endpoint The API endpoint or table name
   * @param data The data to send
   * @param config Additional Axios config
   * @returns Promise resolving to the response data
   */
  async put<T = unknown>(
    endpoint: string,
    data?: Record<string, unknown> & { id?: string | number },
    config?: AxiosRequestConfig
  ): Promise<T> {
    // Handle special endpoints that must use Netlify Functions even in development
    const forceNetlify = endpoint.startsWith('ai/') || 
      endpoint.startsWith('social/') || 
      endpoint.startsWith('newsletter/') ||
      endpoint.startsWith('retell/') ||
      endpoint.startsWith('notifications/');
    
    // In development and not a special endpoint, use direct Supabase
    if (!isProduction && !forceNetlify) {
      try {
        if (!data || !data.id) {
          throw new Error('ID required for PUT operations');
        }
        
        // Assume endpoint is a table name and data has an ID
        const { data: responseData, error } = await supabase
          .from(endpoint)
          .update(data)
          .eq('id', data.id)
          .select();
        
        if (error) throw error;
        return responseData as T;
      } catch (error) {
        console.error(`Error making direct Supabase call to ${endpoint}:`, error);
        throw error;
      }
    }
    
    // Otherwise use Netlify Functions
    try {
      // Make the request
      const response: AxiosResponse = await netlifyApi.put(endpoint, data, config);
      return response.data as T;
    } catch (error) {
      console.error(`Error making PUT request to ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * Make a DELETE request
   * @param endpoint The API endpoint or table name
   * @param id The ID of the record to delete
   * @param config Additional Axios config
   * @returns Promise resolving to the response data
   */
  async delete<T = unknown>(
    endpoint: string,
    id: string | number,
    config?: AxiosRequestConfig
  ): Promise<T> {
    // Handle special endpoints that must use Netlify Functions even in development
    const forceNetlify = endpoint.startsWith('ai/') || 
      endpoint.startsWith('social/') || 
      endpoint.startsWith('newsletter/') ||
      endpoint.startsWith('retell/') ||
      endpoint.startsWith('notifications/');
    
    // In development and not a special endpoint, use direct Supabase
    if (!isProduction && !forceNetlify) {
      try {
        // Assume endpoint is a table name
        const { data: responseData, error } = await supabase
          .from(endpoint)
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return responseData as T;
      } catch (error) {
        console.error(`Error making direct Supabase call to ${endpoint}:`, error);
        throw error;
      }
    }
    
    // Otherwise use Netlify Functions
    try {
      // Make the request
      const url = `${endpoint}/${id}`;
      const response: AxiosResponse = await netlifyApi.delete(url, config);
      return response.data as T;
    } catch (error) {
      console.error(`Error making DELETE request to ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * Direct access to the Supabase client
   * Note: This should only be used for complex operations not covered by the API methods
   */
  supabase,
};

export default api;