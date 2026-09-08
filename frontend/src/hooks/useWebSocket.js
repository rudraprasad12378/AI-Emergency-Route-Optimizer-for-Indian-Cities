import { useEffect, useState, useCallback } from 'react';

export const useWebSocket = (channel = 'emergency_telemetry') => {
  const [isConnected, setIsConnected] = useState(true);
  const [lastMessage, setLastMessage] = useState(null);

  const sendMessage = useCallback((msg) => {
    // Mock message echo
    setLastMessage({ data: msg, timestamp: new Date().toISOString() });
  }, []);

  return {
    isConnected,
    lastMessage,
    sendMessage,
  };
};

export default useWebSocket;
