import { Platform } from 'react-native';

// Laptop / Development Machine LAN IP (for Expo Go testing over Wi-Fi)
export const DEV_LAN_IP = '172.28.141.39';
export const DEV_PORT = 5000;

/**
 * Resolves the backend base URL dynamically:
 * - Web / Desktop: http://localhost:5000/api/v1
 * - Physical Mobile (Android/iOS via Expo): http://172.28.141.39:5000/api/v1
 */
export const BASE_URL = Platform.select({
  web: `http://localhost:${DEV_PORT}/api/v1`,
  default: `http://${DEV_LAN_IP}:${DEV_PORT}/api/v1`,
});

export const ENDPOINTS = {
  HEALTH: '/health',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER_CUSTOMER: '/auth/register/customer',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
    ME: '/auth/me',
  },
  STORES: {
    DISCOVER: '/stores',
    DETAIL: (id) => `/stores/${id}`,
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id) => `/products/${id}`,
  },
  CATEGORIES: {
    LIST: '/categories',
  },
  CART: {
    GET: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: (productId) => `/cart/items/${productId}`,
    REMOVE_ITEM: (productId) => `/cart/items/${productId}`,
    CLEAR: '/cart/clear',
    APPLY_COUPON: '/cart/coupon',
    REMOVE_COUPON: '/cart/coupon',
  },
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAIL: (id) => `/orders/${id}`,
    CANCEL: (id) => `/orders/${id}/cancel`,
  },
};
