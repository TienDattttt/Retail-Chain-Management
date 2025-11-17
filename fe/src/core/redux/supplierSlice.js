import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supplierService } from '../api/supplierService';
import { ERROR_MESSAGES } from '../utils/constants';

// Async thunks
export const fetchSuppliers = createAsyncThunk(
  'suppliers/fetchSuppliers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await supplierService.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    }
  }
);

export const fetchSupplierById = createAsyncThunk(
  'suppliers/fetchSupplierById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await supplierService.getById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || ERROR_MESSAGES.DATA_NOT_FOUND);
    }
  }
);

export const upsertSupplier = createAsyncThunk(
  'suppliers/upsertSupplier',
  async (supplierData, { rejectWithValue }) => {
    try {
      const response = await supplierService.upsert(supplierData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || ERROR_MESSAGES.OPERATION_FAILED);
    }
  }
);

export const toggleSupplierStatus = createAsyncThunk(
  'suppliers/toggleSupplierStatus',
  async (supplierId, { rejectWithValue }) => {
    try {
      const response = await supplierService.toggleStatus(supplierId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || ERROR_MESSAGES.OPERATION_FAILED);
    }
  }
);

const initialState = {
  suppliers: [],
  currentSupplier: null,
  loading: false,
  error: null,
  searchTerm: '',
  statusFilter: 'all',
  filteredSuppliers: [],
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 0,
  },
};

const supplierSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.filteredSuppliers = state.suppliers.filter(supplier => {
        const matchesSearch = supplier.name?.toLowerCase().includes(action.payload.toLowerCase()) ||
          supplier.code?.toLowerCase().includes(action.payload.toLowerCase()) ||
          supplier.email?.toLowerCase().includes(action.payload.toLowerCase()) ||
          supplier.contactNumber?.includes(action.payload);
        
        const matchesStatus = state.statusFilter === 'all' || 
          (state.statusFilter === 'active' && supplier.isActive) ||
          (state.statusFilter === 'inactive' && !supplier.isActive);
        
        return matchesSearch && matchesStatus;
      });
      state.pagination.currentPage = 1;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
      state.filteredSuppliers = state.suppliers.filter(supplier => {
        const matchesSearch = supplier.name?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          supplier.code?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          supplier.email?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          supplier.contactNumber?.includes(state.searchTerm);
        
        const matchesStatus = action.payload === 'all' || 
          (action.payload === 'active' && supplier.isActive) ||
          (action.payload === 'inactive' && !supplier.isActive);
        
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
    clearCurrentSupplier: (state) => {
      state.currentSupplier = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch suppliers
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = action.payload;
        state.filteredSuppliers = action.payload;
        state.pagination.total = action.payload.length;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch supplier by ID
      .addCase(fetchSupplierById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupplierById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSupplier = action.payload;
      })
      .addCase(fetchSupplierById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Upsert supplier
      .addCase(upsertSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upsertSupplier.fulfilled, (state, action) => {
        state.loading = false;
        const supplierData = action.payload.data;
        
        if (supplierData.id) {
          // Update existing supplier
          const index = state.suppliers.findIndex(s => s.id === supplierData.id);
          if (index !== -1) {
            state.suppliers[index] = supplierData;
          }
        } else {
          // Add new supplier
          state.suppliers.push(supplierData);
        }
        
        // Update filtered suppliers
        state.filteredSuppliers = state.suppliers.filter(supplier => {
          const matchesSearch = supplier.name?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            supplier.code?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            supplier.email?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            supplier.contactNumber?.includes(state.searchTerm);
          
          const matchesStatus = state.statusFilter === 'all' || 
            (state.statusFilter === 'active' && supplier.isActive) ||
            (state.statusFilter === 'inactive' && !supplier.isActive);
          
          return matchesSearch && matchesStatus;
        });
        
        state.pagination.total = state.filteredSuppliers.length;
      })
      .addCase(upsertSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Toggle supplier status
      .addCase(toggleSupplierStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleSupplierStatus.fulfilled, (state, action) => {
        state.loading = false;
        const supplierData = action.payload.data;
        
        // Update supplier in the list
        const index = state.suppliers.findIndex(s => s.id === supplierData.id);
        if (index !== -1) {
          state.suppliers[index] = supplierData;
        }
        
        // Update filtered suppliers
        state.filteredSuppliers = state.suppliers.filter(supplier => {
          const matchesSearch = supplier.name?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            supplier.code?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            supplier.email?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            supplier.contactNumber?.includes(state.searchTerm);
          
          const matchesStatus = state.statusFilter === 'all' || 
            (state.statusFilter === 'active' && supplier.isActive) ||
            (state.statusFilter === 'inactive' && !supplier.isActive);
          
          return matchesSearch && matchesStatus;
        });
      })
      .addCase(toggleSupplierStatus.rejected, (state, action) => {
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
  clearCurrentSupplier,
} = supplierSlice.actions;

// Selectors
export const selectSuppliers = (state) => state.suppliers.suppliers;
export const selectFilteredSuppliers = (state) => state.suppliers.filteredSuppliers;
export const selectCurrentSupplier = (state) => state.suppliers.currentSupplier;
export const selectSuppliersLoading = (state) => state.suppliers.loading;
export const selectSuppliersError = (state) => state.suppliers.error;
export const selectSuppliersPagination = (state) => state.suppliers.pagination;
export const selectSuppliersSearchTerm = (state) => state.suppliers.searchTerm;

// Paginated suppliers selector
export const selectPaginatedSuppliers = (state) => {
  const { filteredSuppliers, pagination } = state.suppliers;
  const { currentPage, pageSize } = pagination;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return filteredSuppliers.slice(startIndex, endIndex);
};

export default supplierSlice.reducer;