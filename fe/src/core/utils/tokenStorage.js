import { STORAGE_KEYS } from './constants';

/**
 * Token Storage Utilities
 * Handles secure storage and retrieval of authentication tokens
 */

/**
 * Store authentication token
 * @param {string} token - JWT token
 */
export const setToken = (token) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }
};

/**
 * Get authentication token
 * @returns {string|null} JWT token or null
 */
export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Remove authentication token
 */
export const removeToken = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

/**
 * Store refresh token
 * @param {string} refreshToken - Refresh token
 */
export const setRefreshToken = (refreshToken) => {
  if (refreshToken) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }
};

/**
 * Get refresh token
 * @returns {string|null} Refresh token or null
 */
export const getRefreshToken = () => {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * Remove refresh token
 */
export const removeRefreshToken = () => {
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * Store user data
 * @param {Object} user - User object
 */
export const setUser = (user) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }
};

/**
 * Get user data
 * @returns {Object|null} User object or null
 */
export const getUser = () => {
  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
};

/**
 * Remove user data
 */
export const removeUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  removeToken();
  removeRefreshToken();
  removeUser();
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    return payload.exp && payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} Expiration date or null
 */
export const getTokenExpiration = (token) => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? new Date(payload.exp * 1000) : null;
  } catch (error) {
    console.error('Error getting token expiration:', error);
    return null;
  }
};

/**
 * Get time until token expires (in minutes)
 * @param {string} token - JWT token
 * @returns {number} Minutes until expiration, or 0 if expired
 */
export const getTokenTimeToExpiry = (token) => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return 0;

  const now = new Date();
  const timeToExpiry = expiration.getTime() - now.getTime();
  
  return Math.max(0, Math.floor(timeToExpiry / (1000 * 60)));
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();
  
  if (!token || !user) {
    return false;
  }

  if (isTokenExpired(token)) {
    clearAuthData();
    return false;
  }

  return true;
};

/**
 * Auto-refresh token before expiration
 * @param {Function} refreshCallback - Function to call for token refresh
 * @param {number} minutesBeforeExpiry - Minutes before expiry to refresh (default: 5)
 */
export const setupAutoRefresh = (refreshCallback, minutesBeforeExpiry = 5) => {
  const token = getToken();
  if (!token) return;

  const timeToExpiry = getTokenTimeToExpiry(token);
  
  if (timeToExpiry > minutesBeforeExpiry) {
    const refreshTime = (timeToExpiry - minutesBeforeExpiry) * 60 * 1000;
    
    setTimeout(() => {
      if (isAuthenticated()) {
        refreshCallback();
      }
    }, refreshTime);
  }
};

export default {
  setToken,
  getToken,
  removeToken,
  setRefreshToken,
  getRefreshToken,
  removeRefreshToken,
  setUser,
  getUser,
  removeUser,
  clearAuthData,
  isTokenExpired,
  getTokenExpiration,
  getTokenTimeToExpiry,
  isAuthenticated,
  setupAutoRefresh,
};