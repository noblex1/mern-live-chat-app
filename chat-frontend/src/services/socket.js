import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config/api.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { getAuthToken } from '../utils/auth.js';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    // Get token using utility function
    const token = getAuthToken();

    // If still no token, try to get from auth store
    if (!token) {
      const authStore = useAuthStore.getState();
      if (authStore.authUser) {
        // If we have user data but no token, we need to re-authenticate
        console.log('User authenticated but no token found, attempting to refresh...');
        return null;
      }
    }

    if (!token) {
      console.error('No authentication token found');
      return null;
    }

    console.log('🔑 Token found, attempting socket connection...');
    console.log('🔌 Token value:', token.substring(0, 20) + '...');
    console.log('🔌 Socket URL:', SOCKET_URL);

    // Test if backend is reachable
    fetch(`${SOCKET_URL}/health`, {
      method: 'GET'
    }).then(response => {
      console.log('🔌 Backend reachability test:', response.status);
      if (response.ok) {
        console.log('✅ Backend is reachable');
      } else {
        console.error('❌ Backend responded with error status');
      }
    }).catch(error => {
      console.error('❌ Backend not reachable:', error);
    });

    console.log('🔌 Attempting to connect to Socket.IO server...');

    this.socket = io(SOCKET_URL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    console.log('🔌 Socket instance created:', this.socket);

    this.socket.on('connect', () => {
      console.log('✅ Connected to Socket.IO server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from Socket.IO server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      console.error('Error details:', {
        message: error.message,
        description: error.description,
        context: error.context,
        type: error.type
      });
      this.isConnected = false;
    });

    // Handle authentication errors specifically
    this.socket.on('error', (error) => {
      console.error('Socket authentication error:', error);
      this.isConnected = false;
    });

    // Add event listeners for debugging
    this.socket.on('user:online', (user) => {
      console.log('👤 User came online:', user);
    });

    this.socket.on('user:offline', (user) => {
      console.log('👤 User went offline:', user);
    });

    this.socket.on('users:online', (users) => {
      console.log('👥 Initial online users:', users);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting from Socket.IO server');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      console.log('📤 Emitting event:', event, data);
      this.socket.emit(event, data);
    } else {
      console.warn('⚠️ Cannot emit event - socket not connected');
    }
  }

  on(event, callback) {
    if (this.socket) {
      console.log(`🎧 Adding listener for event: ${event}`);
      this.socket.on(event, callback);
    } else {
      console.warn(`⚠️ Cannot add listener for ${event} - socket not connected`);
    }
  }

  off(event) {
    if (this.socket) {
      console.log(`🎧 Removing listener for event: ${event}`);
      this.socket.off(event);
    } else {
      console.warn(`⚠️ Cannot remove listener for ${event} - socket not connected`);
    }
  }

  getSocket() {
    return this.socket;
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

export const socketService = new SocketService(); 