import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { PAYMENT_METHODS } from "../utils/catalogue";
import EmptyState from "../components/common/EmptyState";
import { getErrorMessage } from "../utils/errors";
import { useAuthStore } from "../store/authStore";
import { computeCartTotals, useCartStore } from "../store/cartStore";
import { useOrderStore } from "../store/orderStore";
import { notifyError, notifySuccess } from "../utils/toast";

export default function Checkout() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const { subtotal } = computeCartTotals(items);
  const createOrder = useOrderStore((state) => state.createOrder);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
      email: user?.email || "",
      phone: user?.phone || "",
      addressLine1: user?.addressLine1 || "",
      addressLine2: user?.addressLine2 || "",
      city: user?.city || "",
      country: user?.country || "Pakistan",
      paymentMethod: "cash_on_delivery",
      notes: "",
    },
  });

  const submitHandler = async (values) => {
    setSubmitting(true);
    setError("");

    try {
      await createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
        })),
        paymentMethod: values.paymentMethod,
        notes: values.notes,
        shipping: {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          addressLine1: values.addressLine1,
          addressLine2: values.addressLine2,
          city: values.city,
          country: values.country,
        },
      });

      clearCart();
      notifySuccess("Order placed successfully");
      navigate("/account/orders");
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Unable to place order");
      setError(message);
      notifyError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-5">
        <EmptyState
          title="Your cart is empty"
          description="Add products before heading to checkout."
          action={<Link to="/catalogue" className="btn btn-gold mt-3">Browse Products</Link>}
        />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="page-panel">
            <div className="section-label mb-2">Checkout</div>
            <h1 className="section-title">Complete Your Order</h1>

            {error && <div className="alert alert-danger font-sans">{error}</div>}

            <form onSubmit={handleSubmit(submitHandler)} className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <input
                  className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                  {...register("fullName", { required: "Full name is required" })}
                />
                <div className="invalid-feedback">{errors.fullName?.message}</div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  {...register("email", { required: "Email is required" })}
                />
                <div className="invalid-feedback">{errors.email?.message}</div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  {...register("phone", { required: "Phone is required" })}
                />
                <div className="invalid-feedback">{errors.phone?.message}</div>
              </div>
              <div className="col-md-6">
                <label className="form-label">City</label>
                <input
                  className={`form-control ${errors.city ? "is-invalid" : ""}`}
                  {...register("city", { required: "City is required" })}
                />
                <div className="invalid-feedback">{errors.city?.message}</div>
              </div>
              <div className="col-12">
                <label className="form-label">Address Line 1</label>
                <input
                  className={`form-control ${errors.addressLine1 ? "is-invalid" : ""}`}
                  {...register("addressLine1", { required: "Address is required" })}
                />
                <div className="invalid-feedback">{errors.addressLine1?.message}</div>
              </div>
              <div className="col-12">
                <label className="form-label">Address Line 2</label>
                <input className="form-control" {...register("addressLine2")} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Country</label>
                <input className="form-control" {...register("country")} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Payment Method</label>
                <select className="form-select" {...register("paymentMethod")}>
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Notes</label>
                <textarea rows={3} className="form-control" {...register("notes")} />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-gold" disabled={submitting}>
                  {submitting ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="checkout-summary sticky-summary">
            <h4>Order Summary</h4>
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="summary-item">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <strong>Rs. {(item.quantity * item.price).toLocaleString()}</strong>
              </div>
            ))}
            <div className="summary-row total">
              <span>Total</span>
              <strong>Rs. {subtotal.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
