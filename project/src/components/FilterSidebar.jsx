import {
  COLOR_OPTIONS,
  FABRIC_OPTIONS,
  SEASON_OPTIONS,
  SIZE_OPTIONS,
} from "../utils/catalogue";

export default function FilterSidebar({ filters, setFilters, maxPrice }) {

  const toggleArrayFilter = (key, value) => {
    setFilters((prev) => {
      const arr = prev[key] || [];
      return { ...prev, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  };

  const resetFilters = () => setFilters({ sizes: [], fabrics: [], seasons: [], colors: [], maxPrice: maxPrice, discountOnly: false });

  return (
    <div className="filter-sidebar">
      <div className="d-flex justify-content-between align-items-center filter-title">
        <span>Filters</span>
        <button className="btn btn-link p-0 font-sans" style={{ fontSize: "0.72rem", color: "var(--gold)", textDecoration: "none" }} onClick={resetFilters}>Reset All</button>
      </div>

      <div className="filter-group">
        <div className="filter-group-label">Size</div>
        {SIZE_OPTIONS.map((s) => (
          <div key={s} className="filter-checkbox">
            <input type="checkbox" id={`size-${s}`} checked={filters.sizes?.includes(s)} onChange={() => toggleArrayFilter("sizes", s)} />
            <label htmlFor={`size-${s}`}>{s}</label>
          </div>
        ))}
      </div>

      <div className="filter-group">
        <div className="filter-group-label">Fabric</div>
        {FABRIC_OPTIONS.map((f) => (
          <div key={f} className="filter-checkbox">
            <input type="checkbox" id={`fabric-${f}`} checked={filters.fabrics?.includes(f)} onChange={() => toggleArrayFilter("fabrics", f)} />
            <label htmlFor={`fabric-${f}`}>{f}</label>
          </div>
        ))}
      </div>

      <div className="filter-group">
        <div className="filter-group-label">Season</div>
        {SEASON_OPTIONS.map((s) => (
          <div key={s} className="filter-checkbox">
            <input type="checkbox" id={`season-${s}`} checked={filters.seasons?.includes(s)} onChange={() => toggleArrayFilter("seasons", s)} />
            <label htmlFor={`season-${s}`}>{s}</label>
          </div>
        ))}
      </div>

      <div className="filter-group">
        <div className="filter-group-label">Color</div>
        {COLOR_OPTIONS.map((c) => (
          <div key={c} className="filter-checkbox">
            <input type="checkbox" id={`color-${c}`} checked={filters.colors?.includes(c)} onChange={() => toggleArrayFilter("colors", c)} />
            <label htmlFor={`color-${c}`}>{c}</label>
          </div>
        ))}
      </div>

      <div className="filter-group">
        <div className="filter-group-label">Price Range</div>
        <input type="range" className="price-range-input" min={0} max={maxPrice} value={filters.maxPrice ?? maxPrice} onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))} />
        <div className="price-display">Up to Rs. {(filters.maxPrice ?? maxPrice).toLocaleString()}</div>
      </div>

      <div className="filter-group mb-0">
        <div className="filter-checkbox">
          <input type="checkbox" id="discountOnly" checked={filters.discountOnly} onChange={(e) => setFilters((prev) => ({ ...prev, discountOnly: e.target.checked }))} />
          <label htmlFor="discountOnly">Discounted items only</label>
        </div>
      </div>
    </div>
  );
}
