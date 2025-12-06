import axios from "axios";

// API URL: Use VITE_API_URL from Vercel, fallback for dev
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;
  if (import.meta.env.PROD) return "/api";
  return "http://localhost:4000/api";
};

const API_BASE_URL = getApiUrl();

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  timeout: 30000
});

export function setToken(token?: string) {
  if (token) API.defaults.headers.common["Authorization"] = "Bearer " + token;
  else delete API.defaults.headers.common["Authorization"];
}

API.interceptors.request.use((config) => {
  if (!config.headers["Authorization"]) {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

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

export function decodeToken(token: string | null) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const json = decodeURIComponent(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
      .split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default API;
