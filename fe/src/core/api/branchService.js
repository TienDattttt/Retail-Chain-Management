import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/environment';

/**
 * Branch Service
 * Handles all branch-related API calls
 */
export const branchService = {
  /**
   * Get all branches
   * @returns {Promise<Array>} List of branches
   */
  getAll: async () => {
    try {
      console.log('Calling getAll branches API');
      const response = await apiClient.get(API_ENDPOINTS.BRANCHES.BASE);
      console.log('GetAll branches response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to get branches:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  },

  /**
   * Get branch by ID
   * @param {number} id - Branch ID
   * @returns {Promise<Object>} Branch data
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.BRANCHES.BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get branch:', error);
      throw error;
    }
  },

  /**
   * Create or update branch
   * @param {Object} branchData - Branch data
   * @returns {Promise<Object>} Created/updated branch
   */
  upsert: async (branchData) => {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.BRANCHES.BASE}/upsert`, branchData);
      return response.data;
    } catch (error) {
      console.error('Failed to upsert branch:', error);
      throw error;
    }
  },

  /**
   * Toggle branch status by updating with upsert
   * @param {Object} branchData - Branch data with toggled status
   * @returns {Promise<Object>} Updated branch
   */
  toggleStatus: async (branchData) => {
    try {
      console.log('Calling upsert API to toggle status for branch:', branchData);
      const response = await apiClient.post(`${API_ENDPOINTS.BRANCHES.BASE}/upsert`, branchData);
      console.log('Toggle status response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to toggle branch status:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  }
};