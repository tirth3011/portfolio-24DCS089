import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "./context/AuthContext";
import { getTasks, createTask, updateTask, deleteTask } from "./api/apiClient";
import { Navbar } from "./components/Navbar";
import { AuthModal } from "./components/AuthModal";
import { TaskCard } from "./components/TaskCard";
import { TaskModal } from "./components/TaskModal";
import { ConfirmModal } from "./components/ConfirmModal";
import { Toast } from "./components/Toast";

export function App() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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

  // Listen for 401 auth expiration
  useEffect(() => {
    const handleAuthExpired = () => {
      logout();
      addToast("Session expired or token invalid. Please log in again.", "error");
      setIsAuthModalOpen(true);
    };

    window.addEventListener("auth:expired", handleAuthExpired);
    return () => window.removeEventListener("auth:expired", handleAuthExpired);
  }, [logout, addToast]);

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

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text-secondary)" }}>Verifying authentication credentials...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenCreate={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
      />

      {!isAuthenticated ? (
        /* Guest / Unauthenticated Landing View */
        <div className="glass-panel" style={{ padding: "60px 32px", textAlign: "center", maxWidth: "720px", margin: "0 auto" }}>
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
            JWT Protected Task Pipeline
          </h2>

          <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "1rem", marginBottom: "28px" }}>
            This application demonstrates <strong>Practical 7: Authentication & Middleware Pipeline</strong>.
            All CRUD endpoints are strictly guarded behind JSON Web Token verification, passwords are salted and hashed using <strong>bcrypt</strong>, and all tasks are permanently scoped to the authenticated user.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "32px" }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: "12px 24px", fontSize: "1rem" }}
              onClick={() => setIsAuthModalOpen(true)}
            >
              Sign In / Register Now
            </button>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            textAlign: "left",
            borderTop: "1px solid var(--border)",
            paddingTop: "24px"
          }}>
            <div style={{ background: "var(--bg-primary)", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#818cf8" }}>🔑 Bcrypt Hashing</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                10-round salted password hashes; never plaintext.
              </p>
            </div>
            <div style={{ background: "var(--bg-primary)", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#34d399" }}>🛡️ Middleware Pipeline</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                Bearer token extraction and 401 unauth guard.
              </p>
            </div>
            <div style={{ background: "var(--bg-primary)", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f59e0b" }}>👥 Data Isolation</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                Multi-tenant scoping; users only see own tasks.
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
              <div style={{ display: "flex", gap: "10px" }}>
                <select
                  className="form-input"
                  style={{ width: "auto" }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">⏳ Pending Only</option>
                  <option value="completed">✅ Completed Only</option>
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

              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                <span>Signed in as:</span>
                <strong style={{ color: "var(--text-primary)" }}>{user?.email}</strong>
              </div>
            </div>
          </div>

          {error && (
            <div className="glass-panel" style={{ padding: "16px", marginBottom: "20px", borderLeft: "4px solid var(--status-danger)" }}>
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
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "6px" }}>No Tasks Yet</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "20px" }}>
                You have no tasks stored under your user account.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setEditingTask(null);
                  setIsTaskModalOpen(true);
                }}
              >
                + Create First Task
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

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(msg) => addToast(msg)}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        task={editingTask}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
      />

      <ConfirmModal
        isOpen={Boolean(deletingTask)}
        title="Delete Protected Task"
        message={`Are you sure you want to delete "${deletingTask?.title}"? This will permanently remove the record from MongoDB.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTask(null)}
      />

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
