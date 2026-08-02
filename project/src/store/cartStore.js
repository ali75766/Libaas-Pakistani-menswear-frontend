import { create } from "zustand";
import { persist } from "zustand/middleware";

export const computeCartTotals = (items) =>
  items.reduce(
    (accumulator, item) => {
      accumulator.quantity += item.quantity;
      accumulator.subtotal += item.quantity * item.price;
      return accumulator;
    },
    { quantity: 0, subtotal: 0 }
  );

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isSidebarOpen: false,
      addItem: (product, size, quantity) => {
        const currentItems = get().items;
        const existing = currentItems.find(
          (item) => item.productId === product.id && item.size === size
        );

        if (existing) {
          set({
            items: currentItems.map((item) =>
              item.productId === product.id && item.size === size
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
            isSidebarOpen: true,
          });
          return;
        }

        set({
          items: [
            ...currentItems,
            {
              productId: product.id,
              name: product.name,
              image: product.image,
              price: Number(product.price),
              size,
              quantity,
              stock: product.stock,
            },
          ],
          isSidebarOpen: true,
        });
      },
      removeItem: (productId, size) =>
        set({
          items: get().items.filter(
            (item) => !(item.productId === productId && item.size === size)
          ),
        }),
      updateQuantity: (productId, size, quantity) =>
        set({
          items: get().items.map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        }),
      openSidebar: () => set({ isSidebarOpen: true }),
      closeSidebar: () => set({ isSidebarOpen: false }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      clearCart: () => set({ items: [], isSidebarOpen: false }),
      getSummary: () => computeCartTotals(get().items),
    }),
    {
      name: "libaas-cart",
    }
  )
);
