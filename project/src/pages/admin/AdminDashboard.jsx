import { useEffect } from "react";
import { FaBoxesStacked, FaCartShopping, FaFolderTree, FaUsers } from "react-icons/fa6";
import { useDashboardStore } from "../../store/dashboardStore";
import PageLoader from "../../components/common/PageLoader";

const statCards = [
  { key: "products", label: "Total Products", icon: FaBoxesStacked },
  { key: "orders", label: "Total Orders", icon: FaCartShopping },
  { key: "categories", label: "Categories", icon: FaFolderTree },
  { key: "users", label: "Users", icon: FaUsers },
];

export default function AdminDashboard() {
  const stats = useDashboardStore((state) => state.stats);
  const loading = useDashboardStore((state) => state.loading);
  const fetchStats = useDashboardStore((state) => state.fetchStats);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading && !stats) {
    return <PageLoader label="Loading dashboard..." />;
  }

  return (
    <div>
      <div className="mb-4">
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 8 }}>Dashboard</h2>
        <p className="font-sans" style={{ color: "var(--mid-grey)", marginBottom: 0 }}>
          Welcome back. Here is today&apos;s snapshot of your store.
        </p>
      </div>

      <div className="row g-4 mb-5">
        {statCards.map((card) => (
          <div key={card.key} className="col-lg-3 col-md-6">
            <div className="stat-card">
              <div className="d-flex align-items-center gap-3 mb-3">
                <card.icon size={20} style={{ color: "var(--gold)" }} />
                <span className="stat-card-label">{card.label}</span>
              </div>
              <div className="stat-card-value">{stats?.totals?.[card.key] || 0}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-xl-6">
          <div className="admin-table-wrap">
            <div className="table-section-title">Recent Products</div>
            <table className="table admin-table mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentProducts?.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category?.name}</td>
                    <td>Rs. {Number(product.price).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="admin-table-wrap">
            <div className="table-section-title">Recent Orders</div>
            <table className="table admin-table mb-0">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map((order) => (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td className="text-capitalize">{order.status}</td>
                    <td>Rs. {Number(order.total).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
