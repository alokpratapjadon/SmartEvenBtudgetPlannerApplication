import React, { useState, useEffect } from 'react';
import { checkDatabaseSchema, refreshSchemaCache } from '../../utils/databaseCheck';
import { Database, RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const DatabaseStatus: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [schemaStatus, setSchemaStatus] = useState<any>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const handleSchemaCheck = async () => {
    setIsChecking(true);
    const result = await checkDatabaseSchema();
    setSchemaStatus(result);
    setLastChecked(new Date());
    setIsChecking(false);
  };

  const handleRefreshCache = async () => {
    setIsRefreshing(true);
    await refreshSchemaCache();
    setIsRefreshing(false);
    
    // Re-check schema after refresh
    setTimeout(() => {
      handleSchemaCheck();
    }, 1000);
  };

  useEffect(() => {
    // Auto-check on component mount
    handleSchemaCheck();
  }, []);

  const getStatusIcon = () => {
    if (!schemaStatus) return <Database className="text-gray-400" size={20} />;
    
    if (schemaStatus.success) {
      return <CheckCircle className="text-green-500" size={20} />;
    } else {
      return <XCircle className="text-red-500" size={20} />;
    }
  };

  const getStatusColor = () => {
    if (!schemaStatus) return 'border-gray-200 bg-gray-50';
    return schemaStatus.success 
      ? 'border-green-200 bg-green-50' 
      : 'border-red-200 bg-red-50';
  };

  return (
    <div className={`rounded-lg border p-4 ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          {getStatusIcon()}
          <h3 className="ml-2 font-medium text-gray-900">Database Schema Status</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefreshCache}
            disabled={isRefreshing}
            className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 flex items-center"
          >
            <RefreshCw size={14} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Cache
          </button>
          <button
            onClick={handleSchemaCheck}
            disabled={isChecking}
            className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            {isChecking ? 'Checking...' : 'Check Schema'}
          </button>
        </div>
      </div>

      {schemaStatus && (
        <div className="space-y-2">
          <p className="text-sm">
            <strong>Status:</strong> {schemaStatus.success ? 'Valid' : 'Invalid'}
          </p>
          
          {schemaStatus.error && (
            <p className="text-sm text-red-600">
              <strong>Error:</strong> {schemaStatus.error}
            </p>
          )}

          {schemaStatus.missingColumns && schemaStatus.missingColumns.length > 0 && (
            <div className="text-sm">
              <strong>Missing Columns:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                {schemaStatus.missingColumns.map((column: string) => (
                  <li key={column} className="text-red-600">{column}</li>
                ))}
              </ul>
            </div>
          )}

          {schemaStatus.needsMigration && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-3">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800">Migration Required</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    The database schema is missing required columns. Please run the latest migration 
                    in your Supabase dashboard or contact your administrator.
                  </p>
                </div>
              </div>
            </div>
          )}

          {lastChecked && (
            <p className="text-xs text-gray-500">
              Last checked: {lastChecked.toLocaleTimeString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DatabaseStatus;