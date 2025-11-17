import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { voucherService } from '../api/voucherService';
import { ERROR_MESSAGES } from '../utils/constants';

// Async thunks
export const fetchVouchers = createAsyncThunk(
  'vouchers/fetchVouchers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await voucherService.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    }
  }
);

export const fetchVoucherById = createAsyncThunk(
  'vouchers/fetchVoucherById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await voucherService.getById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || ERROR_MESSAGES.DATA_NOT_FOUND);
    }
  }
);

export const upsertVoucher = createAsyncThunk(
  'vouchers/upsertVoucher',
  async (voucherData, { rejectWithValue }) => {
    try {
      const response = await voucherService.upsert(voucherData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || ERROR_MESSAGES.OPERATION_FAILED);
    }
  }
);

const initialState = {
  vouchers: [],
  currentVoucher: null,
  loading: false,
  error: null,
  searchTerm: '',
  filteredVouchers: [],
  statusFilter: 'all', // all, active, inactive
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 0,
  },
};

const voucherSlice = createSlice({
  name: 'vouchers',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.filteredVouchers = state.vouchers.filter(voucher => {
        const matchesSearch = voucher.name?.toLowerCase().includes(action.payload.toLowerCase()) ||
          voucher.code?.toLowerCase().includes(action.payload.toLowerCase()) ||
          voucher.description?.toLowerCase().includes(action.payload.toLowerCase());
        
        const matchesStatus = state.statusFilter === 'all' || 
          (state.statusFilter === 'active' && voucher.isActive) ||
          (state.statusFilter === 'inactive' && !voucher.isActive);
        
        return matchesSearch && matchesStatus;
      });
      state.pagination.currentPage = 1;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
      state.filteredVouchers = state.vouchers.filter(voucher => {
        const matchesSearch = voucher.name?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          voucher.code?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          voucher.description?.toLowerCase().includes(state.searchTerm.toLowerCase());
        
        const matchesStatus = action.payload === 'all' || 
          (action.payload === 'active' && voucher.isActive) ||
          (action.payload === 'inactive' && !voucher.isActive);
        
        return matchesSearch && matchesStatus;
      });
      state.pagination.currentPage = 1;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentVoucher: (state) => {
      state.currentVoucher = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch vouchers
      .addCase(fetchVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVouchers.fulfilled, (state, action) => {
        state.loading = false;
        state.vouchers = action.payload;
        state.filteredVouchers = action.payload;
        state.pagination.total = action.payload.length;
      })
      .addCase(fetchVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch voucher by ID
      .addCase(fetchVoucherById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVoucherById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVoucher = action.payload;
      })
      .addCase(fetchVoucherById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Upsert voucher
      .addCase(upsertVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upsertVoucher.fulfilled, (state, action) => {
        state.loading = false;
        const voucherData = action.payload.data;
        
        if (voucherData.id) {
          // Update existing voucher
          const index = state.vouchers.findIndex(v => v.id === voucherData.id);
          if (index !== -1) {
            state.vouchers[index] = voucherData;
          }
        } else {
          // Add new voucher
          state.vouchers.push(voucherData);
        }
        
        // Update filtered vouchers
        state.filteredVouchers = state.vouchers.filter(voucher => {
          const matchesSearch = voucher.name?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            voucher.code?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            voucher.description?.toLowerCase().includes(state.searchTerm.toLowerCase());
          
          const matchesStatus = state.statusFilter === 'all' || 
            (state.statusFilter === 'active' && voucher.isActive) ||
            (state.statusFilter === 'inactive' && !voucher.isActive);
          
          return matchesSearch && matchesStatus;
        });
        
        state.pagination.total = state.filteredVouchers.length;
      })
      .addCase(upsertVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearchTerm,
  setStatusFilter,
  setPagination,
  clearError,
  clearCurrentVoucher,
} = voucherSlice.actions;

// Selectors
export const selectVouchers = (state) => state.vouchers.vouchers;
export const selectFilteredVouchers = (state) => state.vouchers.filteredVouchers;
export const selectCurrentVoucher = (state) => state.vouchers.currentVoucher;
export const selectVouchersLoading = (state) => state.vouchers.loading;
export const selectVouchersError = (state) => state.vouchers.error;
export const selectVouchersPagination = (state) => state.vouchers.pagination;
export const selectVouchersSearchTerm = (state) => state.vouchers.searchTerm;
export const selectVouchersStatusFilter = (state) => state.vouchers.statusFilter;

// Paginated vouchers selector
export const selectPaginatedVouchers = (state) => {
  const { filteredVouchers, pagination } = state.vouchers;
  const { currentPage, pageSize } = pagination;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return filteredVouchers.slice(startIndex, endIndex);
};

export default voucherSlice.reducer;