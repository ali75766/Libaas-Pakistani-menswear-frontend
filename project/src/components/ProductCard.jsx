import { Link } from "react-router-dom";
import { resolveImageUrl } from "../config/api";

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-card-img-wrap">
        <img src={resolveImageUrl(product.image)} alt={product.name} loading="lazy" />
        {product.discount > 0 && <span className="badge-discount">-{product.discount}%</span>}
        {product.isNew && <span className="badge-new">New</span>}
      </div>
      <div className="product-card-body">
        <div className="product-card-category">{product.category?.name || "Collection"}</div>
        <div className="product-card-name">{product.name}</div>
        <div>
          <span className="product-price">Rs. {Number(product.price).toLocaleString()}</span>
          {Number(product.originalPrice) > Number(product.price) && (
            <span className="product-price-original">Rs. {Number(product.originalPrice).toLocaleString()}</span>
          )}
        </div>
        <div className="product-card-footer">
          <Link to={`/product/${product.id}`} className="btn btn-outline-gold w-100">View Details</Link>
        </div>
      </div>
    </div>
  );
}
