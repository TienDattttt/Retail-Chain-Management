import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Product Service
 * Handles all product-related API calls
 */
export const productService = {
  /**
   * Get all products
   * @returns {Promise<Array>} List of products
   */
  getAll: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.BASE);
      return response.data;
    } catch (error) {
      console.error('Failed to get products:', error);
      throw error;
    }
  },

  /**
   * Get all products with pagination
   * @param {number} page - Page number (0-based)
   * @param {number} size - Page size
   * @param {string} sortBy - Sort field
   * @param {string} sortDir - Sort direction (asc/desc)
   * @returns {Promise<Object>} Paginated products data
   */
  getAllPaged: async (page = 0, size = 10, sortBy = 'name', sortDir = 'asc') => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS.BASE}/page`, {
        params: { page, size, sortBy, sortDir }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get paginated products:', error);
      throw error;
    }
  },

  /**
   * Get product by ID
   * @param {number} id - Product ID
   * @returns {Promise<Object>} Product data
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get product ${id}:`, error);
      throw error;
    }
  },

  /**
   * Search products by name
   * @param {string} keyword - Search keyword
   * @returns {Promise<Array>} List of matching products
   */
  search: async (keyword) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.SEARCH, {
        params: { q: keyword }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search products:', error);
      throw error;
    }
  },

  /**
   * Search products by name with pagination
   * @param {string} keyword - Search keyword
   * @param {number} page - Page number (0-based)
   * @param {number} size - Page size
   * @param {string} sortBy - Sort field
   * @param {string} sortDir - Sort direction (asc/desc)
   * @returns {Promise<Object>} Paginated search results
   */
  searchPaged: async (keyword, page = 0, size = 10, sortBy = 'name', sortDir = 'asc') => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS.BASE}/search/page`, {
        params: { q: keyword, page, size, sortBy, sortDir }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search paginated products:', error);
      throw error;
    }
  },

  /**
   * Get products by category
   * @param {number} categoryId - Category ID
   * @returns {Promise<Array>} List of products in category
   */
  getByCategory: async (categoryId) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS.BASE}/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get products by category ${categoryId}:`, error);
      throw error;
    }
  },

  /**
   * Get product by barcode
   * @param {string} barcode - Product barcode
   * @returns {Promise<Object>} Product data
   */
  getByBarcode: async (barcode) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS.BASE}/barcode/${barcode}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get product by barcode ${barcode}:`, error);
      throw error;
    }
  },

  /**
   * Create or update product
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} API response
   */
  upsert: async (productData) => {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.PRODUCTS.BASE}/upsert`, productData);
      return response.data;
    } catch (error) {
      console.error('Failed to upsert product:', error);
      throw error;
    }
  },

  /**
   * Upload product image
   * @param {number} productId - Product ID
   * @param {File} file - Image file
   * @returns {Promise<Object>} API response with image URL
   */
  uploadImage: async (productId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post(
        `${API_ENDPOINTS.PRODUCTS.BASE}/${productId}/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to upload product image:', error);
      throw error;
    }
  },

  /**
   * Get product attributes
   * @param {number} productId - Product ID
   * @returns {Promise<Array>} List of product attributes
   */
  getAttributes: async (productId) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS.BASE}/${productId}/attributes`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get attributes for product ${productId}:`, error);
      throw error;
    }
  },

  /**
   * Get product inventories
   * @param {number} productId - Product ID
   * @returns {Promise<Array>} List of product inventories
   */
  getInventories: async (productId) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS.BASE}/${productId}/inventories`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get inventories for product ${productId}:`, error);
      throw error;
    }
  },

  /**
   * Bulk create products
   * @param {Object} bulkData - Bulk create data
   * @returns {Promise<Object>} API response
   */
  bulkCreate: async (bulkData) => {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.PRODUCTS.BASE}/bulk-create`, bulkData);
      return response.data;
    } catch (error) {
      console.error('Failed to bulk create products:', error);
      throw error;
    }
  },

  /**
   * Bulk update products
   * @param {Object} bulkData - Bulk update data
   * @returns {Promise<Object>} API response
   */
  bulkUpdate: async (bulkData) => {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.PRODUCTS.BASE}/bulk-update`, bulkData);
      return response.data;
    } catch (error) {
      console.error('Failed to bulk update products:', error);
      throw error;
    }
  },

  /**
   * Delete product (soft delete)
   * @param {number} productId - Product ID
   * @returns {Promise<Object>} API response
   */
  delete: async (productId) => {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.PRODUCTS.BASE}/upsert`, {
        id: productId,
        status: 'Deleted'
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to delete product ${productId}:`, error);
      throw error;
    }
  },

  /**
   * Get all products with stock information
   * @param {number} warehouseId - Warehouse ID
   * @param {number} branchId - Branch ID
   * @returns {Promise<Array>} List of products with stock
   */
  getAllWithStock: async (warehouseId, branchId) => {
    try {
      const params = {};
      if (warehouseId) params.warehouseId = warehouseId;
      if (branchId) params.branchId = branchId;
      
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS.BASE}/with-stock`, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to get products with stock:', error);
      throw error;
    }
  },
};

export default productService;