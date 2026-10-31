// Customer App — Cart Store (Zustand)

import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  // State
  items: [],          // { productId, name, price, qty, storeId, imageUrl }
  storeId: null,      // cart is per-store
  storeName: null,

  // Computed
  get totalItems() {
    return get().items.reduce((sum, item) => sum + item.qty, 0);
  },
  get subtotal() {
    return get().items.reduce((sum, item) => sum + item.price * item.qty, 0);
  },

  // Actions
  addItem: (product, storeId, storeName) => {
    const { items, storeId: currentStoreId } = get();

    // If adding from a different store, clear cart first
    if (currentStoreId && currentStoreId !== storeId) {
      set({
        items: [{ ...product, qty: 1 }],
        storeId,
        storeName,
      });
      return { storeConflict: true };
    }

    const existing = items.find((i) => i.productId === product.productId);
    if (existing) {
      set({
        items: items.map((i) =>
          i.productId === product.productId ? { ...i, qty: i.qty + 1 } : i
        ),
      });
    } else {
      set({
        items: [...items, { ...product, qty: 1 }],
        storeId,
        storeName,
      });
    }
    return { storeConflict: false };
  },

  removeItem: (productId) => {
    const { items } = get();
    const updated = items.filter((i) => i.productId !== productId);
    set({
      items: updated,
      storeId: updated.length === 0 ? null : get().storeId,
      storeName: updated.length === 0 ? null : get().storeName,
    });
  },

  updateQty: (productId, qty) => {
    if (qty <= 0) {
      get().removeItem(productId);
      return;
    }
    set({
      items: get().items.map((i) =>
        i.productId === productId ? { ...i, qty } : i
      ),
    });
  },

  clearCart: () => set({ items: [], storeId: null, storeName: null }),
}));

