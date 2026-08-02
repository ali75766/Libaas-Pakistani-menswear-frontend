import { Link } from "react-router-dom";
import { useCategoryStore } from "../store/categoryStore";

export default function Footer() {
  const categories = useCategoryStore((state) => state.categories);

  return (
    <footer className="footer-libaas">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="footer-brand">LIBAAS</div>
            <div className="footer-tagline">Traditional &amp; Modern Asian Menswear</div>
            <p className="mt-3 font-sans" style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", maxWidth: 300 }}>
              Curating the finest collection of traditional and contemporary Asian menswear for the modern gentleman.
            </p>
          </div>
          <div className="col-lg-2 col-md-4 mb-4 mb-md-0">
            <div className="footer-heading">Explore</div>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/catalogue">Catalogue</Link></li>
              <li><Link to="/catalogue">Categories</Link></li>
            </ul>
          </div>
          <div className="col-lg-2 col-md-4 mb-4 mb-md-0">
            <div className="footer-heading">Categories</div>
            <ul className="footer-links">
              {categories.slice(0, 4).map((category) => (
                <li key={category.id}>
                  <Link to={`/catalogue?category=${category.slug}`}>{category.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-2 col-md-4">
            <div className="footer-heading">Account</div>
            <ul className="footer-links">
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom text-center">
          <p>&copy; {new Date().getFullYear()} LIBAAS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
