import apiClient from './apiClient';

/**
 * Purchase Order Service
 * Handles all purchase order related API calls
 */
export const purchaseService = {
  /**
   * Get purchase orders with filters
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Paginated purchase order data
   */
  getPurchaseOrders: async (filters = {}) => {
    try {
      console.log('Calling purchase orders API with filters:', filters);
      
      const params = new URLSearchParams();
      
      // Add all filter parameters
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.supplierId) params.append('supplierId', filters.supplierId);
      if (filters.warehouseId) params.append('warehouseId', filters.warehouseId);
      if (filters.statusId) params.append('statusId', filters.statusId);
      if (filters.purchaseDateFrom) params.append('purchaseDateFrom', filters.purchaseDateFrom);
      if (filters.purchaseDateTo) params.append('purchaseDateTo', filters.purchaseDateTo);
      if (filters.page !== undefined) params.append('page', filters.page);
      if (filters.size !== undefined) params.append('size', filters.size);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortDirection) params.append('sortDirection', filters.sortDirection);
      
      const url = `/purchase-orders?${params.toString()}`;
      console.log('API URL:', url);
      
      const response = await apiClient.get(url);
      console.log('Purchase orders response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to get purchase orders:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  },

  /**
   * Process purchase order
   * @param {Object} purchaseData - Purchase order data
   * @returns {Promise<Object>} Response message
   */
  processPurchaseOrder: async (purchaseData) => {
    try {
      console.log('Processing purchase order with data:', purchaseData);
      
      // Helper function to format date to LocalDateTime
      const formatToLocalDateTime = (dateString) => {
        if (!dateString || dateString.trim() === '') return null;
        // Convert YYYY-MM-DD to YYYY-MM-DDTHH:mm:ss format
        return `${dateString}T00:00:00`;
      };

      // Helper function to format date to LocalDate
      const formatToLocalDate = (dateString) => {
        if (!dateString || dateString.trim() === '') return null;
        // Keep YYYY-MM-DD format for LocalDate
        return dateString;
      };

      // Format data to match backend expectations
      const formattedData = {
        supplierId: purchaseData.supplierId,
        expectedDeliveryDate: formatToLocalDateTime(purchaseData.expectedDeliveryDate),
        deliveryDate: formatToLocalDateTime(purchaseData.deliveryDate),
        description: purchaseData.description || '',
        total: purchaseData.total || 0,
        totalPayment: purchaseData.totalPayment || 0,
        discount: purchaseData.discount || 0,
        discountRatio: purchaseData.discountRatio || 0,
        createdBy: purchaseData.createdBy || 1,
        items: purchaseData.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || 0,
          expiredDate: formatToLocalDate(item.expiredDate)
        }))
      };
      
      console.log('Formatted data for API:', formattedData);
      
      const response = await apiClient.post('/purchase-orders/process', formattedData);
      console.log('Purchase order process response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to process purchase order:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  },

  /**
   * Get purchase order print data
   * @param {number} id - Purchase order ID
   * @returns {Promise<Object>} Print data
   */
  getPrintData: async (id) => {
    try {
      const response = await apiClient.get(`/purchase-orders/${id}/print`);
      return response.data;
    } catch (error) {
      console.error('Failed to get print data:', error);
      throw error;
    }
  }
};

export default purchaseService;