import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000/", // Use environment variable with fallback
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to automatically attach the JWT token if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
