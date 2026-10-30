// API config for customer app
export const BASE_URL = 'http://localhost:5000/api/v1';
export const USE_MOCK = true; // Set false when real API is ready

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  STORES: {
    NEARBY: '/stores/nearby',
    DETAIL: (id) => `/stores/${id}`,
    SEARCH: '/stores/search',
  },
  PRODUCTS: {
    BY_STORE: (storeId) => `/stores/${storeId}/products`,
    DETAIL: (id) => `/products/${id}`,
    SEARCH: '/products/search',
    CATEGORIES: '/products/categories',
  },
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: '/cart/remove',
    CLEAR: '/cart/clear',
  },
  ORDERS: {
    PLACE: '/orders',
    LIST: '/orders',
    DETAIL: (id) => `/orders/${id}`,
    TRACK: (id) => `/orders/${id}/track`,
    CANCEL: (id) => `/orders/${id}/cancel`,
  },
  USER: {
    PROFILE: '/user/profile',
    ADDRESSES: '/user/addresses',
  },
  WISHLIST: {
    GET: '/wishlist',
    ADD: '/wishlist/add',
    REMOVE: (id) => `/wishlist/${id}`,
  },
};

