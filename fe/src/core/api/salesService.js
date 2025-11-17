import apiClient from './apiClient';

const salesService = {
  // Xử lý bán hàng
  processSale: async (saleData) => {
    try {
      const response = await apiClient.post('/sales/process', saleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy danh sách khách hàng
  getCustomers: async () => {
    try {
      const response = await apiClient.get('/customers');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy sản phẩm theo chi nhánh
  getProductsByBranch: async (branchId) => {
    try {
      const response = await apiClient.get(`/products/branch/${branchId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy danh mục sản phẩm
  getCategories: async () => {
    try {
      const response = await apiClient.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy tồn kho sản phẩm theo chi nhánh
  getProductInventory: async (branchId, productId) => {
    try {
      const response = await apiClient.get(`/inventory/product/${productId}/branch/${branchId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default salesService;