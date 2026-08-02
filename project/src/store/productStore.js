import { create } from "zustand";
import {
  createProductAction,
  deleteProductAction,
  fetchProductAction,
  fetchProductsAction,
  updateProductAction,
} from "../actions/productActions";

const defaultPagination = {
  currentPage: 1,
  perPage: 9,
  totalItems: 0,
  totalPages: 1,
};

let inFlightFeaturedProductsRequest = null;

export const useProductStore = create((set) => ({
  products: [],
  featuredProducts: [],
  currentProduct: null,
  pagination: defaultPagination,
  loading: false,
  fetchProducts: async (params = {}) => {
    set({ loading: true });
    try {
      const response = await fetchProductsAction(params);
      set({
        products: response.data,
        pagination: response.pagination || defaultPagination,
        loading: false,
      });
      return response;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  fetchFeaturedProducts: async () => {
    if (inFlightFeaturedProductsRequest) {
      return inFlightFeaturedProductsRequest;
    }

    inFlightFeaturedProductsRequest = fetchProductsAction({
      featured: true,
      limit: 6,
    })
      .then((response) => {
        set({ featuredProducts: response.data });
        return response.data;
      })
      .finally(() => {
        inFlightFeaturedProductsRequest = null;
      });

    return inFlightFeaturedProductsRequest;
  },
  fetchProductById: async (id) => {
    set({ loading: true });
    try {
      const response = await fetchProductAction(id);
      set({ currentProduct: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  createProduct: async (payload) => createProductAction(payload),
  updateProduct: async (id, payload) => updateProductAction(id, payload),
  deleteProduct: async (id) => deleteProductAction(id),
  clearCurrentProduct: () => set({ currentProduct: null }),
}));
