import { useNavigate } from "react-router-dom";
import { FaChevronRight, FaMinus, FaPlus, FaTrash } from "react-icons/fa6";
import { resolveImageUrl } from "../../config/api";
import { useAuthStore } from "../../store/authStore";
import { computeCartTotals, useCartStore } from "../../store/cartStore";

export default function FloatingCart() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const items = useCartStore((state) => state.items);
  const isSidebarOpen = useCartStore((state) => state.isSidebarOpen);
  const openSidebar = useCartStore((state) => state.openSidebar);
  const closeSidebar = useCartStore((state) => state.closeSidebar);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const { quantity, subtotal } = computeCartTotals(items);

  if (items.length === 0) {
    return null;
  }

  const lastItem = items[items.length - 1];

  return (
    <>
      <button type="button" className="floating-cart-bar" onClick={openSidebar}>
        <div className="floating-cart-preview">
          <img src={resolveImageUrl(lastItem.image)} alt={lastItem.name} />
          <div>
            <span>{quantity} item{quantity > 1 ? "s" : ""} selected</span>
            <strong>{lastItem.name}</strong>
          </div>
        </div>
        <div className="floating-cart-meta">
          <strong>Rs. {subtotal.toLocaleString()}</strong>
          <span>Open cart</span>
        </div>
      </button>

      <div className={`cart-drawer-backdrop ${isSidebarOpen ? "show" : ""}`} onClick={closeSidebar} />
      <aside className={`cart-drawer ${isSidebarOpen ? "open" : ""}`}>
        <div className="cart-drawer-header">
          <div>
            <span className="section-label mb-1">Cart</span>
            <h3>{quantity} item{quantity > 1 ? "s" : ""}</h3>
          </div>
          <button type="button" className="btn btn-sm btn-outline-gold" onClick={closeSidebar}>
            Close
          </button>
        </div>

        <div className="cart-drawer-body">
          {items.map((item) => (
            <div key={`${item.productId}-${item.size}`} className="cart-drawer-item">
              <img src={resolveImageUrl(item.image)} alt={item.name} />
              <div className="cart-drawer-copy">
                <h5>{item.name}</h5>
                <p>Size {item.size}</p>
                <strong>Rs. {Number(item.price).toLocaleString()}</strong>
                <div className="cart-drawer-controls">
                  <button type="button" className="cart-stepper-btn" onClick={() => updateQuantity(item.productId, item.size, Math.max(1, item.quantity - 1))}>
                    <FaMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button type="button" className="cart-stepper-btn" onClick={() => updateQuantity(item.productId, item.size, Math.min(item.stock || 99, item.quantity + 1))}>
                    <FaPlus />
                  </button>
                  <button type="button" className="cart-remove-btn" onClick={() => removeItem(item.productId, item.size)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-drawer-footer">
          <div className="summary-row total pt-0">
            <span>Total</span>
            <strong>Rs. {subtotal.toLocaleString()}</strong>
          </div>
          <button
            type="button"
            className="btn btn-gold w-100"
            onClick={() => {
              closeSidebar();
              navigate(user ? "/checkout" : "/login", {
                state: { from: "/checkout" },
              });
            }}
          >
            Checkout <FaChevronRight size={12} className="ms-2" />
          </button>
        </div>
      </aside>
    </>
  );
}
