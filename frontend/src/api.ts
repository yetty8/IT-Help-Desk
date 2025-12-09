import axios from "axios";

// Determine API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Create Axios instance
const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // Set true if you want cookies
  timeout: 30000
});

// Set Authorization token dynamically
export function setToken(token?: string) {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
}

// Request interceptor to attach token from localStorage if missing
API.interceptors.request.use((config) => {
  if (!config.headers["Authorization"]) {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for 401 errors
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(undefined);
    }
    return Promise.reject(err);
  }
);

// Decode JWT token without using extra libraries
export function decodeToken(token: string | null) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const json = decodeURIComponent(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
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
