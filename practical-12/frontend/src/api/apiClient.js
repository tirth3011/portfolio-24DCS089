const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5012/api';

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

  async getCiStatus() {
    const res = await fetch(`${API_BASE_URL}/tasks/ci/status`);
    return res.json();
  },

  async toggleFailMode() {
    const res = await fetch(`${API_BASE_URL}/tasks/ci/toggle-fail`, {
      method: 'POST'
    });
    return res.json();
  }
};
