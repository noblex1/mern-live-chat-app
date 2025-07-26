import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

export const useAuthStore = create((set) => ({
  // State
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],

  // Actions
  checkAuth: async () => {
    try {
      const res = await api.get('/auth/check');
      set({ authUser: res.data });
    } catch (error) {
      console.log('Error in checkAuth:', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      await api.post('/auth/signup', data); // ⬅️ No setting authUser
      toast.success('Account created successfully');
      return true; // ⬅️ Inform component of success
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
      return false; // ⬅️ Inform component of failure
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await api.post('/auth/login', data);
      set({ authUser: res.data });
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      set({ authUser: null });
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      // Convert profilePic to avatar if it exists
      const updateData = { ...data };
      if (data.profilePic) {
        updateData.avatar = data.profilePic;
        delete updateData.profilePic;
      }
      
      const res = await api.put('/auth/profile', updateData);
      set({ authUser: res.data.user });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.log('Error in updateProfile:', error);
      toast.error(error.response?.data?.message || 'Profile update failed');
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  setOnlineUsers: (users) => {
    set({ onlineUsers: users });
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      toast.success('Password changed successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
      return false;
    }
  },

  deleteAccount: async (password) => {
    try {
      await api.delete('/auth/delete-account', { data: { password } });
      set({ authUser: null });
      toast.success('Account deleted successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
      return false;
    }
  },

  updateSettings: async (settings) => {
    try {
      const res = await api.put('/auth/settings', { settings });
      set({ authUser: res.data.user });
      toast.success('Settings updated successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
      return false;
    }
  },
}));
