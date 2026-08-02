import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  COLOR_OPTIONS,
  FABRIC_OPTIONS,
  SEASON_OPTIONS,
  SIZE_OPTIONS,
} from "../../utils/catalogue";

const defaultValues = {
  name: "",
  categoryId: "",
  price: "",
  originalPrice: "",
  discount: 0,
  fabric: "Cotton",
  season: "All Season",
  color: "White",
  sizes: ["M", "L", "XL"],
  stock: 10,
  imageFile: null,
  description: "",
  isFeatured: false,
  isNew: false,
};

export default function ProductForm({
  categories,
  initialValues,
  onSubmit,
  submitting,
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const selectedSizes = watch("sizes") || [];

  useEffect(() => {
    if (!initialValues) {
      reset(defaultValues);
      return;
    }

    reset({
      name: initialValues.name,
      categoryId: String(initialValues.categoryId),
      price: Number(initialValues.price),
      originalPrice: Number(initialValues.originalPrice),
      discount: initialValues.discount,
      fabric: initialValues.fabric,
      season: initialValues.season,
      color: initialValues.color,
      sizes: initialValues.sizes || [],
      stock: initialValues.stock,
      imageFile: null,
      description: initialValues.description || "",
      isFeatured: initialValues.isFeatured,
      isNew: initialValues.isNew,
    });
  }, [initialValues, reset]);

  const toggleSize = (size) => {
    const nextSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((item) => item !== size)
      : [...selectedSizes, size];

    setValue("sizes", nextSizes, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit((values) => onSubmit({ ...values, imageFile: values.imageFile?.[0] || null }))}>
      <div className="page-panel">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Product Name</label>
            <input className={`form-control ${errors.name ? "is-invalid" : ""}`} {...register("name", { required: "Product name is required" })} />
            <div className="invalid-feedback">{errors.name?.message}</div>
          </div>
          <div className="col-md-6">
            <label className="form-label">Category</label>
            <select className={`form-select ${errors.categoryId ? "is-invalid" : ""}`} {...register("categoryId", { required: "Category is required" })}>
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="invalid-feedback">{errors.categoryId?.message}</div>
          </div>
          <div className="col-md-3">
            <label className="form-label">Price</label>
            <input type="number" className={`form-control ${errors.price ? "is-invalid" : ""}`} {...register("price", { required: "Price is required", min: { value: 1, message: "Price must be greater than 0" } })} />
            <div className="invalid-feedback">{errors.price?.message}</div>
          </div>
          <div className="col-md-3">
            <label className="form-label">Original Price</label>
            <input type="number" className="form-control" {...register("originalPrice")} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Discount</label>
            <input type="number" className="form-control" {...register("discount")} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Stock</label>
            <input type="number" className={`form-control ${errors.stock ? "is-invalid" : ""}`} {...register("stock", { required: "Stock is required", min: { value: 1, message: "Stock must be at least 1" } })} />
            <div className="invalid-feedback">{errors.stock?.message}</div>
          </div>
          <div className="col-md-4">
            <label className="form-label">Fabric</label>
            <select className="form-select" {...register("fabric")}>
              {FABRIC_OPTIONS.map((fabric) => (
                <option key={fabric} value={fabric}>{fabric}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Season</label>
            <select className="form-select" {...register("season")}>
              {SEASON_OPTIONS.map((season) => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Color</label>
            <select className="form-select" {...register("color")}>
              {COLOR_OPTIONS.map((color) => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">Sizes</label>
            <input
              type="hidden"
              {...register("sizes", {
                validate: (value) =>
                  (value && value.length > 0) || "Select at least one size",
              })}
            />
            <div className="d-flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`btn btn-sm ${selectedSizes.includes(size) ? "btn-gold" : "btn-outline-gold"}`}
                  onClick={() => toggleSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            {errors.sizes && (
              <p className="text-danger font-sans mt-2 mb-0" style={{ fontSize: "0.78rem" }}>
                {errors.sizes.message}
              </p>
            )}
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
          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea rows={5} className="form-control" {...register("description", { required: "Description is required" })} />
            {errors.description && (
              <p className="text-danger font-sans mt-2 mb-0" style={{ fontSize: "0.78rem" }}>
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="col-12 d-flex gap-4 flex-wrap">
            <label className="form-check">
              <input className="form-check-input" type="checkbox" {...register("isFeatured")} />
              <span className="form-check-label font-sans">Featured Product</span>
            </label>
            <label className="form-check">
              <input className="form-check-input" type="checkbox" {...register("isNew")} />
              <span className="form-check-label font-sans">New Arrival</span>
            </label>
          </div>
        </div>
      </div>

      <div className="form-page-actions">
        <button type="submit" className="btn btn-gold" disabled={submitting}>
          {submitting ? "Saving..." : initialValues ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
