import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';
import { socketService } from '../services/socket.js';
import { API_BASE_URL } from '../config/api.js';
import { setAuthToken, removeAuthToken } from '../utils/auth.js';

import { getAuthToken } from '../utils/auth.js';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add request interceptor to include token in headers
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const useAuthStore = create((set) => ({
  // State
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  // Actions
  checkAuth: async () => {
    try {
      const res = await api.get('/auth/check');
      set({ authUser: res.data });
      
      // Initialize socket connection if user is authenticated
      if (res.data) {
        socketService.connect();
      }
    } catch (error) {
      console.log('Error in checkAuth:', error);
      set({ authUser: null });
      // Clear any stored token on auth failure
      removeAuthToken();
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await api.post('/auth/signup', data);
      
      // Store token if provided
      if (res.data.token) {
        setAuthToken(res.data.token);
      }
      
      // Set user data if provided
      if (res.data.user) {
        set({ authUser: res.data.user });
        // Initialize socket connection after successful signup
        socketService.connect();
      }
      
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
      console.log('🔐 Attempting login...');
      const res = await api.post('/auth/login', data);
      console.log('✅ Login successful, response:', res.data);
      
      set({ authUser: res.data });
      
      // Store token in localStorage as backup
      if (res.data.token) {
        console.log('💾 Storing token in localStorage...');
        setAuthToken(res.data.token);
      } else {
        console.log('⚠️ No token in login response');
      }
      
      // Initialize socket connection after successful login
      console.log('🔌 Initializing socket connection...');
      socketService.connect();
      
      toast.success('Logged in successfully');
    } catch (error) {
      console.error('❌ Login failed:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      
      // Disconnect socket when logging out
      socketService.disconnect();
      
      // Clear localStorage token
      removeAuthToken();
      
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
      
      // Disconnect socket when deleting account
      socketService.disconnect();
      
      // Clear user state without calling logout API (since user no longer exists)
      set({ authUser: null });
      
      // Clear any stored auth data
      localStorage.removeItem('authUser');
      sessionStorage.removeItem('authUser');
      
      // Clear any remaining cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
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
