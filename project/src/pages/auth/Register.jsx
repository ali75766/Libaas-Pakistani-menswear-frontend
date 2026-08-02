import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { getErrorMessage } from "../../utils/errors";
import { toFormData } from "../../utils/formData";

export default function Register() {
  const navigate = useNavigate();
  const registerUser = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (values) => {
    try {
      const payload = toFormData({
        ...values,
        avatar: values.avatar?.[0],
      });

      await registerUser(payload);
      navigate("/");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to create account"));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="login-logo">LIBAAS</div>
        <div className="login-subtitle">Create Account</div>

        {error && <div className="alert alert-danger font-sans">{error}</div>}

        <form onSubmit={handleSubmit(submitHandler)} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">First Name</label>
            <input
              className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
              {...register("firstName", { required: "First name is required" })}
            />
            <div className="invalid-feedback">{errors.firstName?.message}</div>
          </div>
          <div className="col-md-6">
            <label className="form-label">Last Name</label>
            <input
              className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
              {...register("lastName", { required: "Last name is required" })}
            />
            <div className="invalid-feedback">{errors.lastName?.message}</div>
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              {...register("email", { required: "Email is required" })}
            />
            <div className="invalid-feedback">{errors.email?.message}</div>
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone</label>
            <input className="form-control" {...register("phone")} />
          </div>
          <div className="col-md-6">
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
          <div className="col-md-6">
            <label className="form-label">Avatar</label>
            <input type="file" accept="image/*" className="form-control" {...register("avatar")} />
          </div>
          <div className="col-12">
            <label className="form-label">Address Line 1</label>
            <input className="form-control" {...register("addressLine1")} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Address Line 2</label>
            <input className="form-control" {...register("addressLine2")} />
          </div>
          <div className="col-md-6">
            <label className="form-label">City</label>
            <input className="form-control" {...register("city")} />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-gold w-100" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>

        <p className="auth-helper">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
