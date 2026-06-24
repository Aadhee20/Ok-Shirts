"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistStore = {
  items: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        set((state) => ({
          items: state.items.includes(productId)
            ? state.items
            : [...state.items, productId],
        }));
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        }));
      },

      toggleItem: (productId) => {
        const { items, addItem, removeItem } = get();
        if (items.includes(productId)) {
          removeItem(productId);
        } else {
          addItem(productId);
        }
      },

      hasItem: (productId) => get().items.includes(productId),

      clearWishlist: () => set({ items: [] }),
    }),
    { name: "ok-shirts-wishlist" }
  )
);
