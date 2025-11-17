// POS Constants
export const POS_CONSTANTS = {
  // Payment methods
  PAYMENT_METHODS: {
    CASH: 'CASH',
    MOMO: 'MOMO',
    VNPAY: 'VNPAY',
    BANK_TRANSFER: 'BANK_TRANSFER'
  },

  // Payment method labels
  PAYMENT_METHOD_LABELS: {
    CASH: 'Tiền mặt',
    MOMO: 'MoMo',
    VNPAY: 'VNPay',
    BANK_TRANSFER: 'Chuyển khoản'
  },

  // Transaction statuses
  TRANSACTION_STATUS: {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    FAILED: 'FAILED'
  },

  // Invoice statuses
  INVOICE_STATUS: {
    DRAFT: 'DRAFT',
    PENDING: 'PENDING',
    PAID: 'PAID',
    CANCELLED: 'CANCELLED'
  },

  // User roles
  USER_ROLES: {
    ADMIN: 1,
    MANAGER: 2,
    STAFF: 3
  },

  // Default values
  DEFAULTS: {
    CUSTOMER_NAME: 'Khách lẻ',
    CURRENCY: 'VND',
    TAX_RATE: 0.1, // 10%
    DISCOUNT_RATE: 0,
    QUANTITY: 1
  },

  // Validation rules
  VALIDATION: {
    MIN_QUANTITY: 1,
    MAX_QUANTITY: 9999,
    MIN_PRICE: 0,
    MAX_PRICE: 999999999,
    MAX_DISCOUNT_PERCENT: 100
  },

  // UI Constants
  UI: {
    ITEMS_PER_PAGE: 20,
    SEARCH_DEBOUNCE: 300,
    TOAST_DURATION: 3000,
    MODAL_ANIMATION_DURATION: 300
  },

  // Local storage keys
  STORAGE_KEYS: {
    CART: 'pos_cart',
    SELECTED_CUSTOMER: 'pos_selected_customer',
    PAYMENT_METHOD: 'pos_payment_method',
    LAST_TRANSACTION: 'pos_last_transaction'
  },

  // API endpoints
  API_ENDPOINTS: {
    PRODUCTS: '/api/products',
    CUSTOMERS: '/api/customers',
    CATEGORIES: '/api/categories',
    SALES: '/api/sales',
    PAYMENTS: '/api/payments',
    INVOICES: '/api/invoices'
  },

  // Error messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng thử lại.',
    INVALID_QUANTITY: 'Số lượng không hợp lệ.',
    INSUFFICIENT_STOCK: 'Không đủ hàng trong kho.',
    PAYMENT_FAILED: 'Thanh toán thất bại. Vui lòng thử lại.',
    EMPTY_CART: 'Giỏ hàng trống. Vui lòng thêm sản phẩm.',
    INVALID_CUSTOMER: 'Thông tin khách hàng không hợp lệ.'
  },

  // Success messages
  SUCCESS_MESSAGES: {
    PAYMENT_SUCCESS: 'Thanh toán thành công!',
    PRODUCT_ADDED: 'Đã thêm sản phẩm vào giỏ hàng.',
    PRODUCT_REMOVED: 'Đã xóa sản phẩm khỏi giỏ hàng.',
    CART_CLEARED: 'Đã xóa tất cả sản phẩm trong giỏ hàng.',
    CUSTOMER_ADDED: 'Đã thêm khách hàng mới.'
  },

  // Keyboard shortcuts
  SHORTCUTS: {
    SEARCH_PRODUCT: 'F1',
    ADD_CUSTOMER: 'F2',
    CASH_PAYMENT: 'F3',
    MOMO_PAYMENT: 'F4',
    CANCEL_TRANSACTION: 'Escape',
    CLEAR_CART: 'F5'
  }
};

export default POS_CONSTANTS;