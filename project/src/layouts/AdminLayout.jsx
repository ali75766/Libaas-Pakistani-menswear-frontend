import { useState } from "react";
import { Link, Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { LayoutDashboard, Package, FolderOpen, ShoppingBag, LogOut, Menu, X } from "lucide-react";
import { notifySuccess } from "../utils/toast";

export default function AdminLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    notifySuccess("Logged out successfully");
    navigate("/login");
  };

  const links = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/admin/products", icon: Package, label: "Products", end: false },
    { to: "/admin/categories", icon: FolderOpen, label: "Categories", end: false },
    { to: "/admin/orders", icon: ShoppingBag, label: "Orders", end: false },
  ];

  return (
    <div className="admin-wrapper">
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-brand">
          <Link to="/" onClick={() => setSidebarOpen(false)} style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}>
            <h2>LIBAAS</h2>
          </Link>
          <span>Admin Panel</span>
        </div>
        <nav className="admin-nav">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`} onClick={() => setSidebarOpen(false)}>
              <l.icon size={18} />
              {l.label}
            </NavLink>
          ))}
          <button className="admin-nav-link border-0 bg-transparent w-100 text-start" onClick={handleLogout} style={{ cursor: "pointer" }}>
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-sm d-lg-none p-0 border-0" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1 className="d-none d-md-block">Administration</h1>
          </div>
          <span className="font-sans" style={{ fontSize: "0.78rem", color: "var(--mid-grey)" }}>{user?.email}</span>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
