import React from "react";

export const Header = ({ tasks, isConnected, onOpenCreate }) => {
  const total = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = total - completedCount;
  const percent = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  return (
    <header className="glass-panel" style={{ padding: "20px 24px", marginBottom: "24px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, background: "linear-gradient(90deg, #fff, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              TaskFlow Pro
            </h1>
            <span style={{
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono)",
              background: "rgba(99, 102, 241, 0.15)",
              color: "#818cf8",
              padding: "2px 8px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid rgba(99, 102, 241, 0.3)"
            }}>
              Practical 6 • MERN
            </span>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Full-Stack Task Management • React 18 + Express REST + MongoDB ODM
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* Status indicator */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--bg-primary)",
            padding: "8px 14px",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--border)",
            fontSize: "0.8rem",
            fontFamily: "var(--font-mono)"
          }}>
            <span style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: isConnected ? "var(--status-success)" : "var(--status-danger)",
              boxShadow: `0 0 8px ${isConnected ? "var(--status-success)" : "var(--status-danger)"}`
            }} />
            <span style={{ color: isConnected ? "var(--text-primary)" : "var(--status-danger)" }}>
              {isConnected ? "API Connected (5002)" : "API Disconnected"}
            </span>
          </div>

          <button type="button" className="btn btn-primary" onClick={onOpenCreate}>
            <span>+</span> New Task
          </button>
        </div>
      </div>

      {/* Progress & Metrics */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px",
        marginTop: "20px",
        paddingTop: "16px",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)"
      }}>
        <div style={{ background: "var(--bg-primary)", padding: "12px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Total Tasks</p>
          <p style={{ fontSize: "1.4rem", fontWeight: 700, marginTop: "2px" }}>{total}</p>
        </div>

        <div style={{ background: "var(--bg-primary)", padding: "12px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Completed</p>
          <p style={{ fontSize: "1.4rem", fontWeight: 700, marginTop: "2px", color: "var(--status-success)" }}>{completedCount}</p>
        </div>

        <div style={{ background: "var(--bg-primary)", padding: "12px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Pending</p>
          <p style={{ fontSize: "1.4rem", fontWeight: 700, marginTop: "2px", color: "var(--priority-medium)" }}>{pendingCount}</p>
        </div>

        <div style={{ background: "var(--bg-primary)", padding: "12px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Progress</p>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent-primary)" }}>{percent}%</span>
          </div>
          <div style={{ width: "100%", height: "6px", background: "var(--bg-surface)", borderRadius: "3px", marginTop: "8px", overflow: "hidden" }}>
            <div style={{ width: `${percent}%`, height: "100%", background: "linear-gradient(90deg, #6366f1, #10b981)", transition: "width 0.4s ease" }} />
          </div>
        </div>
      </div>
    </header>
  );
};
