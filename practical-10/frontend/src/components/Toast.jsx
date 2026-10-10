import React from "react";

export const Toast = ({ toasts, removeToast }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "24px",
      right: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      zIndex: 2000,
      maxWidth: "380px"
    }}>
      {toasts.map((toast) => {
        const isError = toast.type === "error";
        return (
          <div
            key={toast.id}
            className="glass-panel"
            style={{
              padding: "12px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              borderRadius: "var(--radius-md)",
              borderLeft: `4px solid ${isError ? "var(--status-danger)" : "var(--status-success)"}`,
              boxShadow: "var(--shadow-lg)",
              animation: "slideInRight 0.25s ease-out"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.1rem" }}>{isError ? "⚠️" : "✅"}</span>
              <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-primary)" }}>
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="btn-icon"
              style={{ fontSize: "1rem", lineHeight: 1 }}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
};
