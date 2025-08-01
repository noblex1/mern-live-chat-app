// Authentication utility functions

/**
 * Get the authentication token from cookies or localStorage
 * @returns {string|null} The authentication token or null if not found
 */
export const getAuthToken = () => {
  // Try to get token from cookies first
  let token = document.cookie
    .split('; ')
    .find(row => row.startsWith('jwt='))
    ?.split('=')[1];

  // If not found in cookies, try localStorage as fallback
  if (!token) {
    token = localStorage.getItem('authToken');
  }

  return token;
};

/**
 * Set the authentication token in localStorage
 * @param {string} token - The authentication token
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  }
};

/**
 * Remove the authentication token from localStorage
 */
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid token
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
}; 