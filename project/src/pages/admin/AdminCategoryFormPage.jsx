import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CategoryForm from "../../components/admin/CategoryForm";
import PageLoader from "../../components/common/PageLoader";
import { useCategoryStore } from "../../store/categoryStore";
import { getErrorMessage } from "../../utils/errors";
import { toFormData } from "../../utils/formData";
import { notifyError, notifySuccess } from "../../utils/toast";

export default function AdminCategoryFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const currentCategory = useCategoryStore((state) => state.currentCategory);
  const loading = useCategoryStore((state) => state.loading);
  const fetchCategoryById = useCategoryStore((state) => state.fetchCategoryById);
  const clearCurrentCategory = useCategoryStore((state) => state.clearCurrentCategory);
  const createCategory = useCategoryStore((state) => state.createCategory);
  const updateCategory = useCategoryStore((state) => state.updateCategory);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      fetchCategoryById(id);
    }

    return () => {
      clearCurrentCategory();
    };
  }, [clearCurrentCategory, fetchCategoryById, id, isEditing]);

  const handleSubmit = async (values) => {
    setSubmitting(true);

    try {
      const payload = toFormData({
        name: values.name,
        description: values.description,
      });

      if (values.imageFile) {
        payload.append("image", values.imageFile);
      }

      if (isEditing) {
        await updateCategory(id, payload);
        notifySuccess("Category updated successfully");
      } else {
        await createCategory(payload);
        notifySuccess("Category created successfully");
      }

      navigate("/admin/categories");
    } catch (error) {
      notifyError(getErrorMessage(error, "Unable to save category"));
    } finally {
      setSubmitting(false);
    }
  };

  if (isEditing && loading && !currentCategory) {
    return <PageLoader label="Loading category details..." />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 6 }}>
            {isEditing ? "Edit Category" : "Add Category"}
          </h2>
          <p className="font-sans mb-0" style={{ color: "var(--mid-grey)" }}>
            {isEditing ? "Update how this collection appears in the storefront." : "Create a new collection for products."}
          </p>
        </div>
        <Link to="/admin/categories" className="btn btn-outline-gold">
          Back to Categories
        </Link>
      </div>

      <CategoryForm
        initialValues={isEditing ? currentCategory : null}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
}
