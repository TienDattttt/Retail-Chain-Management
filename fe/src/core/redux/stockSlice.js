import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { stockService } from '../api/stockService';
import { ERROR_MESSAGES } from '../utils/constants';

// Async thunks
export const fetchStockManagement = createAsyncThunk(
  'stock/fetchStockManagement',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await stockService.getStockManagement(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    }
  }
);

const initialState = {
  stockData: [],
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
    categoryId: null,
    branchId: null,
    warehouseId: null,
    stockStatus: 'ALL',
    sortBy: 'productName',
    sortDirection: 'ASC',
  },
};

const stockSlice = createSlice({
  name: 'stock',
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
      // Fetch stock management
      .addCase(fetchStockManagement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockManagement.fulfilled, (state, action) => {
        state.loading = false;
        state.stockData = action.payload.content || [];
        state.pagination = {
          currentPage: action.payload.number || 0,
          pageSize: action.payload.size || 20,
          totalElements: action.payload.totalElements || 0,
          totalPages: action.payload.totalPages || 0,
        };
      })
      .addCase(fetchStockManagement.rejected, (state, action) => {
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
} = stockSlice.actions;

// Selectors
export const selectStockData = (state) => state.stock.stockData;
export const selectStockLoading = (state) => state.stock.loading;
export const selectStockError = (state) => state.stock.error;
export const selectStockPagination = (state) => state.stock.pagination;
export const selectStockFilters = (state) => state.stock.filters;

export default stockSlice.reducer;