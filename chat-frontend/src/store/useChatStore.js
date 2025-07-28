import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';
import { socketService } from '../services/socket.js';
import { useAuthStore } from './useAuthStore.js';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

export const useChatStore = create((set, get) => ({
  // State
  messages: [],
  users: [],
  searchResults: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSearching: false,
  onlineUsers: [],
  typingUsers: {},
  profileDetails: null,
  isProfileLoading: false,

  // Actions
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await api.get('/auth/users/all');
      const users = res.data.users;
      
      // Get current online users from Socket.IO
      const { onlineUsers } = get();
      
      // Merge database online status with Socket.IO online status
      const usersWithOnlineStatus = users.map(user => ({
        ...user,
        isOnline: onlineUsers.includes(user._id) || user.isOnline
      }));
      
      set({ users: usersWithOnlineStatus });
    } catch (error) {
      console.log('Error in getUsers:', error);
      toast.error(error.response?.data?.message || 'Failed to load users');
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Fetch user profile details
  getUserProfile: async (userId) => {
    set({ isProfileLoading: true });
    try {
      const res = await api.get(`/auth/user/${userId}`);
      set({ profileDetails: res.data.user });
      return res.data.user;
    } catch (error) {
      console.log('Error in getUserProfile:', error);
      toast.error(error.response?.data?.message || 'Failed to load profile details');
      return null;
    } finally {
      set({ isProfileLoading: false });
    }
  },

  // Clear profile details
  clearProfileDetails: () => {
    set({ profileDetails: null });
  },

  getConversations: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await api.get('/messages/conversations');
      const conversations = res.data.data;
      
      // Get current online users from Socket.IO
      const { onlineUsers } = get();
      
      // Merge database online status with Socket.IO online status
      const conversationsWithOnlineStatus = conversations.map(user => ({
        ...user,
        isOnline: onlineUsers.includes(user._id) || user.isOnline
      }));
      
      set({ users: conversationsWithOnlineStatus });
    } catch (error) {
      console.log('Error in getConversations:', error);
      // Don't show error toast for empty conversations - this is normal
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.message || 'Failed to load conversations');
      }
      set({ users: [] });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  searchUsers: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }
    
    set({ isSearching: true });
    try {
      const res = await api.get(`/auth/users/search?query=${encodeURIComponent(query)}`);
      set({ searchResults: res.data.users });
    } catch (error) {
      console.log('Error in searchUsers:', error);
      toast.error(error.response?.data?.message || 'Failed to search users');
    } finally {
      set({ isSearching: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await api.get(`/messages/${userId}`);
      set({ messages: res.data.data.messages });
    } catch (error) {
      console.log('Error in getMessages:', error);
      toast.error(error.response?.data?.message || 'Failed to load messages');
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      // Check if messageData is FormData (for file uploads) or regular object
      const isFormData = messageData instanceof FormData;
      
      let res;
      if (isFormData) {
        // For file uploads, use FormData
        res = await api.post('/messages/send', messageData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // For regular text messages, use JSON
        res = await api.post('/messages/send', {
          ...messageData,
          receiverId: selectedUser._id,
        });
      }
      
      // Add message to local state immediately
      const newMessage = res.data.data;
      set({ messages: [...messages, newMessage] });

      // Refresh conversations to include the new chat
      get().getConversations();

      // Emit socket event for real-time delivery with the actual message ID
      if (socketService.getConnectionStatus()) {
        console.log('📤 Emitting message via socket');
        socketService.emit('message:send', {
          receiverId: selectedUser._id,
          text: newMessage.text,
          imageUrl: newMessage.imageUrl,
          messageId: newMessage._id
        });
      } else {
        console.warn('⚠️ Socket not connected, message sent via API only');
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  // Socket.IO methods
  subscribeToMessages: () => {
    const socket = socketService.getSocket();
    
    if (!socket) {
      console.log('❌ No socket connection available, attempting to connect...');
      socketService.connect();
      // Wait a bit for connection to establish
      setTimeout(() => {
        const connectedSocket = socketService.getSocket();
        if (connectedSocket) {
          console.log('✅ Socket connected, now subscribing to messages');
          get().subscribeToMessages();
        } else {
          console.error('❌ Failed to establish socket connection');
        }
      }, 1000);
      return;
    }

    console.log('🎧 Subscribing to real-time messages...');

    // Listen for incoming messages
    socket.on('message:received', (message) => {
      const { messages, selectedUser } = get();
      
      console.log('📨 Received message:', message);
      console.log('👤 Selected user:', selectedUser);
      
      // Check if message is from the currently selected user
      const messageSenderId = typeof message.senderId === 'object' ? message.senderId._id : message.senderId;
      const selectedUserId = selectedUser?._id;
      
      if (selectedUser && messageSenderId === selectedUserId) {
        console.log('✅ Adding message to chat');
        // Check if message already exists to avoid duplicates
        const messageExists = messages.some(m => m._id === message._id);
        if (!messageExists) {
          set({ messages: [...messages, message] });
        } else {
          console.log('⚠️ Message already exists, skipping duplicate');
        }
      } else {
        console.log('❌ Message not from selected user or no user selected');
      }
    });

    // Listen for sent message confirmation
    socket.on('message:sent', (message) => {
      // Message was sent successfully
      console.log('Message sent successfully');
    });

    // Listen for online users
    socket.on('user:online', (user) => {
      const { onlineUsers } = get();
      console.log('👤 User came online:', user, 'Current online users:', onlineUsers);
      if (!onlineUsers.includes(user.userId)) {
        const newOnlineUsers = [...onlineUsers, user.userId];
        console.log('✅ Updated online users:', newOnlineUsers);
        set({ onlineUsers: newOnlineUsers });
      }
    });

    // Listen for offline users
    socket.on('user:offline', (user) => {
      const { onlineUsers } = get();
      console.log('👤 User went offline:', user, 'Current online users:', onlineUsers);
      const newOnlineUsers = onlineUsers.filter(id => id !== user.userId);
      console.log('✅ Updated online users:', newOnlineUsers);
      set({ onlineUsers: newOnlineUsers });
    });

    // Listen for initial online users list
    socket.on('users:online', (users) => {
      console.log('👥 Received initial online users:', users);
      set({ onlineUsers: users });
    });

    // Listen for typing indicators
    socket.on('typing:start', (data) => {
      const { typingUsers } = get();
      set({ 
        typingUsers: { 
          ...typingUsers, 
          [data.userId]: data.username 
        } 
      });
    });

    socket.on('typing:stop', (data) => {
      const { typingUsers } = get();
      const newTypingUsers = { ...typingUsers };
      delete newTypingUsers[data.userId];
      set({ typingUsers: newTypingUsers });
    });

    // Initialize current user as online
    const { authUser } = useAuthStore.getState();
    if (authUser) {
      const { onlineUsers } = get();
      if (!onlineUsers.includes(authUser._id)) {
        set({ onlineUsers: [...onlineUsers, authUser._id] });
      }
    }
  },

  unsubscribeFromMessages: () => {
    // Don't disconnect the socket here since it's managed by auth store
    // Just remove the event listeners
    const socket = socketService.getSocket();
    if (socket) {
      socket.off('message:received');
      socket.off('message:sent');
      socket.off('user:online');
      socket.off('user:offline');
      socket.off('users:online');
      socket.off('typing:start');
      socket.off('typing:stop');
    }
  },

  // Typing indicators
  startTyping: () => {
    const { selectedUser } = get();
    if (selectedUser) {
      socketService.emit('typing:start', { receiverId: selectedUser._id });
    }
  },

  stopTyping: () => {
    const { selectedUser } = get();
    if (selectedUser) {
      socketService.emit('typing:stop', { receiverId: selectedUser._id });
    }
  },
}));