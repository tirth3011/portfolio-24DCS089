const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5008/api";

const request = async (path, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

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
