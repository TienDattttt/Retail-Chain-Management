import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Status Service
 * Handles all status-related API calls
 */
export const statusService = {
  /**
   * Get all statuses
   * @returns {Promise<Array>} List of statuses
   */
  getAll: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.STATUS.BASE);
      return response.data;
    } catch (error) {
      console.error('Failed to get statuses:', error);
      throw error;
    }
  },

  /**
   * Get statuses by entity type
   * @param {string} entityType - Entity type (e.g., 'Product', 'Invoice')
   * @returns {Promise<Array>} List of statuses for entity type
   */
  getByEntityType: async (entityType) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.STATUS.BASE}?entityType=${entityType}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get statuses for ${entityType}:`, error);
      throw error;
    }
  },
};

export default statusService;