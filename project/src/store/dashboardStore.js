import { create } from "zustand";
import { fetchDashboardStatsAction } from "../actions/dashboardActions";

export const useDashboardStore = create((set) => ({
  stats: null,
  loading: false,
  fetchStats: async () => {
    set({ loading: true });
    try {
      const response = await fetchDashboardStatsAction();
      set({ stats: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));
