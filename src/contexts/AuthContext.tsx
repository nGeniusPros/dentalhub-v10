import { createContext, useContext, useState, useEffect } from 'react';
import { initErrorTracking } from '../utils/errorTracking';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  loading: boolean; // Alias for isLoading to maintain compatibility
  devLogin: () => void; // Added for development/testing
}

interface User {
  id: string;
  role: 'admin' | 'staff' | 'patient' | 'super_admin';
  name: string;
  title?: string;
  department?: string;
  locationId?: string; // Reference to the user's assigned location
}

interface LoginCredentials {
  email: string;
  password: string;
  role: 'admin' | 'staff' | 'patient';
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Auto-login for development environment
      if (import.meta.env.DEV) {
        devLogin();
      }
    }
    setIsLoading(false);
  }, []);

  // Development login helper - creates a mock admin user
  const devLogin = () => {
    const devUser = {
      id: 'dev-admin-user',
      role: 'admin' as const,
      name: 'Dev Admin',
      title: 'Administrator',
      department: 'Development',
      locationId: 'dev-location-id' // Mock location ID for development
    };
    setUser(devUser);
    localStorage.setItem('user', JSON.stringify(devUser));
    
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
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      // Replace with your actual API call
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) throw new Error('Login failed');

      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Initialize error tracking with user ID for better error context
      if (import.meta.env.PROD) {
        initErrorTracking(userData.id);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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