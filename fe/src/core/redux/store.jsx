import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer';
import authReducer from './authSlice';
import productReducer from './productSlice';
import supplierReducer from './supplierSlice';
import voucherReducer from './voucherSlice';
import branchReducer from './branchSlice';
import stockReducer from './stockSlice';
import purchaseReducer from './purchaseSlice';
import stockTransferReducer from './stockTransferSlice';
import salesReducer from './salesSlice';

const store = configureStore({
  reducer: {
    legacy: rootReducer,
    auth: authReducer,
    products: productReducer,
    suppliers: supplierReducer,
    vouchers: voucherReducer,
    branches: branchReducer,
    stock: stockReducer,
    purchase: purchaseReducer,
    stockTransfer: stockTransferReducer,
    sales: salesReducer,
  },
});

export default store;
