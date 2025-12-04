// src/api.ts
import axios from "axios";

// Get API URL - use relative path when served from same origin
const getApiUrl = () => {
  // When frontend is served from backend, use relative path (no CORS needed)
  // In production, backend serves frontend, so use relative path
  if (import.meta.env.PROD) {
    return "/api";
  }
  
  // Development: Use localhost for separate dev server
  return "http://localhost:4000/api";
};

const API_BASE_URL = getApiUrl();

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  timeout: 30000, // 30 second timeout for mobile networks
});

// Always log API URL for debugging (especially on mobile)
console.log("🔗 API Base URL:", API_BASE_URL);
console.log("🌍 Environment:", import.meta.env.MODE);
console.log("📦 VITE_API_URL:", import.meta.env.VITE_API_URL || "NOT SET");

export function setToken(token?: string) {
  if (token) {
    API.defaults.headers.common["Authorization"] = "Bearer " + token;
    console.log("✅ Token set in API defaults");
  } else {
    delete API.defaults.headers.common["Authorization"];
    console.log("❌ Token removed from API defaults");
  }
}

// Request interceptor to ensure token is always included
API.interceptors.request.use(
  (config) => {
    // Get token from localStorage if not already in headers
    if (!config.headers["Authorization"]) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
        console.log("🔑 Token added to request from localStorage");
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (res) => res,
  (err) => {
    // Log API errors for debugging
    console.error("API Error:", {
      url: err.config?.url,
      baseURL: err.config?.baseURL,
      fullURL: err.config?.baseURL + err.config?.url,
      status: err.response?.status,
      message: err.message,
      code: err.code
    });
    
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(undefined);
    }
    return Promise.reject(err);
  }
);

// small helper to decode JWT payload without external lib
export function decodeToken(token: string | null) {
  try {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(payload)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default API;
