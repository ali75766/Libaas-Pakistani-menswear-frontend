import { create } from "zustand";
import {
  createCategoryAction,
  fetchCategoryAction,
  deleteCategoryAction,
  fetchCategoriesAction,
  updateCategoryAction,
} from "../actions/categoryActions";

const defaultPagination = {
  currentPage: 1,
  perPage: 8,
  totalItems: 0,
  totalPages: 1,
};

let inFlightCategoriesRequest = null;
let inFlightCategoriesKey = null;

export const useCategoryStore = create((set) => ({
  categories: [],
  currentCategory: null,
  pagination: defaultPagination,
  loading: false,
  fetchCategories: async (params = {}) => {
    const requestKey = JSON.stringify(params);

    if (inFlightCategoriesRequest && inFlightCategoriesKey === requestKey) {
      return inFlightCategoriesRequest;
    }

    set({ loading: true });
    inFlightCategoriesKey = requestKey;
    inFlightCategoriesRequest = fetchCategoriesAction(params)
      .then((response) => {
        set({
          categories: response.data,
          pagination: response.pagination || defaultPagination,
          loading: false,
        });
        return response;
      })
      .catch((error) => {
        set({ loading: false });
        throw error;
      })
      .finally(() => {
        inFlightCategoriesRequest = null;
        inFlightCategoriesKey = null;
      });

    return inFlightCategoriesRequest;
  },
  fetchCategoryById: async (id) => {
    set({ loading: true });
    try {
      const response = await fetchCategoryAction(id);
      set({ currentCategory: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  createCategory: async (payload) => createCategoryAction(payload),
  updateCategory: async (id, payload) => updateCategoryAction(id, payload),
  deleteCategory: async (id) => deleteCategoryAction(id),
  clearCurrentCategory: () => set({ currentCategory: null }),
}));
