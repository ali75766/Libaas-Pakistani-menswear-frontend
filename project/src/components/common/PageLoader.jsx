export default function PageLoader({ label = "Loading..." }) {
  return (
    <div className="empty-state">
      <div className="spinner-border text-warning mb-3" role="status" />
      <p>{label}</p>
    </div>
  );
}
