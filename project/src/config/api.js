export const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN || "http://localhost:5000";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || `${API_ORIGIN}/api`;

export const API_ROUTES = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    me: "/auth/me",
    users: "/auth/users",
  },
  products: "/products",
  categories: "/categories",
  orders: "/orders",
  dashboardStats: "/dashboard/stats",
  uploads: "/uploads",
};

export const resolveImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path}`;
};
