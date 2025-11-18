import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, ProductVariant, ProductAddon } from '@/types';

interface CartState {
  items: CartItem[];
  restaurantId: number | null;

  // Actions
  addItem: (
    product: Product,
    quantity: number,
    variant?: ProductVariant,
    addons?: { addon: ProductAddon; quantity: number }[],
    notes?: string
  ) => void;
  updateQuantity: (index: number, quantity: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  setRestaurantId: (id: number) => void;

  // Computed
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,

      addItem: (product, quantity, variant, addons = [], notes = '') => {
        const { items, restaurantId } = get();

        // Clear cart if adding from different restaurant
        if (restaurantId && product.id && restaurantId !== product.category) {
          // Note: In real app, you'd check product.restaurant_id
        }

        const newItem: CartItem = {
          product,
          variant,
          addons,
          quantity,
          notes,
        };

        set({ items: [...items, newItem] });
      },

      updateQuantity: (index, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          set({ items: items.filter((_, i) => i !== index) });
        } else {
          const newItems = [...items];
          newItems[index] = { ...newItems[index], quantity };
          set({ items: newItems });
        }
      },

      removeItem: (index) => {
        const { items } = get();
        set({ items: items.filter((_, i) => i !== index) });
      },

      clearCart: () => {
        set({ items: [], restaurantId: null });
      },

      setRestaurantId: (id) => {
        set({ restaurantId: id });
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          let itemPrice = item.product.current_price;

          if (item.variant) {
            itemPrice += item.variant.price_adjustment;
          }

          const addonsPrice = item.addons.reduce(
            (sum, { addon, quantity }) => sum + addon.price * quantity,
            0
          );

          return total + (itemPrice + addonsPrice) * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
