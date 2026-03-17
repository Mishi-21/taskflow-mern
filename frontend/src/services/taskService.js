import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// ── Response interceptor for consistent error handling ──
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// ── Task API Methods ────────────────────────────────────
export const taskService = {
  getAll: (params) => API.get("/tasks", { params }),
  getById: (id) => API.get(`/tasks/${id}`),
  create: (data) => API.post("/tasks", data),
  update: (id, data) => API.put(`/tasks/${id}`, data),
  toggleComplete: (id) => API.patch(`/tasks/${id}/complete`),
  delete: (id) => API.delete(`/tasks/${id}`),
};
