import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  devLogin: () => void; // Added for development/testing
}

interface User {
  id: string;
  role: 'admin' | 'staff' | 'patient';
  name: string;
  title?: string;
  department?: string;
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
      department: 'Development'
    };
    setUser(devUser);
    localStorage.setItem('user', JSON.stringify(devUser));
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
    <AuthContext.Provider value={{ user, login, logout, isLoading, devLogin }}>
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