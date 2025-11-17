import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import salesService from '../api/salesService';

// Async thunks
export const fetchCustomers = createAsyncThunk(
  'sales/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      return await salesService.getCustomers();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchProductsByBranch = createAsyncThunk(
  'sales/fetchProductsByBranch',
  async (branchId, { rejectWithValue }) => {
    try {
      return await salesService.getProductsByBranch(branchId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'sales/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await salesService.getCategories();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const processSale = createAsyncThunk(
  'sales/processSale',
  async (saleData, { rejectWithValue }) => {
    try {
      return await salesService.processSale(saleData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchProductInventory = createAsyncThunk(
  'sales/fetchProductInventory',
  async ({ branchId, productId }, { rejectWithValue }) => {
    try {
      return await salesService.getProductInventory(branchId, productId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  customers: [],
  products: [],
  categories: [],
  cart: [],
  selectedCustomer: null,
  selectedCategory: null,
  total: 0,
  discount: 0,
  discountRatio: 0,
  paymentMethod: 'CASH',
  loading: false,
  error: null,
  saleResult: null,
  productInventory: {}
};

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.cart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({
          product: product,
          quantity: 1,
          unitPrice: product.retailPrice,
          discount: 0
        });
      }
      
      salesSlice.caseReducers.calculateTotal(state);
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cart = state.cart.filter(item => item.product.id !== productId);
      salesSlice.caseReducers.calculateTotal(state);
    },

    updateCartItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cart.find(item => item.product.id === productId);
      
      if (item && quantity > 0) {
        item.quantity = quantity;
        salesSlice.caseReducers.calculateTotal(state);
      }
    },

    updateCartItemDiscount: (state, action) => {
      const { productId, discount } = action.payload;
      const item = state.cart.find(item => item.product.id === productId);
      
      if (item) {
        item.discount = discount;
        salesSlice.caseReducers.calculateTotal(state);
      }
    },

    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },

    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },

    setDiscount: (state, action) => {
      state.discount = action.payload;
      salesSlice.caseReducers.calculateTotal(state);
    },

    setDiscountRatio: (state, action) => {
      state.discountRatio = action.payload;
      salesSlice.caseReducers.calculateTotal(state);
    },

    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },

    clearCart: (state) => {
      state.cart = [];
      state.total = 0;
      state.discount = 0;
      state.discountRatio = 0;
      state.selectedCustomer = null;
      state.saleResult = null;
    },

    calculateTotal: (state) => {
      let subtotal = 0;
      
      state.cart.forEach(item => {
        const itemTotal = (item.unitPrice * item.quantity) - (item.discount || 0);
        subtotal += itemTotal;
      });

      // Áp dụng giảm giá tổng
      let totalDiscount = state.discount || 0;
      if (state.discountRatio > 0) {
        totalDiscount += (subtotal * state.discountRatio / 100);
      }

      state.total = Math.max(0, subtotal - totalDiscount);
    },

    clearError: (state) => {
      state.error = null;
    },

    clearSaleResult: (state) => {
      state.saleResult = null;
    }
  },

  extraReducers: (builder) => {
    builder
      // Fetch customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch products by branch
      .addCase(fetchProductsByBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Process sale
      .addCase(processSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processSale.fulfilled, (state, action) => {
        state.loading = false;
        state.saleResult = action.payload;
      })
      .addCase(processSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch product inventory
      .addCase(fetchProductInventory.fulfilled, (state, action) => {
        const { productId, branchId } = action.meta.arg;
        const key = `${productId}_${branchId}`;
        state.productInventory[key] = action.payload;
      });
  }
});

export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  updateCartItemDiscount,
  setSelectedCustomer,
  setSelectedCategory,
  setDiscount,
  setDiscountRatio,
  setPaymentMethod,
  clearCart,
  calculateTotal,
  clearError,
  clearSaleResult
} = salesSlice.actions;

export default salesSlice.reducer;