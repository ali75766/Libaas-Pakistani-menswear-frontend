import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { getErrorMessage } from "../../utils/errors";
import { notifyError, notifySuccess } from "../../utils/toast";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "user@libaas.com",
      password: "user12345",
    },
  });

  const submitHandler = async (values) => {
    try {
      const response = await login(values);
      notifySuccess(`Welcome back, ${response.user.firstName}`);
      navigate(
        location.state?.from ||
          (response.user.role === "admin" ? "/admin" : "/account")
      );
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Unable to login");
      setError(message);
      notifyError(message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="login-logo">LIBAAS</div>
        <div className="login-subtitle">Store Login</div>

        {error && <div className="alert alert-danger font-sans">{error}</div>}

        <form onSubmit={handleSubmit(submitHandler)} className="row g-3">
          <div className="col-12">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Enter a valid email address",
                },
              })}
            />
            <div className="invalid-feedback">{errors.email?.message}</div>
          </div>
          <div className="col-12">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <div className="invalid-feedback">{errors.password?.message}</div>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-gold w-100" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>

        <p className="auth-helper">
          Customers and admins sign in here. New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
