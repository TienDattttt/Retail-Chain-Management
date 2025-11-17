import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Voucher Campaign Service
 * Handles all voucher campaign-related API calls
 */
export const voucherService = {
  /**
   * Get all voucher campaigns
   * @returns {Promise<Array>} List of voucher campaigns
   */
  getAll: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.VOUCHER_CAMPAIGNS.BASE);
      return response.data;
    } catch (error) {
      console.error('Failed to get voucher campaigns:', error);
      throw error;
    }
  },

  /**
   * Get voucher campaign by ID
   * @param {number} id - Voucher campaign ID
   * @returns {Promise<Object>} Voucher campaign data
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.VOUCHER_CAMPAIGNS.BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get voucher campaign:', error);
      throw error;
    }
  },

  /**
   * Create or update voucher campaign
   * @param {Object} voucherData - Voucher campaign data
   * @returns {Promise<Object>} Created/updated voucher campaign
   */
  upsert: async (voucherData) => {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.VOUCHER_CAMPAIGNS.BASE}/upsert`, voucherData);
      return response.data;
    } catch (error) {
      console.error('Failed to upsert voucher campaign:', error);
      throw error;
    }
  },

  /**
   * Generate vouchers from campaign
   * @param {number} campaignId - Campaign ID
   * @param {number} quantity - Number of vouchers to generate
   * @returns {Promise<Object>} Generated vouchers
   */
  generateVouchers: async (campaignId, quantity) => {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.VOUCHER_CAMPAIGNS.BASE}/${campaignId}/generate-vouchers?quantity=${quantity}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to generate vouchers:', error);
      throw error;
    }
  },

  /**
   * Get vouchers by campaign ID
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<Array>} List of vouchers
   */
  getVouchersByCampaign: async (campaignId) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.VOUCHERS.BASE}/by-campaign/${campaignId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get vouchers by campaign:', error);
      throw error;
    }
  }
};