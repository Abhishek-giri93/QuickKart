// API Constants — Single source of truth for all endpoints
// Replace BASE_URL with real backend URL when API contracts are approved

export const BASE_URL = 'http://localhost:5000/api/v1'; // TODO: Update with real URL

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Stores
  STORES: {
    NEARBY: '/stores/nearby',
    DETAIL: (id) => `/stores/${id}`,
    SEARCH: '/stores/search',
  },

  // Products
  PRODUCTS: {
    BY_STORE: (storeId) => `/stores/${storeId}/products`,
    DETAIL: (id) => `/products/${id}`,
    SEARCH: '/products/search',
    CATEGORIES: '/products/categories',
  },

  // Cart
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: '/cart/remove',
    CLEAR: '/cart/clear',
  },

  // Orders
  ORDERS: {
    PLACE: '/orders',
    LIST: '/orders',
    DETAIL: (id) => `/orders/${id}`,
    TRACK: (id) => `/orders/${id}/track`,
    CANCEL: (id) => `/orders/${id}/cancel`,
    REORDER: (id) => `/orders/${id}/reorder`,
  },

  // User
  USER: {
    PROFILE: '/user/profile',
    ADDRESSES: '/user/addresses',
    ADD_ADDRESS: '/user/addresses',
    UPDATE_ADDRESS: (id) => `/user/addresses/${id}`,
    DELETE_ADDRESS: (id) => `/user/addresses/${id}`,
  },

  // Reviews
  REVIEWS: {
    ADD: (orderId) => `/orders/${orderId}/review`,
    BY_STORE: (storeId) => `/stores/${storeId}/reviews`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id) => `/notifications/${id}/read`,
    REGISTER_TOKEN: '/notifications/register',
  },

  // Coupons
  COUPONS: {
    VALIDATE: '/coupons/validate',
  },

  // Wishlist
  WISHLIST: {
    GET: '/wishlist',
    ADD: '/wishlist/add',
    REMOVE: (productId) => `/wishlist/${productId}`,
  },
};

// Flag: set to true to use mock data instead of real API
export const USE_MOCK = true;

