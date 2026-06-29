import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  },
  timeout: 10000
});

// add auth header automatically if token exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: ensure we have JSON for API responses
API.interceptors.response.use(
  (response) => {
    const ct = response.headers["content-type"] || "";
    if (ct && !ct.includes("application/json")) {
      const err = new Error(
        `Expected JSON response but received: ${ct}`
      );
      err.response = response;
      return Promise.reject(err);
    }
    return response;
  },
  (error) => {
    // Normalize axios errors so callers can log useful info
    if (error.response) {
      const ct = error.response.headers["content-type"] || "";
      const body = error.response.data;
      error.message = `Request failed with status ${error.response.status} and Content-Type: ${ct}`;
      error.body = body;
    }
    return Promise.reject(error);
  }
);

export default API;