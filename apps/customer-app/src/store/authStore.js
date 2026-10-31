// Customer App — Auth Store (Zustand)
// Manages authentication state globally with live backend API integration

import { create } from 'zustand';
import { apiClient } from '../services/apiClient';
import { ENDPOINTS } from '../constants/api';

export const useAuthStore = create((set, get) => ({
  // State
  isAuthenticated: false,
  isLoading: false,
  user: null,
  token: null,
  refreshToken: null,
  authError: null,

  // Synchronous State Mutators
  setLoading: (isLoading) => set({ isLoading }),
  clearError: () => set({ authError: null }),

  login: (user, token, refreshToken = null) => {
    if (token) apiClient.setAuthToken(token);
    set({
      isAuthenticated: true,
      isLoading: false,
      user,
      token,
      refreshToken,
      authError: null,
    });
  },

  logout: () => {
    apiClient.clearAuthToken();
    set({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
      refreshToken: null,
      authError: null,
    });
  },

  updateUser: (updates) =>
    set((state) => ({
      user: { ...state.user, ...updates },
    })),

  // ── Async Actions with Live Backend API ──────────────────────────────

  loginAction: async ({ identifier, password }) => {
    set({ isLoading: true, authError: null });
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, {
        identifier: identifier.trim(),
        password,
      });

      const { user, accessToken, refreshToken } = response.data || {};
      get().login(user, accessToken, refreshToken);
      return { success: true, user };
    } catch (err) {
      set({ isLoading: false, authError: err.message });
      throw err;
    }
  },

  registerAction: async ({ firstName, lastName, email, phone, password }) => {
    set({ isLoading: true, authError: null });
    try {
      // Ensure clean 10-digit phone
      const cleanPhone = phone.replace(/[\s-+()]/g, '').slice(-10);

      const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER_CUSTOMER, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: cleanPhone,
        password,
      });

      const { user, accessToken, refreshToken } = response.data || {};
      get().login(user, accessToken, refreshToken);
      return { success: true, user };
    } catch (err) {
      set({ isLoading: false, authError: err.message });
      throw err;
    }
  },

  logoutAction: async () => {
    set({ isLoading: true });
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT, {});
    } catch {
      // Ignore network errors on logout
    } finally {
      get().logout();
    }
  },
}));
