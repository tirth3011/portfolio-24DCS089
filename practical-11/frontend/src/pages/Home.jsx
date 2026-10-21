import React, { useState, useEffect } from 'react';
import DockerBanner from '../components/DockerBanner';
import { apiClient } from '../api/apiClient';

export default function Home({ onHostUpdate }) {
  const [tasks, setTasks] = useState([]);
  const [dockerStatus, setDockerStatus] = useState(null);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    try {
      const [tasksRes, statusRes] = await Promise.all([
        apiClient.getTasks(),
        apiClient.getDockerStatus()
      ]);

      if (tasksRes.data) setTasks(tasksRes.data);
      if (statusRes.container) {
        setDockerStatus(statusRes);
        if (onHostUpdate) onHostUpdate(statusRes.container.hostname);
      }
    } catch (err) {
      console.warn("API poll failed:", err);
    }
  }

  async function handleCreateTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await apiClient.createTask({ title, priority });
      setTitle('');
      await loadData();
    } catch (err) {
      console.error("Create task failed:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTask(id) {
    try {
      await apiClient.deleteTask(id);
      await loadData();
    } catch (err) {
      console.error("Delete task failed:", err);
    }
  }

  return (
    <div className="main-content">
      <DockerBanner status={dockerStatus} />

      <div className="card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>➕ Create Containerized Task</h3>
        <form onSubmit={handleCreateTask} className="form-grid">
          <input
            type="text"
            className="input-field"
            placeholder="Enter task title (e.g., Deploy Microservice Stack)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <select
            className="input-field"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Deploying...' : 'Add Task'}
          </button>
        </form>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem' }}>📋 Persistent Volume Tasks ({tasks.length})</h3>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Source: {tasks.length > 0 ? 'MongoDB (mongo-data)' : 'Checking...'}
          </span>
        </div>

        <div className="task-grid">
          {tasks.map((task) => (
            <div key={task._id} className="task-card">
              <div>
                <div className="task-title">{task.title}</div>
                <div className="task-meta">
                  <span className={`tag-priority tag-${task.priority}`}>{task.priority}</span>
                  <span>Container: {task.containerHost || 'awdf-p11-backend'}</span>
                  <span>Assigned: {task.assignedUser}</span>
                </div>
              </div>
              <button
                onClick={() => handleDeleteTask(task._id)}
                style={{
                  background: 'rgba(244, 63, 94, 0.2)',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                  color: '#f43f5e',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
