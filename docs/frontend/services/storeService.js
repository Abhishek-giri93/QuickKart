// Store Service — Handles all store-related API calls
// Falls back to mock data when USE_MOCK is true

import apiClient from './apiClient';
import { ENDPOINTS, USE_MOCK } from './api.constants';
import { mockStores, mockCategories } from '../mock-data/stores';

export const storeService = {
  /**
   * Get nearby stores based on coordinates
   * @param {number} lat
   * @param {number} lng
   * @param {string} category - optional filter
   */
  getNearbyStores: async (lat, lng, category = null) => {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      const stores = category
        ? mockStores.filter((s) => s.category === category)
        : mockStores;
      return { success: true, data: stores };
    }

    const params = { lat, lng };
    if (category) params.category = category;
    return apiClient.get(ENDPOINTS.STORES.NEARBY, { params });
  },

  /**
   * Get store detail by ID
   * @param {string} storeId
   */
  getStoreDetail: async (storeId) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const store = mockStores.find((s) => s.id === storeId);
      if (!store) return { success: false, message: 'Store not found' };
      return { success: true, data: store };
    }

    return apiClient.get(ENDPOINTS.STORES.DETAIL(storeId));
  },

  /**
   * Search stores by query
   * @param {string} query
   */
  searchStores: async (query) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const results = mockStores.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase())
      );
      return { success: true, data: results };
    }

    return apiClient.get(ENDPOINTS.STORES.SEARCH, { params: { q: query } });
  },

  /**
   * Get all product categories
   */
  getCategories: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return { success: true, data: mockCategories };
    }

    return apiClient.get(ENDPOINTS.PRODUCTS.CATEGORIES);
  },
};

