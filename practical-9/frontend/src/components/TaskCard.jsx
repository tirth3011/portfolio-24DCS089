import React from "react";

export const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div
      className="glass-panel"
      style={{
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        borderColor: task.completed ? "rgba(16, 185, 129, 0.3)" : "var(--border)",
        background: task.completed ? "rgba(17, 24, 39, 0.6)" : "var(--bg-card)",
        transition: "all 0.2s ease"
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", flex: 1 }}>
          <button
            type="button"
            onClick={() => onToggleStatus(task)}
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "6px",
              border: `2px solid ${task.completed ? "var(--status-success)" : "var(--text-muted)"}`,
              background: task.completed ? "var(--status-success)" : "transparent",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              marginTop: "2px",
              flexShrink: 0,
              fontSize: "0.75rem",
              fontWeight: 800
            }}
          >
            {task.completed && "✓"}
          </button>

          <div>
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: task.completed ? "var(--text-muted)" : "var(--text-primary)",
                textDecoration: task.completed ? "line-through" : "none",
                wordBreak: "break-word"
              }}
            >
              {task.title}
            </h4>
            {task.description && (
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  marginTop: "4px",
                  lineHeight: 1.5,
                  wordBreak: "break-word"
                }}
              >
                {task.description}
              </p>
            )}
          </div>
        </div>

        <span className={`badge badge-${task.priority}`}>
          {task.priority}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          paddingTop: "10px",
          marginTop: "4px"
        }}
      >
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          {formattedDate}
        </span>

        <div style={{ display: "flex", gap: "6px" }}>
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="btn-icon"
            title="Edit Task"
            style={{ fontSize: "0.9rem" }}
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="btn-icon"
            title="Delete Task"
            style={{ fontSize: "0.9rem", color: "#f87171" }}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};
