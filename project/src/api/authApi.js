import apiClient from "./client";
import { API_ROUTES } from "../config/api";

export const authApi = {
  login: async (payload) => {
    const { data } = await apiClient.post(API_ROUTES.auth.login, payload);
    return data;
  },
  register: async (payload) => {
    const { data } = await apiClient.post(API_ROUTES.auth.register, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },
  getProfile: async () => {
    const { data } = await apiClient.get(API_ROUTES.auth.me);
    return data;
  },
  updateProfile: async (payload) => {
    const { data } = await apiClient.put(API_ROUTES.auth.me, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },
};
