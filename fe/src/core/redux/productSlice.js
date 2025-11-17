import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../api/productService';
import categoryService from '../api/categoryService';
import { UI_CONSTANTS } from '../utils/constants';

// Async thunks for product actions
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getAll();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch products';
      return rejectWithValue(message);
    }
  }
);

export const fetchProductsPaged = createAsyncThunk(
  'products/fetchPaged',
  async ({ page = 0, size = 10, sortBy = 'name', sortDir = 'asc' }, { rejectWithValue }) => {
    try {
      console.log('Fetching paginated products:', { page, size, sortBy, sortDir });
      const response = await productService.getAllPaged(page, size, sortBy, sortDir);
      console.log('Paginated response:', response);
      return response;
    } catch (error) {
      console.error('Paginated API failed, trying fallback:', error);
      // Fallback to regular API if paginated API fails
      try {
        const fallbackResponse = await productService.getAll();
        // Simulate pagination structure
        const startIndex = page * size;
        const endIndex = startIndex + size;
        const paginatedData = fallbackResponse.slice(startIndex, endIndex);
        
        return {
          content: paginatedData,
          number: page,
          size: size,
          totalElements: fallbackResponse.length,
          totalPages: Math.ceil(fallbackResponse.length / size),
          first: page === 0,
          last: page >= Math.ceil(fallbackResponse.length / size) - 1
        };
      } catch (fallbackError) {
        const message = error.response?.data?.message || error.message || 'Failed to fetch paginated products';
        return rejectWithValue(message);
      }
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productService.getById(productId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch product';
      return rejectWithValue(message);
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/search',
  async (keyword, { rejectWithValue }) => {
    try {
      const response = await productService.search(keyword);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to search products';
      return rejectWithValue(message);
    }
  }
);

export const searchProductsPaged = createAsyncThunk(
  'products/searchPaged',
  async ({ keyword, page = 0, size = 10, sortBy = 'name', sortDir = 'asc' }, { rejectWithValue }) => {
    try {
      const response = await productService.searchPaged(keyword, page, size, sortBy, sortDir);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to search paginated products';
      return rejectWithValue(message);
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await productService.getByCategory(categoryId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch products by category';
      return rejectWithValue(message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productService.upsert(productData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create product';
      return rejectWithValue(message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productService.upsert(productData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update product';
      return rejectWithValue(message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productService.delete(productId);
      return { productId, response };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete product';
      return rejectWithValue(message);
    }
  }
);

export const uploadProductImage = createAsyncThunk(
  'products/uploadImage',
  async ({ productId, file }, { rejectWithValue }) => {
    try {
      const response = await productService.uploadImage(productId, file);
      return { productId, imageUrl: response.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to upload image';
      return rejectWithValue(message);
    }
  }
);

// Async thunks for categories
export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.getAll();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch categories';
      return rejectWithValue(message);
    }
  }
);

export const createCategory = createAsyncThunk(
  'products/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await categoryService.upsert(categoryData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create category';
      return rejectWithValue(message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'products/updateCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await categoryService.upsert(categoryData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update category';
      return rejectWithValue(message);
    }
  }
);

export const toggleCategoryStatus = createAsyncThunk(
  'products/toggleCategoryStatus',
  async ({ categoryId, isDeleted }, { rejectWithValue }) => {
    try {
      const response = await categoryService.toggleStatus(categoryId, isDeleted);
      return { categoryId, isDeleted, response };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to toggle category status';
      return rejectWithValue(message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'products/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await categoryService.delete(categoryId);
      return { categoryId, response };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete category';
      return rejectWithValue(message);
    }
  }
);

export const fetchCategoryTree = createAsyncThunk(
  'products/fetchCategoryTree',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.getTree();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch category tree';
      return rejectWithValue(message);
    }
  }
);

export const fetchProductsWithStock = createAsyncThunk(
  'products/fetchWithStock',
  async ({ warehouseId, branchId }, { rejectWithValue }) => {
    try {
      const response = await productService.getAllWithStock(warehouseId, branchId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch products with stock';
      return rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  // Products
  products: [],
  currentProduct: null,
  searchResults: [],
  
  // Categories
  categories: [],
  categoryTree: [],
  
  // UI states
  loading: UI_CONSTANTS.LOADING_STATES.IDLE,
  error: null,
  
  // Filters
  filters: {
    category: null,
    search: '',
    status: 'Active',
  },
  
  // Pagination
  pagination: {
    page: 0,
    size: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  },
};

// Product slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear current product
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    
    // Clear search results
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    
    // Update filters
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Update pagination
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    
    // Set current product
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.LOADING;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.SUCCESS;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.ERROR;
        state.error = action.payload;
      })
      
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.LOADING;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.SUCCESS;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.ERROR;
        state.error = action.payload;
      })
      
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.LOADING;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.SUCCESS;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.ERROR;
        state.error = action.payload;
      })
      
      // Fetch products paged
      .addCase(fetchProductsPaged.pending, (state) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.LOADING;
        state.error = null;
      })
      .addCase(fetchProductsPaged.fulfilled, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.SUCCESS;
        state.products = action.payload.content || [];
        state.pagination = {
          page: action.payload.number || 0,
          size: action.payload.size || 10,
          total: action.payload.totalElements || 0,
          totalPages: action.payload.totalPages || 0,
          hasNext: !action.payload.last,
          hasPrevious: !action.payload.first,
        };
        state.error = null;
      })
      .addCase(fetchProductsPaged.rejected, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.ERROR;
        state.error = action.payload;
      })
      
      // Search products paged
      .addCase(searchProductsPaged.pending, (state) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.LOADING;
        state.error = null;
      })
      .addCase(searchProductsPaged.fulfilled, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.SUCCESS;
        state.products = action.payload.content || [];
        state.pagination = {
          page: action.payload.number || 0,
          size: action.payload.size || 10,
          total: action.payload.totalElements || 0,
          totalPages: action.payload.totalPages || 0,
          hasNext: !action.payload.last,
          hasPrevious: !action.payload.first,
        };
        state.error = null;
      })
      .addCase(searchProductsPaged.rejected, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.ERROR;
        state.error = action.payload;
      })
      
      // Fetch products by category
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.LOADING;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.SUCCESS;
        if (action.payload.data) {
          state.products.unshift(action.payload.data);
        }
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.ERROR;
        state.error = action.payload;
      })
      
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.LOADING;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.SUCCESS;
        if (action.payload.data) {
          const index = state.products.findIndex(p => p.id === action.payload.data.id);
          if (index !== -1) {
            state.products[index] = action.payload.data;
          }
          state.currentProduct = action.payload.data;
        }
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.ERROR;
        state.error = action.payload;
      })
      
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const { productId } = action.payload;
        state.products = state.products.filter(p => p.id !== productId);
      })
      
      // Upload image
      .addCase(uploadProductImage.fulfilled, (state, action) => {
        const { productId, imageUrl } = action.payload;
        const product = state.products.find(p => p.id === productId);
        if (product) {
          product.imageUrl = imageUrl;
        }
        if (state.currentProduct && state.currentProduct.id === productId) {
          state.currentProduct.imageUrl = imageUrl;
        }
      })
      
      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      
      // Create category
      .addCase(createCategory.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.categories.push(action.payload.data);
        }
      })
      
      // Update category
      .addCase(updateCategory.fulfilled, (state, action) => {
        if (action.payload.data) {
          const index = state.categories.findIndex(c => c.id === action.payload.data.id);
          if (index !== -1) {
            state.categories[index] = action.payload.data;
          }
        }
      })
      
      // Toggle category status
      .addCase(toggleCategoryStatus.fulfilled, (state, action) => {
        const { categoryId, isDeleted } = action.payload;
        const category = state.categories.find(c => c.id === categoryId);
        if (category) {
          category.isDeleted = isDeleted;
        }
      })
      
      // Delete category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        const { categoryId } = action.payload;
        const category = state.categories.find(c => c.id === categoryId);
        if (category) {
          category.isDeleted = true;
        }
      })
      
      // Fetch category tree
      .addCase(fetchCategoryTree.fulfilled, (state, action) => {
        state.categoryTree = action.payload;
      })
      
      // Fetch products with stock
      .addCase(fetchProductsWithStock.pending, (state) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.LOADING;
        state.error = null;
      })
      .addCase(fetchProductsWithStock.fulfilled, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.SUCCESS;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProductsWithStock.rejected, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.ERROR;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearError,
  clearCurrentProduct,
  clearSearchResults,
  updateFilters,
  updatePagination,
  setCurrentProduct,
} = productSlice.actions;

// Selectors
export const selectProducts = (state) => state.products.products;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectSearchResults = (state) => state.products.searchResults;
export const selectCategories = (state) => state.products.categories;
export const selectCategoryTree = (state) => state.products.categoryTree;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectProductsFilters = (state) => state.products.filters;
export const selectProductsPagination = (state) => state.products.pagination;

// Export reducer
export default productSlice.reducer;