import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductForm from "../../components/admin/ProductForm";
import PageLoader from "../../components/common/PageLoader";
import { useCategoryStore } from "../../store/categoryStore";
import { useProductStore } from "../../store/productStore";
import { getErrorMessage } from "../../utils/errors";
import { toFormData } from "../../utils/formData";
import { notifyError, notifySuccess } from "../../utils/toast";

export default function AdminProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const categories = useCategoryStore((state) => state.categories);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);
  const currentProduct = useProductStore((state) => state.currentProduct);
  const loading = useProductStore((state) => state.loading);
  const fetchProductById = useProductStore((state) => state.fetchProductById);
  const clearCurrentProduct = useProductStore((state) => state.clearCurrentProduct);
  const createProduct = useProductStore((state) => state.createProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories({ limit: 50 });
  }, [fetchCategories]);

  useEffect(() => {
    if (isEditing && id) {
      fetchProductById(id);
    }

    return () => {
      clearCurrentProduct();
    };
  }, [clearCurrentProduct, fetchProductById, id, isEditing]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = toFormData({
        ...values,
        imageFile: undefined,
      });

      if (values.imageFile) {
        payload.append("image", values.imageFile);
      }

      if (isEditing) {
        await updateProduct(id, payload);
        notifySuccess("Product updated successfully");
      } else {
        await createProduct(payload);
        notifySuccess("Product created successfully");
      }

      navigate("/admin/products");
    } catch (error) {
      notifyError(getErrorMessage(error, "Unable to save product"));
    } finally {
      setSubmitting(false);
    }
  };

  if (isEditing && loading && !currentProduct) {
    return <PageLoader label="Loading product details..." />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 6 }}>
            {isEditing ? "Edit Product" : "Add Product"}
          </h2>
          <p className="font-sans mb-0" style={{ color: "var(--mid-grey)" }}>
            {isEditing ? "Update catalogue details and inventory." : "Create a new product for the catalogue."}
          </p>
        </div>
        <Link to="/admin/products" className="btn btn-outline-gold">
          Back to Products
        </Link>
      </div>

      <ProductForm
        categories={categories}
        initialValues={isEditing ? currentProduct : null}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
}
