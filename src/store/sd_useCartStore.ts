import { create } from "zustand";
import { persist } from "zustand/middleware";
import { sd_Product } from "../data/sd_products";

export type sd_CartItem = sd_Product & {
  quantity: number;
};

interface sd_CartState {
  items: sd_CartItem[];
  sd_addItem: (product: sd_Product, quantity?: number) => void;
  sd_removeItem: (productId: string) => void;
  sd_updateQuantity: (productId: string, quantity: number) => void;
  sd_clearCart: () => void;
  sd_getTotalItems: () => number;
  sd_getTotalPrice: () => number;
}

export const sd_useCartStore = create<sd_CartState>()(
  persist(
    (set, get) => ({
      items: [],

      sd_addItem: (sd_product, sd_quantity = 1) => {
        const sd_currentItems = get().items;
        const sd_existingItem = sd_currentItems.find((sd_item) => sd_item.id === sd_product.id);

        if (sd_existingItem) {
          set({
            items: sd_currentItems.map((sd_item) =>
              sd_item.id === sd_product.id
                ? { ...sd_item, quantity: sd_item.quantity + sd_quantity }
                : sd_item
            ),
          });
        } else {
          set({
            items: [...sd_currentItems, { ...sd_product, quantity: sd_quantity }],
          });
        }
      },

      sd_removeItem: (sd_productId) => {
        set({
          items: get().items.filter((sd_item) => sd_item.id !== sd_productId),
        });
      },

      sd_updateQuantity: (sd_productId, sd_quantity) => {
        if (sd_quantity <= 0) {
          get().sd_removeItem(sd_productId);
          return;
        }

        set({
          items: get().items.map((sd_item) =>
            sd_item.id === sd_productId ? { ...sd_item, quantity: sd_quantity } : sd_item
          ),
        });
      },

      sd_clearCart: () => {
        set({ items: [] });
      },

      sd_getTotalItems: () => {
        return get().items.reduce((sd_total, sd_item) => sd_total + sd_item.quantity, 0);
      },

      sd_getTotalPrice: () => {
        return get().items.reduce(
          (sd_total, sd_item) => sd_total + sd_item.price * sd_item.quantity,
          0
        );
      },
    }),
    {
      name: "sd_hush_cart_storage",
    }
  )
);
