import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import PageLoader from "../components/common/PageLoader";
import { useCategoryStore } from "../store/categoryStore";
import { useProductStore } from "../store/productStore";
import { resolveImageUrl } from "../config/api";

export default function Home() {
  const categories = useCategoryStore((state) => state.categories);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);
  const featuredProducts = useProductStore((state) => state.featuredProducts);
  const fetchFeaturedProducts = useProductStore((state) => state.fetchFeaturedProducts);
  const loading = useProductStore((state) => state.loading);

  useEffect(() => {
    fetchCategories({ limit: 6 });
    fetchFeaturedProducts();
  }, [fetchCategories, fetchFeaturedProducts]);

  return (
    <>
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="container hero-content">
          <div className="hero-tagline">Traditional &amp; Modern Asian Menswear</div>
          <div className="hero-divider" />
          <h1 className="hero-title">
            Discover the Art of
            <br />
            <span>Asian Menswear</span>
          </h1>
          <p className="hero-subtitle">
            Explore our curated collection of sherwanis, kurtas, waistcoats,
            and more, where timeless tradition meets contemporary elegance.
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <Link to="/catalogue" className="btn btn-gold">
              Explore Collection <ArrowRight size={14} className="ms-2" />
            </Link>
            <Link to="/catalogue?category=sherwani" className="btn btn-outline-gold">
              Sherwanis
            </Link>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="section-label">Browse</div>
          <h2 className="section-title">Featured Categories</h2>
          <div className="section-divider" />
          <div className="row g-4">
            {categories.slice(0, 4).map((category) => (
              <div key={category.id} className="col-lg-3 col-md-6">
                <Link
                  to={`/catalogue?category=${category.slug}`}
                  className="text-decoration-none"
                >
                  <div className="category-card">
                    <img src={resolveImageUrl(category.image)} alt={category.name} loading="lazy" />
                    <div className="category-overlay" />
                    <div className="category-info">
                      <h5>{category.name}</h5>
                      <span>{category.productCount || 0} Products</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5" style={{ background: "var(--white)" }}>
        <div className="container">
          <div className="section-label">Curated</div>
          <h2 className="section-title">Featured Products</h2>
          <div className="section-divider" />
          {loading && featuredProducts.length === 0 ? (
            <PageLoader label="Loading featured pieces..." />
          ) : (
            <div className="row g-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="col-lg-4 col-md-6">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-5">
            <Link to="/catalogue" className="btn btn-dark-libaas">
              View All Products <ArrowRight size={14} className="ms-2" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
