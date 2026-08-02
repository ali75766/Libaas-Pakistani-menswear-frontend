export default function ConfirmDialog({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onCancel,
  onConfirm,
  isLoading = false,
}) {
  return (
    <>
      <div className="modal-backdrop show" onClick={onCancel} style={{ zIndex: 1055 }} />
      <div className="modal d-block" style={{ zIndex: 1056 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" onClick={onCancel} />
            </div>
            <div className="modal-body">
              <p className="font-sans mb-0" style={{ color: "var(--dark-grey)", lineHeight: 1.8 }}>
                {description}
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-gold" onClick={onCancel}>
                {cancelLabel}
              </button>
              <button type="button" className="btn btn-gold" onClick={onConfirm} disabled={isLoading}>
                {isLoading ? "Please wait..." : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
