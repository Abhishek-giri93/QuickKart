// API Client — Axios wrapper
// All API calls go through this client

import axios from 'axios';
import { BASE_URL } from './api.constants';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor — attach auth token
apiClient.interceptors.request.use(
  (config) => {
    // Token will be fetched from secure storage in actual implementation
    // const token = await SecureStore.getItemAsync('authToken');
    const token = null; // placeholder
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors globally
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // 401 — Unauthorized: token expired, redirect to login
      if (status === 401) {
        // TODO: Trigger logout / token refresh flow
        console.warn('[API] Unauthorized — redirecting to login');
      }

      // 403 — Forbidden
      if (status === 403) {
        console.warn('[API] Forbidden — insufficient permissions');
      }

      // Return structured error
      return Promise.reject({
        status,
        message: data?.message || 'Something went wrong.',
        errors: data?.errors || [],
      });
    }

    // Network error
    return Promise.reject({
      status: null,
      message: 'Network error. Please check your internet connection.',
      errors: [],
    });
  }
);

export default apiClient;

