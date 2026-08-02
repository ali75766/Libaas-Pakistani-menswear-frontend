import { useState } from "react";
import { Link, Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, ShoppingBag, X } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { notifySuccess } from "../utils/toast";

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    notifySuccess("Logged out successfully");
    navigate("/login");
  };

  const links = [
    { to: "/account", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/account/orders", icon: ShoppingBag, label: "Orders", end: false },
  ];

  return (
    <div className="admin-wrapper user-wrapper">
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-brand">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            style={{
              cursor: "pointer",
              textDecoration: "none",
              color: "white",
            }}
          >
            LIBAAS
          </Link>
          <p className="text-white mb-0">Customer Area</p>
        </div>
        <nav className="admin-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? "active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            className="admin-nav-link border-0 bg-transparent w-100 text-start"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-sm d-lg-none p-0 border-0"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1 className="d-none d-md-block">Customer Dashboard</h1>
          </div>
          <span
            className="font-sans"
            style={{ fontSize: "0.78rem", color: "var(--mid-grey)" }}
          >
            {user?.email}
          </span>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
