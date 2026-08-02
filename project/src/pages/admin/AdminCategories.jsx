import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPenToSquare, FaPlus, FaTrash } from "react-icons/fa6";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Pagination from "../../components/common/Pagination";
import PageLoader from "../../components/common/PageLoader";
import { useCategoryStore } from "../../store/categoryStore";
import { resolveImageUrl } from "../../config/api";
import { getErrorMessage } from "../../utils/errors";
import { notifyError, notifySuccess } from "../../utils/toast";

export default function AdminCategories() {
  const categories = useCategoryStore((state) => state.categories);
  const pagination = useCategoryStore((state) => state.pagination);
  const loading = useCategoryStore((state) => state.loading);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);
  const deleteCategory = useCategoryStore((state) => state.deleteCategory);

  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCategories({ page, limit: 6 });
  }, [fetchCategories, page]);

  const handleDelete = async () => {
    if (!deletingCategory) return;
    setDeleteLoading(true);
    try {
      await deleteCategory(deletingCategory.id);
      notifySuccess("Category deleted successfully");
      fetchCategories({ page, limit: 6 });
      setDeletingCategory(null);
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Unable to delete category");
      setError(message);
      notifyError(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 6 }}>Categories</h2>
          <p className="font-sans mb-0" style={{ color: "var(--mid-grey)" }}>
            Curate catalogue sections and visuals.
          </p>
        </div>
        <Link className="btn btn-gold" to="/admin/categories/new">
          <FaPlus size={12} className="me-2" />
          Add Category
        </Link>
      </div>

      {error && <div className="alert alert-danger font-sans">{error}</div>}

      {loading && categories.length === 0 ? (
        <PageLoader label="Loading categories..." />
      ) : (
        <>
          <div className="row g-4">
            {categories.map((category) => (
              <div key={category.id} className="col-lg-4 col-md-6">
                <div className="category-admin-card">
                  <img src={resolveImageUrl(category.image)} alt={category.name} />
                  <div className="category-admin-body">
                    <h5>{category.name}</h5>
                    <p>{category.description}</p>
                    <span>{category.productCount || 0} products</span>
                  </div>
                  <div className="table-actions">
                    <Link className="icon-btn" to={`/admin/categories/${category.id}/edit`}>
                      <FaPenToSquare />
                    </Link>
                    <button
                      type="button"
                      className="icon-btn danger"
                      onClick={() => setDeletingCategory(category)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {deletingCategory && (
        <ConfirmDialog
          title="Delete Category"
          description={`Are you sure you want to delete ${deletingCategory.name}? This action cannot be undone.`}
          confirmLabel="Delete Category"
          onCancel={() => setDeletingCategory(null)}
          onConfirm={handleDelete}
          isLoading={deleteLoading}
        />
      )}
    </div>
  );
}
