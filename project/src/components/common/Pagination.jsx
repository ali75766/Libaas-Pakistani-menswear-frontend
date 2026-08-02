export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const pages = [];
  for (let page = 1; page <= totalPages; page += 1) {
    pages.push(page);
  }

  return (
    <div className="pagination-libaas">
      <button
        type="button"
        className="btn btn-outline-gold"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      <div className="pagination-pages">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={`pagination-page ${currentPage === page ? "active" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-outline-gold"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}
