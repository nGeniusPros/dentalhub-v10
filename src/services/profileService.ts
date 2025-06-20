import { api } from '../utils/api';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role?: 'admin' | 'user' | 'manager';
  phone_number?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileQueryParams {
  page?: number;
  per_page?: number;
  role?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Get the current user's profile
 */
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  try {
    // First try to get the current user from Supabase auth
    const { data: authData } = await supabase.auth.getSession();
    const userId = authData?.session?.user?.id;
    
    if (!userId) {
      console.error('No authenticated user found');
      return null;
    }
    
    // Use the database/profiles endpoint which routes through Netlify Functions in production
    const profile = await getUserProfile(userId);
    return profile;
  } catch (error: any) {
    console.error('Failed to fetch current user profile:', error);
    return null;
  }
};

/**
 * Get a specific user profile by ID
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const response = await api.get<UserProfile>(`database/profiles/${userId}`);
    return response;
  } catch (error: any) {
    console.error(`Failed to fetch user profile with ID ${userId}:`, error);
    return null;
  }
};

/**
 * Get a list of user profiles
 */
export const getUserProfiles = async (params: ProfileQueryParams = {}): Promise<{ 
  profiles: UserProfile[], 
  pagination: { 
    total: number, 
    page: number, 
    per_page: number, 
    total_pages: number 
  } 
} | null> => {
  try {
    const response = await api.get<{
      data: UserProfile[],
      pagination: {
        total: number,
        page: number,
        per_page: number,
        total_pages: number
      }
    }>('database/profiles', params as unknown as Record<string, unknown>);
    
    return {
      profiles: response.data,
      pagination: response.pagination
    };
  } catch (error: any) {
    console.error('Failed to fetch user profiles:', error);
    return null;
  }
};

/**
 * Create a new user profile
 */
export const createUserProfile = async (profile: Omit<UserProfile, 'created_at' | 'updated_at'>): Promise<UserProfile | null> => {
  try {
    const response = await api.post<UserProfile>('database/profiles', profile);
    return response;
  } catch (error: any) {
    console.error('Failed to create user profile:', error);
    return null;
  }
};

/**
 * Update a user profile
 */
export const updateUserProfile = async (userId: string, profile: Partial<UserProfile>): Promise<UserProfile | null> => {
  try {
    const response = await api.put<UserProfile>(`database/profiles/${userId}`, profile);
    return response;
  } catch (error: any) {
    console.error('Failed to update user profile:', error);
    return null;
  }
};

/**
 * Delete a user profile
 */
export const deleteUserProfile = async (userId: string): Promise<boolean> => {
  try {
    await api.delete('database/profiles', userId);
    return true;
  } catch (error: any) {
    console.error('Failed to delete user profile:', error);
    return false;
  }
};
