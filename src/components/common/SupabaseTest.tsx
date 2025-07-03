import React, { useState } from 'react';
import { testSupabaseConnection, testEventCreation } from '../../utils/testSupabase';
import { Database, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const SupabaseTest: React.FC = () => {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isTestingEvent, setIsTestingEvent] = useState(false);
  const [connectionResult, setConnectionResult] = useState<any>(null);
  const [eventResult, setEventResult] = useState<any>(null);

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionResult(null);
    
    const result = await testSupabaseConnection();
    setConnectionResult(result);
    setIsTestingConnection(false);
  };

  const handleTestEvent = async () => {
    setIsTestingEvent(true);
    setEventResult(null);
    
    const result = await testEventCreation();
    setEventResult(result);
    setIsTestingEvent(false);
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="text-green-500" size={20} />
    ) : (
      <XCircle className="text-red-500" size={20} />
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Database className="mr-2 text-indigo-500" />
        Supabase Connection Test
      </h3>
      
      <div className="space-y-4">
        <div>
          <button
            onClick={handleTestConnection}
            disabled={isTestingConnection}
            className="btn-primary mr-4"
          >
            {isTestingConnection ? 'Testing Connection...' : 'Test Connection'}
          </button>
          
          <button
            onClick={handleTestEvent}
            disabled={isTestingEvent}
            className="btn-secondary"
          >
            {isTestingEvent ? 'Testing Event Creation...' : 'Test Event Creation'}
          </button>
        </div>

        {connectionResult && (
          <div className={`p-4 rounded-lg border ${
            connectionResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center mb-2">
              {getStatusIcon(connectionResult.success)}
              <span className="ml-2 font-medium">
                Connection Test {connectionResult.success ? 'Passed' : 'Failed'}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {connectionResult.success ? connectionResult.message : connectionResult.error}
            </p>
          </div>
        )}

        {eventResult && (
          <div className={`p-4 rounded-lg border ${
            eventResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center mb-2">
              {getStatusIcon(eventResult.success)}
              <span className="ml-2 font-medium">
                Event Creation Test {eventResult.success ? 'Passed' : 'Failed'}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {eventResult.success 
                ? 'Event creation and deletion successful' 
                : eventResult.error
              }
            </p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900">Environment Variables</h4>
              <p className="text-sm text-blue-700 mt-1">
                Make sure these environment variables are set in your .env file:
              </p>
              <ul className="text-sm text-blue-700 mt-2 list-disc list-inside">
                <li>VITE_SUPABASE_URL</li>
                <li>VITE_SUPABASE_ANON_KEY</li>
                <li>VITE_STRIPE_PUBLISHABLE_KEY</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;