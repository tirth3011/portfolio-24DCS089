import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTasks, createTask, updateTask, deleteTask } from "../api/apiClient";
import { TaskCard } from "../components/TaskCard";
import { TaskModal } from "../components/TaskModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { Toast } from "../components/Toast";

export default function Home({ onOpenAuth }) {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();

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

  // Load user tasks when authenticated
  const loadTasks = useCallback(async () => {
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

      const response = await getTasks(params);
      setTasks(response.data || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err.response?.data?.error || "Failed to load tasks from server.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, statusFilter, priorityFilter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Save (Create or Edit)
  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        const response = await updateTask(editingTask._id, taskData);
        setTasks((prev) => prev.map((t) => (t._id === editingTask._id ? response.data : t)));
        addToast(`Task "${taskData.title}" updated successfully.`);
      } else {
        const response = await createTask(taskData);
        setTasks((prev) => [response.data, ...prev]);
        addToast(`Task "${taskData.title}" created.`);
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.errors?.[0] || "Failed to save task.";
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
      addToast(`Status updated to ${!originalStatus ? "completed" : "pending"}`);
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
      addToast(`Task "${target.title}" deleted.`);
    } catch (err) {
      loadTasks();
      addToast("Failed to delete task.", "error");
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div>
      {/* Optimization Notice Banner */}
      <div className="glass-card" style={{ padding: "16px 20px", marginBottom: "24px", borderColor: "rgba(56, 189, 248, 0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span className="badge badge-high" style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", borderColor: "rgba(56, 189, 248, 0.3)" }}>
                ⚡ Practical 8 Optimization Active
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                Route-Based Code Splitting via <strong>React.lazy()</strong> &amp; <strong>Suspense</strong>
              </span>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
              Secondary views (<Link to="/analytics" style={{ color: "#38bdf8", textDecoration: "none" }}>Analytics</Link>, <Link to="/projects" style={{ color: "#a855f7", textDecoration: "none" }}>Projects</Link>, <Link to="/benchmark" style={{ color: "#10b981", textDecoration: "none" }}>Benchmark</Link>) and heavy visualizer modules are deferred on-demand.
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Link to="/analytics" className="btn btn-secondary" style={{ fontSize: "0.8rem", padding: "6px 12px", textDecoration: "none" }}>
              📊 Heavy Chart View
            </Link>
            <Link to="/benchmark" className="btn btn-secondary" style={{ fontSize: "0.8rem", padding: "6px 12px", textDecoration: "none" }}>
              ⚡ Bundle Benchmark
            </Link>
          </div>
        </div>
      </div>

      {!isAuthenticated ? (
        /* Guest / Unauthenticated Landing View from Practical 7 */
        <div className="glass-panel" style={{ padding: "50px 32px", textAlign: "center", maxWidth: "760px", margin: "0 auto" }}>
          <div style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "rgba(99, 102, 241, 0.15)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            margin: "0 auto 20px"
          }}>
            🔒
          </div>

          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "12px" }}>
            TaskGuard: Protected Task Pipeline
          </h2>

          <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "1rem", marginBottom: "28px" }}>
            Welcome to the <strong>Task Management System</strong>. In <strong>Practical 8</strong>, this application is optimized with route-based code splitting, dynamic imports for heavy visualizers, and minimal-delay loading boundaries.
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

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            textAlign: "left",
            borderTop: "1px solid var(--border-color)",
            paddingTop: "24px"
          }}>
            <div style={{ background: "var(--bg-card)", padding: "14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#818cf8" }}>⚡ Lazy Loaded Routes</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                Projects, Analytics, and Contact loaded only when visited.
              </p>
            </div>
            <div style={{ background: "var(--bg-card)", padding: "14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#34d399" }}>🛡️ JWT Protected Pipeline</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                Stateless Bearer token verification &amp; bcrypt hashing.
              </p>
            </div>
            <div style={{ background: "var(--bg-card)", padding: "14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#38bdf8" }}>📊 Component Splitting</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                Heavy analytics charts lazy-loaded on explicit request.
              </p>
            </div>
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
              <p style={{ color: "var(--text-muted)" }}>Loading your protected tasks from database...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: "center", padding: "60px 20px" }}>
              <span style={{ fontSize: "3rem", display: "block", marginBottom: "12px" }}>📭</span>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "6px" }}>No Tasks Found</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "20px" }}>
                You have no tasks matching this filter.
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
        message={`Are you sure you want to delete "${deletingTask?.title}"? This will permanently remove the record from MongoDB.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTask(null)}
      />

      {/* Toast Notification Container */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
