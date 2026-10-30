// Customer App — Auth Store (Zustand)
// Manages authentication state globally

import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  // State
  isAuthenticated: false,
  isLoading: true,       // true initially for splash screen check
  user: null,
  token: null,

  // Actions
  setLoading: (isLoading) => set({ isLoading }),

  login: (user, token) =>
    set({
      isAuthenticated: true,
      isLoading: false,
      user,
      token,
    }),

  logout: () =>
    set({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
    }),

  updateUser: (updates) =>
    set((state) => ({
      user: { ...state.user, ...updates },
    })),
}));

