import React, { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [foodSecurityUpdates, setFoodSecurityUpdates] = useState([]);

  useEffect(() => {
    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
    console.log(`🌱 Connecting to Climate Resilience & Food Security backend: ${socketUrl}`);
    
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to Climate Resilience & Food Security backend');
      setIsConnected(true);
      setConnectionStatus('connected');
      
      // Join default region for real-time updates
      newSocket.emit('joinRegion', 'durban');
      console.log('📍 Joined Durban region for real-time monitoring');
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason);
      setIsConnected(false);
      setConnectionStatus('disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('🚨 Connection error:', error.message);
      setIsConnected(false);
      setConnectionStatus('error');
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Reconnected to server (attempt ${attemptNumber})`);
      setIsConnected(true);
      setConnectionStatus('connected');
      newSocket.emit('joinRegion', 'durban');
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Attempting to reconnect... (${attemptNumber})`);
      setConnectionStatus('reconnecting');
    });

    newSocket.on('reconnect_failed', () => {
      console.error('💥 Failed to reconnect to server');
      setConnectionStatus('failed');
    });

    // Enhanced event listeners for Climate Resilience & Food Security
    newSocket.on('sensorUpdate', (data) => {
      console.log('📡 Real-time sensor update:', data);
      setLastUpdate(new Date());
      
      // Emit custom event for components to listen to
      window.dispatchEvent(new CustomEvent('sensorDataUpdate', { 
        detail: { ...data, type: 'sensor', timestamp: new Date() }
      }));
    });

    newSocket.on('foodSecurityUpdate', (data) => {
      console.log('🌾 Food security update received:', data);
      setLastUpdate(new Date());
      
      // Track food security updates
      setFoodSecurityUpdates(prev => [
        { ...data, timestamp: new Date() },
        ...prev.slice(0, 9) // Keep last 10 updates
      ]);

      // Emit custom event for food security components
      window.dispatchEvent(new CustomEvent('foodSecurityDataUpdate', { 
        detail: { ...data, type: 'foodSecurity', timestamp: new Date() }
      }));
    });

    newSocket.on('communityUpdate', (data) => {
      console.log('🏘️ Community resilience update:', data);
      setLastUpdate(new Date());
      
      // Emit custom event for community components
      window.dispatchEvent(new CustomEvent('communityDataUpdate', { 
        detail: { ...data, type: 'community', timestamp: new Date() }
      }));
    });

    // Listen for integrated alerts (climate + food security)
    newSocket.on('integratedAlert', (data) => {
      console.log('🚨 Integrated climate-food security alert:', data);
      
      // Emit custom event for alert components
      window.dispatchEvent(new CustomEvent('integratedAlertUpdate', { 
        detail: { ...data, type: 'alert', timestamp: new Date() }
      }));
    });

    setSocket(newSocket);

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up socket connection');
      newSocket.close();
    };
  }, []);

  // Enhanced socket methods for Climate Resilience features
  const joinRegion = (region) => {
    if (socket && isConnected) {
      socket.emit('joinRegion', region);
      console.log(`📍 Joined region: ${region}`);
    }
  };

  const requestFoodSecurityData = () => {
    if (socket && isConnected) {
      socket.emit('requestFoodSecurityData');
      console.log('📊 Requested latest food security data');
    }
  };

  const reportIncident = (incidentData) => {
    if (socket && isConnected) {
      const enhancedData = {
        ...incidentData,
        timestamp: new Date(),
        type: 'user_reported_incident',
        initiative: 'FNB Climate Resilience'
      };
      socket.emit('reportIncident', enhancedData);
      console.log('📝 Reported incident:', enhancedData);
    }
  };

  const subscribeToFoodSecurity = () => {
    if (socket && isConnected) {
      socket.emit('subscribe', 'food_security_updates');
      console.log('🔔 Subscribed to food security updates');
    }
  };

  const unsubscribeFromFoodSecurity = () => {
    if (socket && isConnected) {
      socket.emit('unsubscribe', 'food_security_updates');
      console.log('🔕 Unsubscribed from food security updates');
    }
  };

  const value = {
    socket,
    isConnected,
    connectionStatus,
    lastUpdate,
    foodSecurityUpdates,
    // Enhanced methods
    joinRegion,
    requestFoodSecurityData,
    reportIncident,
    subscribeToFoodSecurity,
    unsubscribeFromFoodSecurity,
    // Helper methods
    getConnectionHealth: () => ({
      connected: isConnected,
      status: connectionStatus,
      lastUpdate,
      foodSecurityUpdateCount: foodSecurityUpdates.length
    })
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};