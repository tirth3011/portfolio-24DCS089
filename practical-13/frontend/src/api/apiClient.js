const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5013/api';

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

  async suggestAiMetadata(title) {
    const res = await fetch(`${API_BASE_URL}/ai/suggest-metadata`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    return res.json();
  },

  async getAiTelemetry() {
    const res = await fetch(`${API_BASE_URL}/ai/telemetry`);
    return res.json();
  }
};
