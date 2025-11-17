import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { branchService } from '../api/branchService';
import { ERROR_MESSAGES } from '../utils/constants';

// Async thunks
export const fetchBranches = createAsyncThunk(
  'branches/fetchBranches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await branchService.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    }
  }
);

export const fetchBranchById = createAsyncThunk(
  'branches/fetchBranchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await branchService.getById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || ERROR_MESSAGES.DATA_NOT_FOUND);
    }
  }
);

export const upsertBranch = createAsyncThunk(
  'branches/upsertBranch',
  async (branchData, { rejectWithValue }) => {
    try {
      const response = await branchService.upsert(branchData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || ERROR_MESSAGES.OPERATION_FAILED);
    }
  }
);

export const toggleBranchStatus = createAsyncThunk(
  'branches/toggleBranchStatus',
  async (branchId, { getState, rejectWithValue }) => {
    try {
      // Lấy thông tin branch hiện tại từ state
      const state = getState();
      const branch = state.branches.branches.find(b => b.id === branchId);
      
      if (!branch) {
        throw new Error('Không tìm thấy thông tin cửa hàng');
      }

      // Tạo data để toggle status
      const branchData = {
        ...branch,
        isActive: !branch.isActive // Toggle status
      };

      const response = await branchService.toggleStatus(branchData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || ERROR_MESSAGES.OPERATION_FAILED);
    }
  }
);

const initialState = {
  branches: [],
  currentBranch: null,
  loading: false,
  error: null,
  searchTerm: '',
  filteredBranches: [],
  statusFilter: 'all', // all, active, inactive
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 0,
  },
};

const branchSlice = createSlice({
  name: 'branches',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.filteredBranches = state.branches.filter(branch => {
        const matchesSearch = branch.name?.toLowerCase().includes(action.payload.toLowerCase()) ||
          branch.address?.toLowerCase().includes(action.payload.toLowerCase()) ||
          branch.email?.toLowerCase().includes(action.payload.toLowerCase()) ||
          branch.phoneNumber?.includes(action.payload);
        
        const matchesStatus = state.statusFilter === 'all' || 
          (state.statusFilter === 'active' && branch.isActive) ||
          (state.statusFilter === 'inactive' && !branch.isActive);
        
        return matchesSearch && matchesStatus;
      });
      state.pagination.currentPage = 1;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
      state.filteredBranches = state.branches.filter(branch => {
        const matchesSearch = branch.name?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          branch.address?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          branch.email?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          branch.phoneNumber?.includes(state.searchTerm);
        
        const matchesStatus = action.payload === 'all' || 
          (action.payload === 'active' && branch.isActive) ||
          (action.payload === 'inactive' && !branch.isActive);
        
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
    clearCurrentBranch: (state) => {
      state.currentBranch = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch branches
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = action.payload;
        state.filteredBranches = action.payload;
        state.pagination.total = action.payload.length;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch branch by ID
      .addCase(fetchBranchById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranchById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBranch = action.payload;
      })
      .addCase(fetchBranchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Upsert branch
      .addCase(upsertBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upsertBranch.fulfilled, (state, action) => {
        state.loading = false;
        const branchData = action.payload.data;
        
        if (branchData.id) {
          // Update existing branch
          const index = state.branches.findIndex(b => b.id === branchData.id);
          if (index !== -1) {
            state.branches[index] = branchData;
          }
        } else {
          // Add new branch
          state.branches.push(branchData);
        }
        
        // Update filtered branches
        state.filteredBranches = state.branches.filter(branch => {
          const matchesSearch = branch.name?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            branch.address?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            branch.email?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            branch.phoneNumber?.includes(state.searchTerm);
          
          const matchesStatus = state.statusFilter === 'all' || 
            (state.statusFilter === 'active' && branch.isActive) ||
            (state.statusFilter === 'inactive' && !branch.isActive);
          
          return matchesSearch && matchesStatus;
        });
        
        state.pagination.total = state.filteredBranches.length;
      })
      .addCase(upsertBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Toggle branch status
      .addCase(toggleBranchStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleBranchStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBranch = action.payload.data;
        
        // Update branch in the list
        const index = state.branches.findIndex(b => b.id === updatedBranch.id);
        if (index !== -1) {
          state.branches[index] = updatedBranch;
        }
        
        // Update filtered branches
        state.filteredBranches = state.branches.filter(branch => {
          const matchesSearch = branch.name?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            branch.address?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            branch.email?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            branch.phoneNumber?.includes(state.searchTerm);
          
          const matchesStatus = state.statusFilter === 'all' || 
            (state.statusFilter === 'active' && branch.isActive) ||
            (state.statusFilter === 'inactive' && !branch.isActive);
          
          return matchesSearch && matchesStatus;
        });
        
        state.pagination.total = state.filteredBranches.length;
      })
      .addCase(toggleBranchStatus.rejected, (state, action) => {
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
  clearCurrentBranch,
} = branchSlice.actions;

// Selectors
export const selectBranches = (state) => state.branches.branches;
export const selectFilteredBranches = (state) => state.branches.filteredBranches;
export const selectCurrentBranch = (state) => state.branches.currentBranch;
export const selectBranchesLoading = (state) => state.branches.loading;
export const selectBranchesError = (state) => state.branches.error;
export const selectBranchesPagination = (state) => state.branches.pagination;
export const selectBranchesSearchTerm = (state) => state.branches.searchTerm;
export const selectBranchesStatusFilter = (state) => state.branches.statusFilter;

// Paginated branches selector
export const selectPaginatedBranches = (state) => {
  const { filteredBranches, pagination } = state.branches;
  const { currentPage, pageSize } = pagination;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return filteredBranches.slice(startIndex, endIndex);
};

export default branchSlice.reducer;