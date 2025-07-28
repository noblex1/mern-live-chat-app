// Debug utility for authentication issues
export const debugAuth = () => {
  console.log('🔍 Debugging Authentication...');
  
  // Check cookies
  console.log('🍪 Cookies:', document.cookie);
  
  // Check localStorage
  try {
    const localToken = localStorage.getItem('authToken');
    console.log('💾 localStorage token:', localToken ? localToken.substring(0, 20) + '...' : 'Not found');
  } catch (error) {
    console.log('❌ localStorage error:', error);
  }
  
  // Check sessionStorage
  try {
    const sessionToken = sessionStorage.getItem('authToken');
    console.log('💾 sessionStorage token:', sessionToken ? sessionToken.substring(0, 20) + '...' : 'Not found');
  } catch (error) {
    console.log('❌ sessionStorage error:', error);
  }
  
  // Check JWT cookie specifically
  const jwtCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('jwt='));
  console.log('🍪 JWT cookie:', jwtCookie ? jwtCookie.substring(4, 24) + '...' : 'Not found');
  
  // Check if user is logged in
  const authUser = JSON.parse(localStorage.getItem('authUser') || 'null');
  console.log('👤 Auth user:', authUser);
  
  return {
    hasJwtCookie: !!jwtCookie,
    hasLocalToken: !!localStorage.getItem('authToken'),
    hasSessionToken: !!sessionStorage.getItem('authToken'),
    hasAuthUser: !!authUser
  };
};

// Test API authentication
export const testAPIAuth = async () => {
  console.log('🧪 Testing API Authentication...');
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/check', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 API Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Authentication successful:', data);
      return true;
    } else {
      const error = await response.json();
      console.log('❌ API Authentication failed:', error);
      return false;
    }
  } catch (error) {
    console.error('❌ API request failed:', error);
    return false;
  }
};

// Test socket connection
export const testSocketConnection = () => {
  console.log('🔌 Testing Socket Connection...');
  
  const { socketService } = require('../services/socket.js');
  
  if (socketService.getConnectionStatus()) {
    console.log('✅ Socket is connected');
    return true;
  } else {
    console.log('❌ Socket is not connected');
    console.log('Attempting to connect...');
    socketService.connect();
    return false;
  }
};

// Comprehensive auth test
export const runAuthTests = async () => {
  console.log('🚀 Running comprehensive authentication tests...\n');
  
  // Test 1: Debug current auth state
  console.log('1️⃣ Debugging current auth state:');
  const authState = debugAuth();
  console.log('Auth state summary:', authState);
  console.log('');
  
  // Test 2: Test API authentication
  console.log('2️⃣ Testing API authentication:');
  const apiAuth = await testAPIAuth();
  console.log('API auth result:', apiAuth);
  console.log('');
  
  // Test 3: Test socket connection
  console.log('3️⃣ Testing socket connection:');
  const socketAuth = testSocketConnection();
  console.log('Socket auth result:', socketAuth);
  console.log('');
  
  return {
    authState,
    apiAuth,
    socketAuth
  };
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.debugAuth = debugAuth;
  window.testAPIAuth = testAPIAuth;
  window.testSocketConnection = testSocketConnection;
  window.runAuthTests = runAuthTests;
} 