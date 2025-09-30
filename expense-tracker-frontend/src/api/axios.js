import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5237/api", // backend base
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // preserve existing headers (e.g. Content-Type) while adding Authorization
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore localStorage issues in test environments
      console.warn("Could not attach token", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
