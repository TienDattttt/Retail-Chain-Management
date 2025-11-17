import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { purchaseService } from '../api/purchaseService';
import { ERROR_MESSAGES } from '../utils/constants';

// Async thunks
export const fetchPurchaseOrders = createAsyncThunk(
  'purchase/fetchPurchaseOrders',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await purchaseService.getPurchaseOrders(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    }
  }
);

export const processPurchaseOrder = createAsyncThunk(
  'purchase/processPurchaseOrder',
  async (purchaseData, { rejectWithValue }) => {
    try {
      const response = await purchaseService.processPurchaseOrder(purchaseData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || ERROR_MESSAGES.OPERATION_FAILED);
    }
  }
);

const initialState = {
  purchaseOrders: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 0,
    pageSize: 20,
    totalElements: 0,
    totalPages: 0,
  },
  filters: {
    searchTerm: '',
    supplierId: null,
    warehouseId: null,
    purchaseDateFrom: null,
    purchaseDateTo: null,
    sortBy: 'createdDate',
    sortDirection: 'DESC',
  },
};

const purchaseSlice = createSlice({
  name: 'purchase',
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
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch purchase orders
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrders = action.payload.content || [];
        state.pagination = {
          currentPage: action.payload.number || 0,
          pageSize: action.payload.size || 20,
          totalElements: action.payload.totalElements || 0,
          totalPages: action.payload.totalPages || 0,
        };
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Process purchase order
      .addCase(processPurchaseOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processPurchaseOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(processPurchaseOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  setPagination,
  clearError,
  resetFilters,
} = purchaseSlice.actions;

// Selectors
export const selectPurchaseOrders = (state) => state.purchase.purchaseOrders;
export const selectPurchaseLoading = (state) => state.purchase.loading;
export const selectPurchaseError = (state) => state.purchase.error;
export const selectPurchasePagination = (state) => state.purchase.pagination;
export const selectPurchaseFilters = (state) => state.purchase.filters;

export default purchaseSlice.reducer;