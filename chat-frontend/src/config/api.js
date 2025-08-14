// API Configuration for both development and production
const isDevelopment = process.env.NODE_ENV === 'development';

// Backend URL configuration
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000/api'
  : 'https://mern-live-chat-app-12.onrender.com/api'; // Updated to match your backend deployment

// Socket URL configuration  
export const SOCKET_URL = isDevelopment
  ? 'http://localhost:5000'
  : 'https://mern-live-chat-app-12.onrender.com'; // Updated to match your backend deployment

// Export for use in other files
const config = {
  API_BASE_URL,
  SOCKET_URL
};

export default config; 