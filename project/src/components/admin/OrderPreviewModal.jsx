import { resolveImageUrl } from "../../config/api";

export default function OrderPreviewModal({ order, onClose }) {
  if (!order) return null;

  return (
    <>
      <div className="modal-backdrop show" onClick={onClose} style={{ zIndex: 1055 }} />
      <div className="modal d-block" style={{ zIndex: 1056 }}>
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Order {order.orderNumber}</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <div className="order-preview-grid mb-4">
                <div>
                  <span>Customer</span>
                  <strong>
                    {order.user?.firstName} {order.user?.lastName}
                  </strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{order.shippingEmail}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong className="text-capitalize">{order.status}</strong>
                </div>
                <div>
                  <span>Total</span>
                  <strong>Rs. {Number(order.total).toLocaleString()}</strong>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="section-label mb-2">Shipping</h6>
                <p className="font-sans mb-0">
                  {order.shippingFullName}
                  <br />
                  {order.shippingAddressLine1}
                  {order.shippingAddressLine2 ? `, ${order.shippingAddressLine2}` : ""}
                  <br />
                  {order.shippingCity}, {order.shippingCountry}
                  <br />
                  {order.shippingPhone}
                </p>
              </div>

              <div className="admin-table-wrap">
                <table className="table admin-table mb-0">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Size</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img src={resolveImageUrl(item.productImage)} alt={item.productName} />
                            <span>{item.productName}</span>
                          </div>
                        </td>
                        <td>{item.size || "-"}</td>
                        <td>{item.quantity}</td>
                        <td>Rs. {Number(item.unitPrice).toLocaleString()}</td>
                        <td>Rs. {Number(item.totalPrice).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-gold" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
