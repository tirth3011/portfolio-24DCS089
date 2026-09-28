import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/tasks";

// Activity log callbacks subscriber list
let activityListeners = [];

export const subscribeToActivity = (fn) => {
  activityListeners.push(fn);
  return () => {
    activityListeners = activityListeners.filter((l) => l !== fn);
  };
};

const notifyActivity = (method, url, status, duration) => {
  const item = {
    id: Date.now() + Math.random(),
    method,
    url,
    status,
    duration,
    timestamp: new Date().toLocaleTimeString()
  };
  activityListeners.forEach((fn) => fn(item));
};

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000
});

// Interceptors to record HTTP traffic
client.interceptors.request.use((config) => {
  config.metadata = { startTime: new Date() };
  return config;
});

client.interceptors.response.use(
  (response) => {
    const duration = new Date() - response.config.metadata.startTime;
    notifyActivity(response.config.method.toUpperCase(), response.config.url || "", response.status, `${duration}ms`);
    return response;
  },
  (error) => {
    const duration = error.config?.metadata ? new Date() - error.config.metadata.startTime : 0;
    const status = error.response ? error.response.status : "FAIL";
    notifyActivity(error.config?.method?.toUpperCase() || "REQ", error.config?.url || "", status, `${duration}ms`);
    return Promise.reject(error);
  }
);

export const getTasks = async (params = {}) => {
  const res = await client.get("", { params });
  return res.data;
};

export const getTaskById = async (id) => {
  const res = await client.get(`/${id}`);
  return res.data;
};

export const createTask = async (taskData) => {
  const res = await client.post("", taskData);
  return res.data;
};

export const updateTask = async (id, taskData) => {
  const res = await client.put(`/${id}`, taskData);
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await client.delete(`/${id}`);
  return res.data;
};
