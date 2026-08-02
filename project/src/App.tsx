import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import Home from "./pages/Home";
import Catalogue from "./pages/Catalogue";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProductFormPage from "./pages/admin/AdminProductFormPage";
import AdminCategoryFormPage from "./pages/admin/AdminCategoryFormPage";
import AccountDashboard from "./pages/account/AccountDashboard";
import AccountOrders from "./pages/account/AccountOrders";
import { AdminRoute, CustomerRoute, ProtectedRoute } from "./components/common/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/admin/login" element={<Navigate to="/login" replace />} />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductFormPage />} />
        <Route path="products/:id/edit" element={<AdminProductFormPage />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="categories/new" element={<AdminCategoryFormPage />} />
        <Route path="categories/:id/edit" element={<AdminCategoryFormPage />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>

      <Route
        path="/account"
        element={
          <CustomerRoute>
            <UserLayout />
          </CustomerRoute>
        }
      >
        <Route index element={<AccountDashboard />} />
        <Route path="orders" element={<AccountOrders />} />
      </Route>

      <Route path="/orders" element={<Navigate to="/account/orders" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
