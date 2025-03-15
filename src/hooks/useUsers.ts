import { useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role?: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        // In a real implementation, you would fetch users from an API
        // For now, we'll use mock data
        const mockUsers: User[] = [
          {
            id: '1',
            email: 'admin@dentalhub.com',
            name: 'Admin User',
            role: 'admin'
          },
          {
            id: '2',
            email: 'marketing@dentalhub.com',
            name: 'Marketing Manager',
            role: 'marketing'
          },
          {
            id: '3',
            email: 'staff@dentalhub.com',
            name: 'Staff Member',
            role: 'staff'
          }
        ];
        
        setUsers(mockUsers);
        setError(null);
      } catch (err) {
        console.error('Error loading users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);
  
  return {
    users,
    loading,
    error
  };
};
