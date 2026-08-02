import apiClient from "./client";
import { API_ROUTES } from "../config/api";

export const productApi = {
  list: async (params = {}) => {
    const { data } = await apiClient.get(API_ROUTES.products, { params });
    return data;
  },
  getById: async (id) => {
    const { data } = await apiClient.get(`${API_ROUTES.products}/${id}`);
    return data;
  },
  create: async (payload) => {
    const { data } = await apiClient.post(API_ROUTES.products, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },
  update: async (id, payload) => {
    const { data } = await apiClient.put(`${API_ROUTES.products}/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },
  remove: async (id) => {
    const { data } = await apiClient.delete(`${API_ROUTES.products}/${id}`);
    return data;
  },
};
