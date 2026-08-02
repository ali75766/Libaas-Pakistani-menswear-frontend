import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EmptyState from "../components/common/EmptyState";
import PageLoader from "../components/common/PageLoader";
import { resolveImageUrl } from "../config/api";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { useProductStore } from "../store/productStore";
import { notifyInfo, notifySuccess } from "../utils/toast";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const product = useProductStore((state) => state.currentProduct);
  const loading = useProductStore((state) => state.loading);
  const fetchProductById = useProductStore((state) => state.fetchProductById);
  const clearCurrentProduct = useProductStore((state) => state.clearCurrentProduct);
  const addItem = useCartStore((state) => state.addItem);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }

    return () => {
      clearCurrentProduct();
    };
  }, [clearCurrentProduct, fetchProductById, id]);

  useEffect(() => {
    if (product?.sizes?.length) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  if (loading && !product) {
    return <PageLoader label="Loading product..." />;
  }

  if (!product) {
    return (
      <div className="container py-5">
        <EmptyState
          title="Product not found"
          description="The product you are looking for does not exist."
          action={<Link to="/catalogue" className="btn btn-gold mt-3">Back to Catalogue</Link>}
        />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      notifyInfo("Please login to continue with your purchase");
      navigate("/login", { state: { from: `/product/${product.id}` } });
      return false;
    }

    addItem(product, selectedSize, quantity);
    setMessage("Added to cart");
    notifySuccess(`${product.name} added to cart`);
    return true;
  };

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb breadcrumb-libaas">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/catalogue">Catalogue</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/catalogue?category=${product.category?.slug}`}>
              {product.category?.name}
            </Link>
          </li>
          <li className="breadcrumb-item active">{product.name}</li>
        </ol>
      </nav>

      <button className="btn btn-outline-gold mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft size={14} className="me-2" /> Back
      </button>

      <div className="row g-5">
        <div className="col-lg-6">
          <img src={resolveImageUrl(product.image)} alt={product.name} className="product-detail-img" />
        </div>
        <div className="col-lg-6">
          <span className="detail-category-badge">{product.category?.name}</span>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 16 }}>{product.name}</h2>

          <div className="mb-3">
            <span className="product-price" style={{ fontSize: "1.4rem" }}>
              Rs. {Number(product.price).toLocaleString()}
            </span>
            {Number(product.originalPrice) > Number(product.price) && (
              <span className="product-price-original" style={{ fontSize: "1rem" }}>
                Rs. {Number(product.originalPrice).toLocaleString()}
              </span>
            )}
            {product.discount > 0 && (
              <span
                className="ms-2 font-sans"
                style={{ fontSize: "0.82rem", color: "var(--gold)", fontWeight: 600 }}
              >
                ({product.discount}% OFF)
              </span>
            )}
          </div>

          <p
            className="font-sans"
            style={{
              fontSize: "0.92rem",
              color: "var(--dark-grey)",
              lineHeight: 1.8,
              marginBottom: 24,
            }}
          >
            {product.description}
          </p>

          <div className="detail-meta-row">
            <div className="detail-meta-item"><strong>Fabric</strong>{product.fabric}</div>
            <div className="detail-meta-item"><strong>Season</strong>{product.season}</div>
            <div className="detail-meta-item"><strong>Color</strong>{product.color}</div>
          </div>

          <div className="mb-4">
            <div className="filter-group-label mb-2">Available Sizes</div>
            <div className="d-flex flex-wrap">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`size-btn selectable ${selectedSize === size ? "active" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="d-flex gap-3 flex-wrap align-items-center mb-4">
            <input
              type="number"
              min={1}
              max={product.stock || 99}
              value={quantity}
              className="form-control quantity-input"
              onChange={(event) => setQuantity(Number(event.target.value))}
            />
            <button className="btn btn-gold" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button
              className="btn btn-outline-gold"
              onClick={() => {
                const added = handleAddToCart();
                if (added) {
                  useCartStore.getState().openSidebar();
                }
              }}
            >
              Buy Now
            </button>
          </div>

          {message && <div className="alert alert-success font-sans">{message}</div>}

          {product.isNew && (
            <span
              className="font-sans"
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--gold)",
                fontWeight: 600,
              }}
            >
              New Arrival
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
