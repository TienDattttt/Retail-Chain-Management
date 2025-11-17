import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Supplier Service
 * Handles all supplier-related API calls
 */
export const supplierService = {
  /**
   * Get all suppliers
   * @returns {Promise<Array>} List of suppliers
   */
  getAll: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SUPPLIERS.BASE);
      return response.data;
    } catch (error) {
      console.error('Failed to get suppliers:', error);
      throw error;
    }
  },

  /**
   * Get supplier by ID
   * @param {number} id - Supplier ID
   * @returns {Promise<Object>} Supplier data
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.SUPPLIERS.BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get supplier:', error);
      throw error;
    }
  },

  /**
   * Create or update supplier
   * @param {Object} supplierData - Supplier data
   * @returns {Promise<Object>} Created/updated supplier
   */
  upsert: async (supplierData) => {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.SUPPLIERS.BASE}/upsert`, supplierData);
      return response.data;
    } catch (error) {
      console.error('Failed to upsert supplier:', error);
      throw error;
    }
  },

  /**
   * Toggle supplier status
   * @param {number} id - Supplier ID
   * @returns {Promise<Object>} Updated supplier
   */
  toggleStatus: async (id) => {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.SUPPLIERS.BASE}/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Failed to toggle supplier status:', error);
      throw error;
    }
  }
};