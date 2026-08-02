import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaPenToSquare, FaPlus, FaTrash } from "react-icons/fa6";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Pagination from "../../components/common/Pagination";
import PageLoader from "../../components/common/PageLoader";
import { useCategoryStore } from "../../store/categoryStore";
import { useProductStore } from "../../store/productStore";
import { resolveImageUrl } from "../../config/api";
import { getErrorMessage } from "../../utils/errors";
import { notifyError, notifySuccess } from "../../utils/toast";

export default function AdminProducts() {
  const products = useProductStore((state) => state.products);
  const pagination = useProductStore((state) => state.pagination);
  const loading = useProductStore((state) => state.loading);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const categories = useCategoryStore((state) => state.categories);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);

  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchProducts({ page, limit: 8 });
  }, [fetchProducts, page]);

  useEffect(() => {
    fetchCategories({ limit: 50 });
  }, [fetchCategories]);

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category.name])),
    [categories]
  );

  const handleDelete = async () => {
    if (!deletingProduct) return;
    setDeleteLoading(true);
    try {
      await deleteProduct(deletingProduct.id);
      notifySuccess("Product deleted successfully");
      fetchProducts({ page, limit: 8 });
      setDeletingProduct(null);
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Unable to delete product");
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
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 6 }}>Products</h2>
          <p className="font-sans mb-0" style={{ color: "var(--mid-grey)" }}>
            Manage your catalogue inventory.
          </p>
        </div>
        <Link className="btn btn-gold" to="/admin/products/new">
          <FaPlus size={12} className="me-2" />
          Add Product
        </Link>
      </div>

      {error && <div className="alert alert-danger font-sans">{error}</div>}

      {loading && products.length === 0 ? (
        <PageLoader label="Loading products..." />
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="table admin-table mb-0">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img src={resolveImageUrl(product.image)} alt={product.name} />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category?.name || categoryMap[product.categoryId]}</td>
                    <td>Rs. {Number(product.price).toLocaleString()}</td>
                    <td>{product.stock}</td>
                    <td>
                      <div className="table-actions">
                        <Link className="icon-btn" to={`/admin/products/${product.id}/edit`}>
                          <FaPenToSquare />
                        </Link>
                        <button
                          type="button"
                          className="icon-btn danger"
                          onClick={() => setDeletingProduct(product)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {deletingProduct && (
        <ConfirmDialog
          title="Delete Product"
          description={`Are you sure you want to delete ${deletingProduct.name}? This action cannot be undone.`}
          confirmLabel="Delete Product"
          onCancel={() => setDeletingProduct(null)}
          onConfirm={handleDelete}
          isLoading={deleteLoading}
        />
      )}
    </div>
  );
}
