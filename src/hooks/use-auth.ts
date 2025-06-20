import { useState, useCallback, useEffect } from 'react';
import type { User } from '../types';
import { supabase } from '../lib/supabase';
import { getUserProfile } from '../db/supabaseClient';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }
        
        if (data.session) {
          const { data: userData, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error('Error getting user:', userError);
            return;
          }
          
          if (userData.user) {
            // Get user profile data from profiles table
            const profile = await getUserProfile(userData.user.id);
            
            if (profile) {
              setUser({
                id: userData.user.id,
                name: profile.full_name || userData.user.email?.split('@')[0] || 'User',
                email: userData.user.email || '',
                role: (profile.role as 'admin' | 'staff' | 'patient') || 'staff',
                title: profile.title,
                department: profile.department
              });
            }
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      if (!data.user) {
        throw new Error('No user returned from authentication');
      }

      // Get user profile data from profiles table
      const profile = await getUserProfile(data.user.id);
      
      if (!profile) {
        throw new Error('User profile not found');
      }
      
      const userData: User = {
        id: data.user.id,
        name: profile.full_name || data.user.email?.split('@')[0] || 'User',
        email: data.user.email || '',
        role: (profile.role as 'admin' | 'staff' | 'patient') || 'staff',
        title: profile.title,
        department: profile.department
      };

      setUser(userData);
      return userData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout
  };
};