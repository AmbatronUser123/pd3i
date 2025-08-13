import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { testSupabaseConnection, getSupabaseInfo } from '../utils/supabase/test-connection';

export function SupabaseConnectionTest() {
  const [testResult, setTestResult] = useState<{
    success?: boolean;
    message?: string;
    error?: any;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const supabaseInfo = getSupabaseInfo();

  const handleTestConnection = async () => {
    setIsLoading(true);
    setTestResult({});
    
    try {
      const result = await testSupabaseConnection();
      setTestResult(result);
    } catch (error: any) {
      setTestResult({
        success: false,
        message: `Unexpected error: ${error.message}`,
        error
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Supabase Connection Test</h2>
      
      <div className="mb-4">
        <h3 className="font-medium mb-2">Project Information</h3>
        <div className="bg-muted p-3 rounded text-sm">
          <p><span className="font-medium">Project URL:</span> {supabaseInfo.projectUrl}</p>
          <p><span className="font-medium">Project ID:</span> {supabaseInfo.projectId}</p>
          <p><span className="font-medium">Auth Enabled:</span> {supabaseInfo.authEnabled ? 'Yes' : 'No'}</p>
          <p><span className="font-medium">Storage Enabled:</span> {supabaseInfo.storageEnabled ? 'Yes' : 'No'}</p>
        </div>
      </div>
      
      <Button 
        onClick={handleTestConnection} 
        disabled={isLoading}
        className="w-full mb-4"
      >
        {isLoading ? 'Testing Connection...' : 'Test Connection'}
      </Button>
      
      {testResult.message && (
        <div className={`p-4 rounded mt-4 ${testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p className="font-medium">{testResult.success ? '✅ Success' : '❌ Error'}</p>
          <p>{testResult.message}</p>
          
          {!testResult.success && (
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </Button>
              
              {showDetails && testResult.error && (
                <pre className="mt-2 p-2 bg-gray-800 text-white rounded text-xs overflow-auto">
                  {JSON.stringify(testResult.error, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
