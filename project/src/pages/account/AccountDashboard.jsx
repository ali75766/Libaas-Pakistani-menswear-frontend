import { useEffect, useMemo } from "react";
import { FaBoxesStacked, FaCartShopping, FaCoins } from "react-icons/fa6";
import PageLoader from "../../components/common/PageLoader";
import { computeCartTotals, useCartStore } from "../../store/cartStore";
import { useOrderStore } from "../../store/orderStore";

export default function AccountDashboard() {
  const orders = useOrderStore((state) => state.orders);
  const loading = useOrderStore((state) => state.loading);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);
  const cartItems = useCartStore((state) => state.items);
  const { quantity, subtotal } = computeCartTotals(cartItems);

  useEffect(() => {
    fetchOrders({ limit: 10 });
  }, [fetchOrders]);

  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total), 0),
    [orders]
  );

  const stats = [
    { label: "My Orders", value: orders.length, icon: FaBoxesStacked },
    { label: "Cart Items", value: quantity, icon: FaCartShopping },
    { label: "Total Spent", value: `Rs. ${totalSpent.toLocaleString()}`, icon: FaCoins },
  ];

  if (loading && orders.length === 0) {
    return <PageLoader label="Loading your dashboard..." />;
  }

  return (
    <div>
      <div className="mb-4">
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 8 }}>Dashboard</h2>
        <p className="font-sans mb-0" style={{ color: "var(--mid-grey)" }}>
          Keep track of your orders and active cart in one place.
        </p>
      </div>

      <div className="row g-4">
        {stats.map((stat) => (
          <div key={stat.label} className="col-lg-4 col-md-6">
            <div className="stat-card">
              <div className="d-flex align-items-center gap-3 mb-3">
                <stat.icon size={20} style={{ color: "var(--gold)" }} />
                <span className="stat-card-label">{stat.label}</span>
              </div>
              <div className="stat-card-value account-stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="checkout-summary mt-4">
        <h4>Cart Snapshot</h4>
        <div className="summary-row">
          <span>Items in cart</span>
          <strong>{quantity}</strong>
        </div>
        <div className="summary-row total">
          <span>Current cart total</span>
          <strong>Rs. {subtotal.toLocaleString()}</strong>
        </div>
      </div>
    </div>
  );
}
