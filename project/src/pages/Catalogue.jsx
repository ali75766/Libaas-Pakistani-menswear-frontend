import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/common/EmptyState";
import PageLoader from "../components/common/PageLoader";
import Pagination from "../components/common/Pagination";
import { useCategoryStore } from "../store/categoryStore";
import { useProductStore } from "../store/productStore";

export default function Catalogue() {
  const products = useProductStore((state) => state.products);
  const pagination = useProductStore((state) => state.pagination);
  const loading = useProductStore((state) => state.loading);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const categories = useCategoryStore((state) => state.categories);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);

  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get("category") || "";
  const searchParam = searchParams.get("search") || "";
  const pageParam = Number(searchParams.get("page") || 1);

  const [filters, setFilters] = useState({
    sizes: [],
    fabrics: [],
    seasons: [],
    colors: [],
    maxPrice: 50000,
    discountOnly: false,
  });
  const [sort, setSort] = useState("newest");
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    fetchCategories({ limit: 50 });
  }, [fetchCategories]);

  const activeCategory = useMemo(
    () => categories.find((category) => category.slug === categorySlug),
    [categories, categorySlug]
  );

  useEffect(() => {
    if (categorySlug && categories.length === 0) {
      return;
    }

    if (categorySlug && categories.length > 0 && !activeCategory) {
      return;
    }

    fetchProducts({
      page: pageParam,
      limit: 9,
      categoryId: activeCategory?.id,
      search: searchParam || undefined,
      sizes: filters.sizes.join(",") || undefined,
      fabric: filters.fabrics.join(",") || undefined,
      season: filters.seasons.join(",") || undefined,
      color: filters.colors.join(",") || undefined,
      maxPrice: filters.maxPrice,
      discountOnly: filters.discountOnly,
      sort,
    });
  }, [
    activeCategory,
    categories.length,
    categorySlug,
    fetchProducts,
    filters.colors,
    filters.discountOnly,
    filters.fabrics,
    filters.maxPrice,
    filters.seasons,
    filters.sizes,
    pageParam,
    searchParam,
    sort,
  ]);

  const activeFilterCount =
    [
      filters.sizes.length,
      filters.fabrics.length,
      filters.seasons.length,
      filters.colors.length,
      filters.discountOnly,
    ].filter(Boolean).length + (filters.maxPrice < 50000 ? 1 : 0);

  const onPageChange = (page) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(page));
    setSearchParams(nextParams);
  };

  return (
    <>
      <div className="catalogue-header">
        <div className="container">
          <div className="section-label" style={{ color: "var(--gold)", marginBottom: 6 }}>
            Browse
          </div>
          <h1 style={{ color: "var(--white)", marginBottom: 8 }}>
            {activeCategory?.name || (searchParam ? `Search: "${searchParam}"` : "All Products")}
          </h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb breadcrumb-libaas">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">
                {activeCategory?.name || "Catalogue"}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="sorting-bar">
        <div className="container d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-sm btn-outline-gold d-lg-none"
              onClick={() => setMobileFilters(!mobileFilters)}
            >
              <SlidersHorizontal size={14} className="me-1" />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
            <span className="results-count">{pagination.totalItems} products</span>
          </div>
          <select
            className="form-select"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            style={{ maxWidth: 200 }}
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name A-Z</option>
          </select>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          <div className="col-lg-3 d-none d-lg-block">
            <FilterSidebar filters={filters} setFilters={setFilters} maxPrice={50000} />
          </div>

          {mobileFilters && (
            <div
              className="position-fixed top-0 start-0 w-100 h-100 d-lg-none"
              style={{ zIndex: 1060, background: "rgba(0,0,0,0.5)" }}
            >
              <div
                className="position-absolute top-0 start-0 h-100 bg-white p-3"
                style={{ width: "85%", maxWidth: 360, overflowY: "auto" }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <strong
                    className="font-sans"
                    style={{
                      fontSize: "0.85rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Filters
                  </strong>
                  <button className="btn p-0 border-0" onClick={() => setMobileFilters(false)}>
                    <X size={20} />
                  </button>
                </div>
                <FilterSidebar filters={filters} setFilters={setFilters} maxPrice={50000} />
              </div>
              <div
                className="position-absolute top-0 end-0 h-100"
                style={{ width: "15%" }}
                onClick={() => setMobileFilters(false)}
              />
            </div>
          )}

          <div className="col-lg-9">
            {loading && products.length === 0 ? (
              <PageLoader label="Loading products..." />
            ) : products.length === 0 ? (
              <EmptyState
                title="No products found"
                description="Try adjusting your filters or search terms."
              />
            ) : (
              <>
                <div className="row g-4">
                  {products.map((product) => (
                    <div key={product.id} className="col-lg-4 col-md-6">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={onPageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
