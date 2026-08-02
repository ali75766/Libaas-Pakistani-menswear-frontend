import { useEffect, useState } from "react";
import EmptyState from "../../components/common/EmptyState";
import PageLoader from "../../components/common/PageLoader";
import OrderPreviewModal from "../../components/admin/OrderPreviewModal";
import { useOrderStore } from "../../store/orderStore";

export default function AccountOrders() {
  const orders = useOrderStore((state) => state.orders);
  const loading = useOrderStore((state) => state.loading);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders({ limit: 20 });
  }, [fetchOrders]);

  if (loading && orders.length === 0) {
    return <PageLoader label="Loading your orders..." />;
  }

  if (orders.length === 0) {
    return <EmptyState title="No orders yet" description="Your completed purchases will appear here." />;
  }

  return (
    <div>
      <div className="mb-4">
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 8 }}>My Orders</h2>
        <p className="font-sans mb-0" style={{ color: "var(--mid-grey)" }}>
          Every order you place is tracked here.
        </p>
      </div>

      <div className="row g-4">
        {orders.map((order) => (
          <div key={order.id} className="col-lg-6">
            <div className="order-card">
              <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                <div>
                  <span className="order-card-label">Order Number</span>
                  <h5>{order.orderNumber}</h5>
                </div>
                <span className="order-status">{order.status}</span>
              </div>
              <div className="order-card-meta">
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                <strong>Rs. {Number(order.total).toLocaleString()}</strong>
              </div>
              <button type="button" className="btn btn-outline-gold mt-3" onClick={() => setSelectedOrder(order)}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <OrderPreviewModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
