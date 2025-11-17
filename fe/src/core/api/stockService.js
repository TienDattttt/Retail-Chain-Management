import apiClient from './apiClient';

/**
 * Stock Management Service
 * Handles all stock management related API calls
 */
export const stockService = {
  /**
   * Get stock management data with filters
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Paginated stock data
   */
  getStockManagement: async (filters = {}) => {
    try {
      console.log('Calling stock management API with filters:', filters);
      
      const params = new URLSearchParams();
      
      // Add all filter parameters
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.branchId) params.append('branchId', filters.branchId);
      if (filters.warehouseId) params.append('warehouseId', filters.warehouseId);
      if (filters.stockStatus) params.append('stockStatus', filters.stockStatus);
      if (filters.page !== undefined) params.append('page', filters.page);
      if (filters.size !== undefined) params.append('size', filters.size);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortDirection) params.append('sortDirection', filters.sortDirection);
      
      const url = `/stock-management?${params.toString()}`;
      console.log('API URL:', url);
      
      const response = await apiClient.get(url);
      console.log('Stock management response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to get stock management:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  }
};

export default stockService;