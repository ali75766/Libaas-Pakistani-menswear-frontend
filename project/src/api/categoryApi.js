import apiClient from "./client";
import { API_ROUTES } from "../config/api";

export const categoryApi = {
  list: async (params = {}) => {
    const { data } = await apiClient.get(API_ROUTES.categories, { params });
    return data;
  },
  getById: async (id) => {
    const { data } = await apiClient.get(`${API_ROUTES.categories}/${id}`);
    return data;
  },
  create: async (payload) => {
    const { data } = await apiClient.post(API_ROUTES.categories, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },
  update: async (id, payload) => {
    const { data } = await apiClient.put(`${API_ROUTES.categories}/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },
  remove: async (id) => {
    const { data } = await apiClient.delete(`${API_ROUTES.categories}/${id}`);
    return data;
  },
};
