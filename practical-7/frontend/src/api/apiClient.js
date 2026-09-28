import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/tasks`,
  headers: {
    "Content-Type": "application/json"
  }
});

// Attach Bearer token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept 401 Unauthorized responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Dispatch custom session expired event
      window.dispatchEvent(new CustomEvent("auth:expired"));
    }
    return Promise.reject(error);
  }
);

export const getTasks = async (params = {}) => {
  const res = await apiClient.get("", { params });
  return res.data;
};

export const createTask = async (data) => {
  const res = await apiClient.post("", data);
  return res.data;
};

export const updateTask = async (id, data) => {
  const res = await apiClient.put(`/${id}`, data);
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await apiClient.delete(`/${id}`);
  return res.data;
};
