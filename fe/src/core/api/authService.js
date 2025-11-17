import apiClient from './apiClient';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export const authService = {
  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.userName - Username
   * @param {string} credentials.password - Password
   * @returns {Promise<Object>} Authentication response
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        userName: credentials.userName,
        password: credentials.password,
      });

      const authData = response.data;
      
      // Store authentication data
      if (authData.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, authData.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({
          userId: authData.userId,
          userName: authData.userName,
          givenName: authData.givenName,
          role: authData.role,
          active: authData.active,
          branch: authData.branch || null,
        }));
      }

      return authData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Authentication response
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      
      const authData = response.data;
      
      // Store authentication data
      if (authData.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, authData.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({
          userId: authData.userId,
          userName: authData.userName,
          givenName: authData.givenName,
          role: authData.role,
          active: authData.active,
        }));
      }

      return authData;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      // Call logout endpoint if available
      // await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      
      // Clear local storage
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local storage even if API call fails
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
      return response.data;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is authenticated
   */
  isAuthenticated: () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    
    if (!token || !user) {
      return false;
    }

    try {
      // Check if token is expired (basic check)
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (tokenPayload.exp && tokenPayload.exp < currentTime) {
        // Token expired, clear storage
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking token validity:', error);
      return false;
    }
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} Current user data or null
   */
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  /**
   * Get current token from localStorage
   * @returns {string|null} Current token or null
   */
  getToken: () => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  /**
   * Refresh authentication token
   * @returns {Promise<Object>} New authentication data
   */
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
        refreshToken,
      });

      const authData = response.data;
      
      // Update stored tokens
      if (authData.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, authData.token);
        if (authData.refreshToken) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken);
        }
      }

      return authData;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear all auth data on refresh failure
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      throw error;
    }
  },

  /**
   * Check if user has specific role
   * @param {number} requiredRole - Required role level
   * @returns {boolean} True if user has required role
   */
  hasRole: (requiredRole) => {
    const user = authService.getCurrentUser();
    if (!user || !user.role) return false;
    
    // Admin (role 1) has all permissions
    if (user.role === 1) return true;
    
    // Check if user role is sufficient (lower number = higher permission)
    return user.role <= requiredRole;
  },

  /**
   * Check if user is admin
   * @returns {boolean} True if user is admin
   */
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 1;
  },

  /**
   * Check if user is manager
   * @returns {boolean} True if user is manager or admin
   */
  isManager: () => {
    const user = authService.getCurrentUser();
    return user && (user.role === 1 || user.role === 2);
  },

  /**
   * Check if user is staff
   * @returns {boolean} True if user is staff, manager, or admin
   */
  isStaff: () => {
    const user = authService.getCurrentUser();
    return user && (user.role === 1 || user.role === 2 || user.role === 3);
  },
};

export default authService;