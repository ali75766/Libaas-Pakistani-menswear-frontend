import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa6";
import OrderPreviewModal from "../../components/admin/OrderPreviewModal";
import Pagination from "../../components/common/Pagination";
import PageLoader from "../../components/common/PageLoader";
import { useOrderStore } from "../../store/orderStore";
import { getErrorMessage } from "../../utils/errors";

export default function AdminOrders() {
  const orders = useOrderStore((state) => state.orders);
  const pagination = useOrderStore((state) => state.pagination);
  const loading = useOrderStore((state) => state.loading);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);
  const updateOrder = useOrderStore((state) => state.updateOrder);

  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders({ page, limit: 8 });
  }, [fetchOrders, page]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrder(orderId, { status });
      fetchOrders({ page, limit: 8 });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to update order"));
    }
  };

  if (loading && orders.length === 0) {
    return <PageLoader label="Loading orders..." />;
  }

  return (
    <div>
      <div className="mb-4">
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 6 }}>Orders</h2>
        <p className="font-sans mb-0" style={{ color: "var(--mid-grey)" }}>
          Review incoming orders and keep their statuses updated.
        </p>
      </div>

      {error && <div className="alert alert-danger font-sans">{error}</div>}

      <div className="admin-table-wrap">
        <table className="table admin-table mb-0">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>
                  {order.user?.firstName} {order.user?.lastName}
                </td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={order.status}
                    onChange={(event) => handleStatusChange(order.id, event.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>Rs. {Number(order.total).toLocaleString()}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <button type="button" className="icon-btn" onClick={() => setSelectedOrder(order)}>
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />

      {selectedOrder && (
        <OrderPreviewModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
