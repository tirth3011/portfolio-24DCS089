const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5009/api";

let lastCacheTelemetry = {
  status: "MISS",
  source: "MongoDB",
  durationMs: 0,
  timestamp: new Date().toLocaleTimeString()
};

export const getLastCacheTelemetry = () => lastCacheTelemetry;

const request = async (path, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const t0 = performance.now();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });
  const t1 = performance.now();
  const durationMs = Number((t1 - t0).toFixed(2));

  const xCache = res.headers.get("X-Cache") || "N/A";
  const xTime = res.headers.get("X-Response-Time-Ms");

  lastCacheTelemetry = {
    status: xCache,
    source: xCache === "HIT" ? "node-cache (RAM ⚡)" : "MongoDB (Disk 💾)",
    durationMs: xTime ? Number(xTime) : durationMs,
    timestamp: new Date().toLocaleTimeString()
  };

  // Dispatch custom event for UI components to update live cache telemetry
  window.dispatchEvent(new CustomEvent("cache:telemetry", { detail: lastCacheTelemetry }));

  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent("auth:expired"));
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.error || "Request failed");
    error.response = { status: res.status, data };
    throw error;
  }

  return data;
};

export const getTasks = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const path = query ? `/tasks?${query}` : "/tasks";
  return request(path, { method: "GET" });
};

export const createTask = async (data) => {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

export const updateTask = async (id, data) => {
  return request(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
};

export const deleteTask = async (id) => {
  return request(`/tasks/${id}`, {
    method: "DELETE"
  });
};

export const getCacheStats = async () => {
  return request("/tasks/cache/stats", { method: "GET" });
};

export const clearCache = async () => {
  return request("/tasks/cache/clear", { method: "DELETE" });
};
