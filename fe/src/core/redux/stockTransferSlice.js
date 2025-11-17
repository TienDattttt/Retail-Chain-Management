import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { stockTransferService } from '../api/stockTransferService';

// Async thunks
export const fetchStockTransfers = createAsyncThunk(
    'stockTransfer/fetchStockTransfers',
    async (params, { rejectWithValue }) => {
        try {
            const response = await stockTransferService.getTransfers(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách xuất kho');
        }
    }
);

export const createStockTransfer = createAsyncThunk(
    'stockTransfer/createStockTransfer',
    async (transferData, { rejectWithValue }) => {
        try {
            const response = await stockTransferService.createTransfer(transferData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi tạo phiếu xuất kho');
        }
    }
);

export const fetchTransferDetail = createAsyncThunk(
    'stockTransfer/fetchTransferDetail',
    async (transferId, { rejectWithValue }) => {
        try {
            const response = await stockTransferService.getTransferDetail(transferId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi tải chi tiết phiếu xuất kho');
        }
    }
);

export const deleteStockTransfer = createAsyncThunk(
    'stockTransfer/deleteStockTransfer',
    async (transferId, { rejectWithValue }) => {
        try {
            await stockTransferService.deleteTransfer(transferId);
            return transferId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi xóa phiếu xuất kho');
        }
    }
);

const initialState = {
    transfers: [],
    transferDetail: null,
    loading: false,
    error: null,
    pagination: {
        currentPage: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0
    },
    filters: {
        searchTerm: '',
        fromWarehouseId: null,
        toBranchId: null,
        transferDateFrom: '',
        transferDateTo: '',
        status: ''
    }
};

const stockTransferSlice = createSlice({
    name: 'stockTransfer',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        clearError: (state) => {
            state.error = null;
        },
        clearTransferDetail: (state) => {
            state.transferDetail = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch stock transfers
            .addCase(fetchStockTransfers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStockTransfers.fulfilled, (state, action) => {
                state.loading = false;
                state.transfers = action.payload.content;
                state.pagination = {
                    currentPage: action.payload.number,
                    pageSize: action.payload.size,
                    totalElements: action.payload.totalElements,
                    totalPages: action.payload.totalPages
                };
            })
            .addCase(fetchStockTransfers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create stock transfer
            .addCase(createStockTransfer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createStockTransfer.fulfilled, (state) => {
                state.loading = false;
                // Có thể thêm transfer mới vào danh sách nếu cần
            })
            .addCase(createStockTransfer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch transfer detail
            .addCase(fetchTransferDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransferDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.transferDetail = action.payload;
            })
            .addCase(fetchTransferDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete stock transfer
            .addCase(deleteStockTransfer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteStockTransfer.fulfilled, (state, action) => {
                state.loading = false;
                // Remove deleted transfer from list
                state.transfers = state.transfers.filter(transfer => transfer.id !== action.payload);
            })
            .addCase(deleteStockTransfer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setFilters, setPagination, clearError, clearTransferDetail } = stockTransferSlice.actions;

// Selectors
export const selectStockTransfers = (state) => state.stockTransfer.transfers;
export const selectStockTransferLoading = (state) => state.stockTransfer.loading;
export const selectStockTransferError = (state) => state.stockTransfer.error;
export const selectStockTransferPagination = (state) => state.stockTransfer.pagination;
export const selectStockTransferFilters = (state) => state.stockTransfer.filters;
export const selectTransferDetail = (state) => state.stockTransfer.transferDetail;

export default stockTransferSlice.reducer;