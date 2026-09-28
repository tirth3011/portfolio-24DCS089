import React from "react";

export const ActivityLog = ({ logs, onClear }) => {
  return (
    <div className="glass-panel" style={{ padding: "18px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "1rem" }}>⚡</span>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>Live HTTP Activity Stream</h3>
          <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
            ({logs.length} calls)
          </span>
        </div>
        {logs.length > 0 && (
          <button type="button" className="btn-icon" onClick={onClear} title="Clear Log" style={{ fontSize: "0.8rem" }}>
            Clear
          </button>
        )}
      </div>

      <div style={{
        maxHeight: "150px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem"
      }}>
        {logs.length === 0 ? (
          <p style={{ color: "var(--text-muted)", padding: "10px 0" }}>No API requests yet. Interact with the app to stream traffic.</p>
        ) : (
          logs.map((log) => {
            const isSuccess = typeof log.status === "number" && log.status >= 200 && log.status < 300;
            const methodColors = {
              GET: "#38bdf8",
              POST: "#4ade80",
              PUT: "#fbbf24",
              DELETE: "#f87171"
            };

            return (
              <div
                key={log.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "var(--bg-primary)",
                  padding: "6px 10px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: methodColors[log.method] || "#fff", fontWeight: 700 }}>
                    {log.method}
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>{log.url || "/api/tasks"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ color: isSuccess ? "var(--status-success)" : "var(--status-danger)", fontWeight: 600 }}>
                    {log.status}
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>{log.duration}</span>
                  <span style={{ color: "var(--text-muted)" }}>{log.timestamp}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
