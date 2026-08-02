import apiClient from "./client";
import { API_ROUTES } from "../config/api";

export const dashboardApi = {
  getStats: async () => {
    const { data } = await apiClient.get(API_ROUTES.dashboardStats);
    return data;
  },
};
