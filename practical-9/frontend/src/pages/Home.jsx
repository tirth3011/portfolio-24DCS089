import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTasks, createTask, updateTask, deleteTask, clearCache, getLastCacheTelemetry } from "../api/apiClient";
import { TaskCard } from "../components/TaskCard";
import { TaskModal } from "../components/TaskModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { Toast } from "../components/Toast";

export default function Home({ onOpenAuth }) {
  const { user, isAuthenticated } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  // Live Cache Telemetry state
  const [cacheTelemetry, setCacheTelemetry] = useState(getLastCacheTelemetry);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const handleTelemetry = (e) => {
      setCacheTelemetry(e.detail);
    };
    window.addEventListener("cache:telemetry", handleTelemetry);
    return () => window.removeEventListener("cache:telemetry", handleTelemetry);
  }, []);

  // Load user tasks when authenticated
  const loadTasks = useCallback(async (forceBypass = false) => {
    if (!isAuthenticated) {
      setTasks([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (priorityFilter !== "all") params.priority = priorityFilter;
      if (forceBypass) params.noCache = "true";

      const response = await getTasks(params);
      setTasks(response.data || []);
      if (forceBypass) {
        addToast("Bypassed cache: Queried directly from MongoDB disk.", "info");
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err.response?.data?.error || "Failed to load tasks from server.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, statusFilter, priorityFilter, addToast]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Purge Cache Handler
  const handleClearCache = async () => {
    try {
      await clearCache();
      addToast("In-memory cache flushed successfully.", "success");
      loadTasks();
    } catch (err) {
      addToast("Failed to purge cache.", "error");
    }
  };

  // Save (Create or Edit)
  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        const response = await updateTask(editingTask._id, taskData);
        setTasks((prev) => prev.map((t) => (t._id === editingTask._id ? response.data : t)));
        addToast(`Task "${taskData.title}" updated. (Cache invalidated 🔄)`);
      } else {
        const response = await createTask(taskData);
        setTasks((prev) => [response.data, ...prev]);
        addToast(`Task "${taskData.title}" created. (Cache invalidated 🔄)`);
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to save task.";
      addToast(msg, "error");
    }
  };

  // Status toggle
  const handleToggleStatus = async (task) => {
    const originalStatus = task.completed;
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, completed: !originalStatus } : t))
    );

    try {
      await updateTask(task._id, { completed: !originalStatus });
      addToast(`Status updated. (Cache purged automatically 🔄)`);
    } catch (err) {
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, completed: originalStatus } : t))
      );
      addToast("Failed to update status on server.", "error");
    }
  };

  // Delete
  const handleConfirmDelete = async () => {
    if (!deletingTask) return;
    const target = deletingTask;
    setDeletingTask(null);

    setTasks((prev) => prev.filter((t) => t._id !== target._id));

    try {
      await deleteTask(target._id);
      addToast(`Task "${target.title}" deleted. (Cache invalidated 🔄)`);
    } catch (err) {
      loadTasks();
      addToast("Failed to delete task.", "error");
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div>
      {/* Practical 9 In-Memory Caching Telemetry Bar */}
      <div className="glass-card" style={{ padding: "18px 22px", marginBottom: "24px", borderColor: "rgba(16, 185, 129, 0.35)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: "0.8rem",
                padding: "3px 10px",
                borderRadius: "9999px",
                background: cacheTelemetry.status === "HIT" ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)",
                color: cacheTelemetry.status === "HIT" ? "#10b981" : "#f59e0b",
                border: cacheTelemetry.status === "HIT" ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(245, 158, 11, 0.4)"
              }}>
                {cacheTelemetry.status === "HIT" ? "⚡ CACHE HIT (RAM)" : "💾 CACHE MISS (DB)"}
              </span>

              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                Latency: <strong style={{ color: cacheTelemetry.status === "HIT" ? "#10b981" : "#f8fafc" }}>{cacheTelemetry.durationMs} ms</strong>
              </span>

              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Source: {cacheTelemetry.source}
              </span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
              Practical 9: Repeated <code>GET /api/tasks</code> are served instantaneously from node-cache RAM (60s TTL). Write operations (POST, PUT, DELETE) immediately invalidate cache.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => loadTasks(false)}
              style={{ fontSize: "0.8rem", padding: "6px 14px" }}
            >
              🔄 Read (Cached)
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => loadTasks(true)}
              style={{ fontSize: "0.8rem", padding: "6px 14px", borderColor: "rgba(245, 158, 11, 0.4)" }}
            >
              ⚡ Bypass Cache (Force DB)
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleClearCache}
              style={{ fontSize: "0.8rem", padding: "6px 14px" }}
            >
              🗑️ Flush RAM Cache
            </button>
          </div>
        </div>
      </div>

      {!isAuthenticated ? (
        /* Guest / Unauthenticated Landing View */
        <div className="glass-panel" style={{ padding: "50px 32px", textAlign: "center", maxWidth: "760px", margin: "0 auto" }}>
          <div style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            margin: "0 auto 20px"
          }}>
            ⚡
          </div>

          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "12px" }}>
            Practical 9: High-Speed In-Memory Caching
          </h2>

          <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "1rem", marginBottom: "28px" }}>
            This Task Management application features an in-memory <strong>node-cache</strong> query acceleration pipeline. Read queries execute sub-millisecond from RAM, with automatic cache invalidation on write mutations.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "32px" }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: "12px 24px", fontSize: "1rem" }}
              onClick={onOpenAuth}
            >
              Sign In / Register Now
            </button>
          </div>
        </div>
      ) : (
        /* Authenticated Dashboard View */
        <>
          {/* Controls Bar */}
          <div className="glass-panel" style={{ padding: "16px 20px", marginBottom: "24px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <select
                  className="form-input"
                  style={{ width: "auto" }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses ({tasks.length})</option>
                  <option value="pending">⏳ Pending ({pendingCount})</option>
                  <option value="completed">✅ Completed ({completedCount})</option>
                </select>

                <select
                  className="form-input"
                  style={{ width: "auto" }}
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="all">All Priorities</option>
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  <span>User: </span>
                  <strong style={{ color: "var(--text-primary)" }}>{user?.email}</strong>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setEditingTask(null);
                    setIsTaskModalOpen(true);
                  }}
                  style={{ padding: "8px 16px" }}
                >
                  + New Task
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="glass-panel" style={{ padding: "16px", marginBottom: "20px", borderLeft: "4px solid #ef4444" }}>
              <p style={{ color: "#f87171" }}>{error}</p>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ color: "var(--text-muted)" }}>Loading your tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: "center", padding: "60px 20px" }}>
              <span style={{ fontSize: "3rem", display: "block", marginBottom: "12px" }}>📭</span>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "6px" }}>No Tasks Found</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "20px" }}>
                Create a task to populate MongoDB and test cache invalidation!
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setEditingTask(null);
                  setIsTaskModalOpen(true);
                }}
              >
                + Create Task
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "16px"
              }}
            >
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onEdit={(t) => {
                    setEditingTask(t);
                    setIsTaskModalOpen(true);
                  }}
                  onDelete={(t) => setDeletingTask(t)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        task={editingTask}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingTask)}
        title="Delete Protected Task"
        message={`Are you sure you want to delete "${deletingTask?.title}"? (This will immediately purge the RAM cache).`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTask(null)}
      />

      {/* Toast Notification Container */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
