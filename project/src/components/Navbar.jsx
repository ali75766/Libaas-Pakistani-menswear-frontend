import { useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { FaCartShopping, FaUser } from "react-icons/fa6";
import { useAuthStore } from "../store/authStore";
import { computeCartTotals, useCartStore } from "../store/cartStore";
import { useCategoryStore } from "../store/categoryStore";
import { notifySuccess } from "../utils/toast";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const categories = useCategoryStore((state) => state.categories);
  const cartItems = useCartStore((state) => state.items);
  const openSidebar = useCartStore((state) => state.openSidebar);
  const cartCount = computeCartTotals(cartItems).quantity;
  const activeCategorySlug = new URLSearchParams(location.search).get("category");
  const isCataloguePage = location.pathname === "/catalogue";
  const isCatalogueActive = isCataloguePage && !activeCategorySlug;

  const featuredLinks = useMemo(() => categories.slice(0, 2), [categories]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogue?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-libaas sticky-top">
      <div className="container">
        <NavLink className="navbar-brand" to="/">LIBAAS</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-1">
            <li className="nav-item"><NavLink className="nav-link" to="/" end>Home</NavLink></li>
            <li className="nav-item">
              <NavLink
                className={() => `nav-link ${isCatalogueActive ? "active" : ""}`}
                to="/catalogue"
              >
                Catalogue
              </NavLink>
            </li>
            {featuredLinks.map((category) => (
              <li className="nav-item" key={category.id}>
                <NavLink
                  className={() =>
                    `nav-link ${isCataloguePage && activeCategorySlug === category.slug ? "active" : ""}`
                  }
                  to={`/catalogue?category=${category.slug}`}
                >
                  {category.name}
                </NavLink>
              </li>
            ))}
            <li className="nav-item">
              <button className="nav-link border-0 bg-transparent" onClick={() => setSearchOpen(!searchOpen)} style={{ cursor: "pointer" }}>
                <Search size={16} />
              </button>
            </li>
            <li className="nav-item">
              <button type="button" className="nav-link border-0 bg-transparent cart-link" onClick={openSidebar}>
                <FaCartShopping size={15} />
                <span className="cart-badge">{cartCount}</span>
              </button>
            </li>
            {user ? (
              <>
                <li className="nav-item"><NavLink className="nav-link" to={user.role === "admin" ? "/admin" : "/account"}>Dashboard</NavLink></li>
                <li className="nav-item dropdown-user">
                  <button
                    className="nav-link border-0 bg-transparent d-flex align-items-center gap-2"
                    onClick={() => {
                      logout();
                      notifySuccess("Logged out successfully");
                      navigate("/login");
                    }}
                  >
                    <FaUser size={14} />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/login">Login</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/register">Register</NavLink></li>
              </>
            )}
          </ul>
        </div>
      </div>
      {searchOpen && (
        <div className="position-absolute top-100 start-0 end-0 p-3" style={{ background: "var(--off-black)", zIndex: 1050 }}>
          <div className="container">
            <form onSubmit={handleSearch} className="search-bar-wrap">
              <Search size={16} className="search-bar-icon" />
              <input type="text" className="form-control" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus />
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
