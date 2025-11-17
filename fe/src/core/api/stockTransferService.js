import apiClient from './apiClient';

export const stockTransferService = {
    // Tạo phiếu xuất kho mới
    createTransfer: async (transferData) => {
        try {
            const response = await apiClient.post('/stock-transfers', transferData);
            return response.data;
        } catch (error) {
            console.error('Error creating stock transfer:', error);
            throw error;
        }
    },

    // Lấy danh sách phiếu xuất kho từ backend thật
    getTransfers: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            
            if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
            if (params.fromWarehouseId) queryParams.append('fromWarehouseId', params.fromWarehouseId);
            if (params.toBranchId) queryParams.append('toBranchId', params.toBranchId);
            if (params.transferDateFrom) queryParams.append('transferDateFrom', params.transferDateFrom);
            if (params.transferDateTo) queryParams.append('transferDateTo', params.transferDateTo);
            if (params.status) queryParams.append('status', params.status);
            if (params.page !== undefined) queryParams.append('page', params.page);
            if (params.size !== undefined) queryParams.append('size', params.size);

            const response = await apiClient.get(`/stock-transfers?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching stock transfers:', error);
            throw error;
        }
    },

    // Lấy chi tiết phiếu xuất kho từ backend thật
    getTransferDetail: async (transferId) => {
        try {
            const response = await apiClient.get(`/stock-transfers/${transferId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching transfer detail:', error);
            throw error;
        }
    },

    // Xóa phiếu xuất kho
    deleteTransfer: async (transferId) => {
        try {
            const response = await apiClient.delete(`/stock-transfers/${transferId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting stock transfer:', error);
            throw error;
        }
    }
};