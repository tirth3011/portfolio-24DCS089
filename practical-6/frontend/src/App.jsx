import React, { useState, useEffect, useCallback } from "react";
import { getTasks, createTask, updateTask, deleteTask, subscribeToActivity } from "./api/taskApi";
import { Header } from "./components/Header";
import { TaskCard } from "./components/TaskCard";
import { TaskModal } from "./components/TaskModal";
import { ConfirmModal } from "./components/ConfirmModal";
import { Toast } from "./components/Toast";
import { ActivityLog } from "./components/ActivityLog";

export function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  // Notifications & Logs
  const [toasts, setToasts] = useState([]);
  const [logs, setLogs] = useState([]);

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

  // Activity Log Subscription
  useEffect(() => {
    const unsubscribe = subscribeToActivity((newLog) => {
      setLogs((prev) => [newLog, ...prev.slice(0, 30)]);
    });
    return unsubscribe;
  }, []);

  // Fetch tasks
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (priorityFilter !== "all") params.priority = priorityFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const response = await getTasks(params);
      setTasks(response.data || []);
      setIsConnected(true);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setIsConnected(false);
      setError(err.response?.data?.error || "Could not connect to Express REST server. Please make sure the backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, searchQuery]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Handle Save (Create or Edit)
  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        const response = await updateTask(editingTask._id, taskData);
        setTasks((prev) => prev.map((t) => (t._id === editingTask._id ? response.data : t)));
        addToast(`Task "${taskData.title}" updated successfully!`);
      } else {
        const response = await createTask(taskData);
        setTasks((prev) => [response.data, ...prev]);
        addToast(`Task "${taskData.title}" created successfully!`);
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to save task.";
      addToast(msg, "error");
    }
  };

  // Handle Status Toggle
  const handleToggleStatus = async (task) => {
    const originalStatus = task.completed;
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, completed: !originalStatus } : t))
    );

    try {
      await updateTask(task._id, { completed: !originalStatus });
      addToast(`Task marked as ${!originalStatus ? "completed" : "pending"}`);
    } catch (err) {
      // Revert optimistic update on failure
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, completed: originalStatus } : t))
      );
      addToast("Failed to update status on server.", "error");
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deletingTask) return;
    const target = deletingTask;
    setDeletingTask(null);

    // Optimistic removal
    setTasks((prev) => prev.filter((t) => t._id !== target._id));

    try {
      await deleteTask(target._id);
      addToast(`Task "${target.title}" deleted.`);
    } catch (err) {
      // Re-fetch on error
      loadTasks();
      addToast("Failed to delete task from database.", "error");
    }
  };

  return (
    <div className="app-container">
      <Header
        tasks={tasks}
        isConnected={isConnected}
        onOpenCreate={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
      />

      {/* Filter and Search Controls */}
      <div className="glass-panel" style={{ padding: "16px 20px", marginBottom: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", alignItems: "center" }}>
          <div>
            <input
              type="text"
              className="form-input"
              placeholder="🔍 Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <select
              className="form-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">⏳ Pending Only</option>
              <option value="completed">✅ Completed Only</option>
            </select>

            <select
              className="form-input"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {error && (
        <div
          className="glass-panel"
          style={{
            padding: "20px",
            marginBottom: "24px",
            borderLeft: "4px solid var(--status-danger)",
            background: "rgba(239, 68, 68, 0.08)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h4 style={{ color: "#f87171", fontWeight: 700 }}>Connection Error</h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "4px" }}>{error}</p>
            </div>
            <button type="button" className="btn btn-secondary" onClick={loadTasks}>
              🔄 Retry
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "3px solid var(--border)",
            borderTopColor: "var(--accent-primary)",
            borderRadius: "50%",
            margin: "0 auto 16px",
            animation: "pulseGlow 1s infinite linear"
          }} />
          <p style={{ color: "var(--text-muted)" }}>Synchronizing with MongoDB...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: "center", padding: "60px 20px", marginBottom: "24px" }}>
          <span style={{ fontSize: "3rem", display: "block", marginBottom: "12px" }}>📋</span>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "6px" }}>No Tasks Found</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "20px" }}>
            {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
              ? "No tasks match your selected filter criteria."
              : "Get started by creating your first task in the database!"}
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
          >
            + Create New Task
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "16px",
            marginBottom: "32px"
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

      {/* Activity Log Stream */}
      <ActivityLog logs={logs} onClear={() => setLogs([])} />

      {/* Modals & Alerts */}
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
        title="Delete Task"
        message={`Are you sure you want to permanently delete "${deletingTask?.title}" from the database? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTask(null)}
        confirmLabel="Delete Task"
        isDanger={true}
      />

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
