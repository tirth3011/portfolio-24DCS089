const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5011/api';

export const apiClient = {
  async getTasks() {
    const res = await fetch(`${API_BASE_URL}/tasks`);
    return res.json();
  },

  async createTask(taskData) {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    return res.json();
  },

  async updateTask(id, updateData) {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    return res.json();
  },

  async deleteTask(id) {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async getDockerStatus() {
    const res = await fetch(`${API_BASE_URL}/tasks/docker/status`);
    return res.json();
  }
};
