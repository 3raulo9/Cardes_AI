import axios from "axios";
import { jwtDecode } from 'jwt-decode';
const BASE_URL = "https://cardes-ai.onrender.com";


const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


const refreshToken = async (currentToken) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/token/refresh/`,
      { token: currentToken }
    );
    const newToken = response.data.token;
    localStorage.setItem("accessToken", newToken);
    return newToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    // Optionally, handle token refresh failure (logout user, redirect to login, etc.)
    return null;
  }
};

// Request interceptor to check token expiry and refresh if needed
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const expirationTime = decoded.exp * 1000; // convert to milliseconds
        const now = Date.now();
        // If token expires in less than 1 minute, refresh it
        if (expirationTime - now < 60000) {
          token = await refreshToken(token);
        }
      } catch (err) {
        console.error("Error decoding token:", err);
        // Optionally, handle token decoding errors
      }
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
