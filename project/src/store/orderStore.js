import { create } from "zustand";
import {
  createOrderAction,
  fetchOrderAction,
  fetchOrdersAction,
  updateOrderAction,
} from "../actions/orderActions";

const defaultPagination = {
  currentPage: 1,
  perPage: 10,
  totalItems: 0,
  totalPages: 1,
};

export const useOrderStore = create((set) => ({
  orders: [],
  currentOrder: null,
  pagination: defaultPagination,
  loading: false,
  fetchOrders: async (params = {}) => {
    set({ loading: true });
    try {
      const response = await fetchOrdersAction(params);
      set({
        orders: response.data,
        pagination: response.pagination || defaultPagination,
        loading: false,
      });
      return response;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  fetchOrderById: async (id) => {
    const response = await fetchOrderAction(id);
    set({ currentOrder: response.data });
    return response.data;
  },
  createOrder: async (payload) => createOrderAction(payload),
  updateOrder: async (id, payload) => updateOrderAction(id, payload),
  clearCurrentOrder: () => set({ currentOrder: null }),
}));
