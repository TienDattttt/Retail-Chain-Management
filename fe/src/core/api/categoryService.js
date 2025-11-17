import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Category Service
 * Handles all category-related API calls
 */
export const categoryService = {
  /**
   * Get all categories
   * @returns {Promise<Array>} List of categories
   */
  getAll: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.BASE);
      return response.data;
    } catch (error) {
      console.error('Failed to get categories:', error);
      throw error;
    }
  },

  /**
   * Get category tree structure
   * @returns {Promise<Array>} Category tree
   */
  getTree: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.TREE);
      return response.data;
    } catch (error) {
      console.error('Failed to get category tree:', error);
      throw error;
    }
  },

  /**
   * Create or update category
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} API response
   */
  upsert: async (categoryData) => {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.CATEGORIES.BASE}/upsert`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Failed to upsert category:', error);
      throw error;
    }
  },

  /**
   * Toggle category status
   * @param {number} categoryId - Category ID
   * @param {boolean} isDeleted - New deleted status
   * @returns {Promise<Object>} API response
   */
  toggleStatus: async (categoryId, isDeleted) => {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.CATEGORIES.BASE}/toggle-status/${categoryId}?isDeleted=${isDeleted}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to toggle category status ${categoryId}:`, error);
      throw error;
    }
  },

  /**
   * Delete category (soft delete)
   * @param {number} categoryId - Category ID
   * @returns {Promise<Object>} API response
   */
  delete: async (categoryId) => {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.CATEGORIES.BASE}/delete/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete category ${categoryId}:`, error);
      throw error;
    }
  },
};

export default categoryService;