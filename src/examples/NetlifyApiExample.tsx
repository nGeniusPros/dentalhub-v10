import { useState } from 'react';
import { api } from '../utils/api';

/**
 * Example component demonstrating how to use the API utility
 * This component works both locally and when deployed to Netlify
 */
export function NetlifyApiExample() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Example function to test the API connectivity
  const testApiConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // This will use the hello-world function we created
      const response = await api.get('hello-world');
      setResult(JSON.stringify(response, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Example function to sign in a user
  const signInUser = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('auth/session', {
        action: 'SIGNIN',
        email,
        password
      });
      setResult(JSON.stringify(response, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Example function to get patients list
  const getPatients = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('patients');
      setResult(JSON.stringify(response, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">API Example</h2>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={testApiConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Test API
        </button>
        
        <button
          onClick={() => signInUser('test@example.com', 'password123')}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Sign In Example
        </button>
        
        <button
          onClick={getPatients}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
        >
          Get Patients
        </button>
      </div>
      
      {loading && <p className="text-gray-500">Loading...</p>}
      
      {error && (
        <div className="p-4 bg-red-100 border border-red-300 rounded mb-4">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      
      {result && (
        <div className="p-4 bg-gray-100 border border-gray-300 rounded">
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}