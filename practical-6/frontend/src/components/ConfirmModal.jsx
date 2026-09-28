import React from "react";

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmLabel = "Delete", isDanger = true }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: isDanger ? "var(--priority-high-bg)" : "rgba(99, 102, 241, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem"
          }}>
            {isDanger ? "🗑️" : "ℹ️"}
          </div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>{title}</h3>
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "0.925rem", lineHeight: 1.6, marginBottom: "24px" }}>
          {message}
        </p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={`btn ${isDanger ? "btn-danger" : "btn-primary"}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
