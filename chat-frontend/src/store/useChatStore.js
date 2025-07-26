import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

export const useChatStore = create((set, get) => ({
  // State
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // Actions
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await api.get('/auth/users');
      set({ users: res.data.users });
    } catch (error) {
      console.log('Error in getUsers:', error);
      toast.error(error.response?.data?.message || 'Failed to load users');
    } finally {
      set({ isUsersLoading: false });
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
      const res = await api.post('/messages/send', {
        ...messageData,
        receiverId: selectedUser._id,
      });
      set({ messages: [...messages, res.data.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  // Socket.io methods (will be implemented later)
  subscribeToMessages: () => {
    // Will implement with Socket.io
  },

  unsubscribeFromMessages: () => {
    // Will implement with Socket.io
  },
}));