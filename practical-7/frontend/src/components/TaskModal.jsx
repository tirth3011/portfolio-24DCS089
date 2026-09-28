import React, { useState, useEffect } from "react";

export const TaskModal = ({ isOpen, task, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setPriority(task.priority || "medium");
      setCompleted(Boolean(task.completed));
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setCompleted(false);
    }
    setError("");
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Task title is required");
      return;
    }
    if (title.trim().length < 2) {
      setError("Title must be at least 2 characters");
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      completed
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            {task ? "Edit Protected Task" : "Create New Protected Task"}
          </h3>
          <button className="btn-icon" onClick={onClose} style={{ fontSize: "1.2rem" }}>
            ×
          </button>
        </div>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            padding: "8px 12px",
            borderRadius: "var(--radius-sm)",
            color: "#f87171",
            fontSize: "0.85rem",
            marginBottom: "16px"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Title <span style={{ color: "var(--priority-high)" }}>*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Implement JWT Verification Middleware"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Description
            </label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Add task notes or security specifications..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                Priority Level
              </label>
              <select
                className="form-input"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            {task && (
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                  Status
                </label>
                <select
                  className="form-input"
                  value={completed ? "true" : "false"}
                  onChange={(e) => setCompleted(e.target.value === "true")}
                >
                  <option value="false">⏳ Pending</option>
                  <option value="true">✅ Completed</option>
                </select>
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {task ? "Update Task" : "Save Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
