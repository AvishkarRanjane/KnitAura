"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OrderItem } from '@/lib/types';

interface CartState {
  items: OrderItem[];
  addItem: (item: OrderItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.productId === newItem.productId);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.productId === newItem.productId
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      get cartTotal() {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      get itemCount() {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'crochet-cart-storage',
    }
  )
);
