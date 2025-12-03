import { useState, useEffect } from 'react';
import { Database, Wifi, RefreshCw } from 'lucide-react';
import { testConnection } from '../utils/database';

const DatabaseStatus = () => {
  const [isConnected, setIsConnected] = useState(true); // Default to true for mock data
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    checkConnection();
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const connected = await testConnection();
      setIsConnected(connected);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error checking connection:', error);
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleManualRefresh = async () => {
    if (!isChecking) {
      await checkConnection();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
      <div className={`flex items-center space-x-2 px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs transition-all ${
        isConnected ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      }`}>
        {isChecking ? (
          <RefreshCw className="h-3 w-3 animate-spin" />
        ) : isConnected ? (
          <Wifi className="h-3 w-3" />
        ) : (
          <Database className="h-3 w-3" />
        )}
        <Database className="h-3 w-3" />
        <span className="font-medium">
          {isChecking ? 'Checking...' : isConnected ? 'Data Ready' : 'Using Local Data'}
        </span>
        <button
          onClick={handleManualRefresh}
          disabled={isChecking}
          className="ml-1 p-1 hover:bg-white/20 rounded transition-colors"
          title="Refresh connection"
        >
          <RefreshCw className={`h-2 w-2 ${isChecking ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {lastChecked && (
        <div className="text-xs text-gray-500 text-center sm:text-left">
          Last: {lastChecked.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default DatabaseStatus;