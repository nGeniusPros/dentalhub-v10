import React, { useEffect, useState } from 'react';
import { practiceDataService } from '../../../services/practiceDataService';

// Define the type for NexHealth test results
type NexHealthTestResult = {
  endpoint: string;
  success: boolean;
  count?: number;
  sample?: { id: string };
  error?: string;
};

type NexHealthTestResponse = {
  message: string;
  results: NexHealthTestResult[];
  allSuccessful: boolean;
};

const TestNexHealth = () => {
  const [testResults, setTestResults] = useState<NexHealthTestResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      setLoading(true);
      try {
        // Test the NexHealth connection
        const results = await practiceDataService.testNexHealthConnection();
        if (results) {
          setTestResults(results);
        } else {
          throw new Error('Failed to get test results');
        }
      } catch (err) {
        console.error('Error testing NexHealth connection:', err);
        setError('Failed to test NexHealth connection: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">NexHealth API Test</h1>
      
      {loading && (
        <div className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {testResults && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              {testResults.allSuccessful 
                ? '✅ Connection Successful' 
                : '❌ Connection Failed'}
            </h2>
            <p className="text-gray-600">{testResults.message}</p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Endpoint Tests:</h3>
            {testResults.results.map((result: NexHealthTestResult, index: number) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg ${result.success ? 'bg-green-50' : 'bg-red-50'}`}
              >
                <h4 className="font-medium">
                  {result.success ? '✅' : '❌'} {result.endpoint}
                </h4>
                {result.success ? (
                  <div className="mt-2 text-sm">
                    <p>Items: {result.count || 'N/A'}</p>
                    {result.sample && (
                      <p>Sample ID: {result.sample.id}</p>
                    )}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-red-600">{result.error}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <a 
          href="/admin/quickaccess/revenue" 
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Revenue Dashboard
        </a>
      </div>
    </div>
  );
};

export default TestNexHealth;
