import apiClient from "./client";
import { API_ROUTES } from "../config/api";

export const orderApi = {
  list: async (params = {}) => {
    const { data } = await apiClient.get(API_ROUTES.orders, { params });
    return data;
  },
  getById: async (id) => {
    const { data } = await apiClient.get(`${API_ROUTES.orders}/${id}`);
    return data;
  },
  create: async (payload) => {
    const { data } = await apiClient.post(API_ROUTES.orders, payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await apiClient.put(`${API_ROUTES.orders}/${id}`, payload);
    return data;
  },
};
