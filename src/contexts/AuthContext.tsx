import { createContext, useContext, useState, useEffect } from 'react';
import { initErrorTracking } from '../utils/errorTracking';
import { supabase } from '../lib/supabase';
import { getUserProfile } from '../db/supabaseClient';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  loading: boolean; // Alias for isLoading to maintain compatibility
  devLogin: () => Promise<void>; // Added for development/testing
}

interface User {
  id: string;
  role: 'admin' | 'staff' | 'patient' | 'super_admin';
  name: string;
  title?: string;
  department?: string;
  locationId?: string; // Reference to the user's assigned location
  email: string;
}

interface LoginCredentials {
  email: string;
  password: string;
  role?: 'admin' | 'staff' | 'patient'; // Made optional since Supabase doesn't require this
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing Supabase session
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
              const userObj: User = {
                id: userData.user.id,
                name: profile.full_name || userData.user.email?.split('@')[0] || 'User',
                email: userData.user.email || '',
                role: (profile.role as 'admin' | 'staff' | 'patient' | 'super_admin') || 'staff',
                title: profile.title,
                department: profile.department,
                locationId: profile.location_id
              };
              
              setUser(userObj);
              
              // Initialize error tracking with user ID for better error context
              if (import.meta.env.PROD) {
                initErrorTracking(userData.user.id);
              }
            }
          }
        } else if (import.meta.env.DEV) {
          // Auto-login for development environment if no session exists
          await devLogin();
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);

  // Development login helper - creates a mock admin user
  const devLogin = async () => {
    // For development, we'll use a special dev account or create one if needed
    try {
      // Try to sign in with dev credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'dev@dentalhub.com',
        password: 'devpassword123'
      });
      
      if (error) {
        console.log('Dev account not found, creating one...');
        // Create a dev account if it doesn't exist
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: 'dev@dentalhub.com',
          password: 'devpassword123'
        });
        
        if (signUpError) {
          throw signUpError;
        }
        
        // Create a profile for the dev user
        if (signUpData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: signUpData.user.id,
              full_name: 'Dev Admin',
              role: 'admin',
              title: 'Administrator',
              department: 'Development',
              location_id: 'dev-location-id'
            });
            
          if (profileError) {
            console.error('Error creating dev profile:', profileError);
          }
          
          const devUser: User = {
            id: signUpData.user.id,
            role: 'admin',
            name: 'Dev Admin',
            email: 'dev@dentalhub.com',
            title: 'Administrator',
            department: 'Development',
            locationId: 'dev-location-id'
          };
          
          setUser(devUser);
        }
      } else if (data.user) {
        // Dev account exists, get profile
        const profile = await getUserProfile(data.user.id);
        
        const devUser: User = {
          id: data.user.id,
          role: profile?.role as 'admin' || 'admin',
          name: profile?.full_name || 'Dev Admin',
          email: data.user.email || 'dev@dentalhub.com',
          title: profile?.title || 'Administrator',
          department: profile?.department || 'Development',
          locationId: profile?.location_id || 'dev-location-id'
        };
        
        setUser(devUser);
      }
      
      // For development, also create a mock location in localStorage
      // This helps with testing LocationContext functionality
      const devLocation = {
        id: 'dev-location-id',
        name: 'Development Office',
        address: '123 Dev Street',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94103',
        contactPhone: '555-123-4567',
        contactEmail: 'dev@dentalhub.com'
      };
      localStorage.setItem('dev-location', JSON.stringify(devLocation));
      
      console.log('Development auto-login successful');
    } catch (error) {
      console.error('Dev login error:', error);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
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
        role: (profile.role as 'admin' | 'staff' | 'patient' | 'super_admin') || 'staff',
        title: profile.title,
        department: profile.department,
        locationId: profile.location_id
      };

      setUser(userData);
      
      // Initialize error tracking with user ID for better error context
      if (import.meta.env.PROD) {
        initErrorTracking(userData.id);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isLoading,
      loading: isLoading, // Add alias for compatibility
      devLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export const useAuthContext = useAuth;