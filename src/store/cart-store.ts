"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MeasurementsData } from "@/lib/validators";

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  fabric?: string;
  fitStyle?: string;
};

type CartStore = {
  items: CartItem[];
  measurements: MeasurementsData | null;
  measurementsComplete: boolean;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setMeasurements: (data: MeasurementsData) => void;
  setMeasurementsComplete: (complete: boolean) => void;
  getSubtotal: () => number;
  getItemCount: () => number;
  getCategoriesInCart: () => string[];
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      measurements: null,
      measurementsComplete: false,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                  : i
              ),
              measurementsComplete: false,
            };
          }
          return {
            items: [...state.items, { ...item, quantity: item.quantity ?? 1 }],
            measurementsComplete: false,
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
          measurementsComplete: state.items.length <= 1 ? false : state.measurementsComplete,
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [], measurements: null, measurementsComplete: false }),

      setMeasurements: (data) => set({ measurements: data, measurementsComplete: true }),

      setMeasurementsComplete: (complete) => set({ measurementsComplete: complete }),

      getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getCategoriesInCart: () => {
        const categories = new Set(get().items.map((i) => i.category));
        return Array.from(categories);
      },
    }),
    { name: "ok-shirts-cart" }
  )
);
