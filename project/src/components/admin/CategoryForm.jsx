import { useEffect } from "react";
import { useForm } from "react-hook-form";

const defaultValues = {
  name: "",
  description: "",
  imageFile: null,
};

export default function CategoryForm({
  initialValues,
  onSubmit,
  submitting,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    reset(
      initialValues
        ? {
            name: initialValues.name,
            description: initialValues.description || "",
            imageFile: null,
          }
        : defaultValues
    );
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit((values) => onSubmit({ ...values, imageFile: values.imageFile?.[0] || null }))}>
      <div className="page-panel">
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label">Category Name</label>
            <input className={`form-control ${errors.name ? "is-invalid" : ""}`} {...register("name", { required: "Category name is required" })} />
            <div className="invalid-feedback">{errors.name?.message}</div>
          </div>
          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea rows={5} className={`form-control ${errors.description ? "is-invalid" : ""}`} {...register("description", { required: "Description is required" })} />
            <div className="invalid-feedback">{errors.description?.message}</div>
          </div>
          <div className="col-12">
            <label className="form-label">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              className={`form-control ${errors.imageFile ? "is-invalid" : ""}`}
              {...register("imageFile", {
                validate: (value) =>
                  initialValues || (value && value.length > 0) || "Image upload is required",
              })}
            />
            <div className="invalid-feedback">{errors.imageFile?.message}</div>
          </div>
        </div>
      </div>

      <div className="form-page-actions">
        <button type="submit" className="btn btn-gold" disabled={submitting}>
          {submitting ? "Saving..." : initialValues ? "Update Category" : "Create Category"}
        </button>
      </div>
    </form>
  );
}
