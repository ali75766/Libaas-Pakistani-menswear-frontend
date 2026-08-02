import { dashboardApi } from "../api/dashboardApi";

export const fetchDashboardStatsAction = () => dashboardApi.getStats();
