// src/pages/Login.tsx
import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import { setToken } from "../api";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string>("");

    React.useEffect(() => {
    if (isAuthenticated) {
      nav("/");
    }
  }, [isAuthenticated, nav]);
  // Log API URL on mount for debugging
  React.useEffect(() => {
    const url = (import.meta.env.VITE_API_URL || API.defaults.baseURL || "") as string;
    setApiUrl(url);
    console.log("Login page - API URL:", url);
    
    // Test API connection on mount
      const testConnection = async () => {
      try {
        await API.get("/health");
        console.log("✅ API connection test successful");
      } catch (err) {
        console.error("❌ API connection test failed:", err);
        console.error("API URL being used:", API.defaults.baseURL);
      }
    };
    
    testConnection();
  }, []);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

async function submit(e: React.FormEvent) {
  e.preventDefault();
  setError(null);
  
  // Validate inputs
  if (!email || !password) {
    setError("Email and password are required");
    return;
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();
  
  if (!trimmedEmail || !trimmedPassword) {
    setError("Email and password are required");
    return;
  }

  if (!validateEmail(trimmedEmail)) {
    setError("Please enter a valid email address");
    return;
  }
  
  try {
    setLoading(true);
    const res = await API.post("/auth/login", { 
      email: trimmedEmail, 
      password: trimmedPassword 
    });
    
    const { token, user } = res.data;
    setToken(token);
    login(token, user);
    nav("/", { replace: true });
    
  } catch (err: any) {
    console.error("Login error:", err);
    console.error("Error details:", {
      status: err?.response?.status,
      statusText: err?.response?.statusText,
      data: err?.response?.data,
      message: err?.message,
      code: err?.code,
      config: {
        url: err?.config?.url,
        baseURL: err?.config?.baseURL,
        method: err?.config?.method
      }
    });
    
    // Better error handling
    if (err?.response?.status === 401) {
      setError("Invalid email or password");
    } else if (err?.response?.status === 0 || err?.code === "ERR_NETWORK" || err?.code === "ERR_INTERNET_DISCONNECTED") {
      const apiUrl = API.defaults.baseURL || "NOT SET";
      setError(`Network error. Cannot reach backend at ${apiUrl}. Please check: 1) Backend is running, 2) VITE_API_URL is set in Vercel.`);
    } else if (err?.response?.status === 500) {
      const errorMsg = err?.response?.data?.error || "Server error";
      if (errorMsg.includes("Database connection")) {
        setError(`Database connection error. The backend cannot connect to the database. Check Railway: 1) PostgreSQL database is added, 2) DATABASE_URL is set, 3) Database is running.`);
      } else {
        setError(`Server error: ${errorMsg}. Check Railway logs for details.`);
      }
    } else if (err?.response?.data?.error) {
      setError(err.response.data.error);
    } else if (err?.message) {
      setError(`Error: ${err.message}`);
    } else {
      setError("Login failed. Please try again.");
    }
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={submit} className="bg-white dark:bg-slate-800 p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold dark:text-slate-100">Login</h2>
        <ErrorAlert message={error} />
        
        {/* Debug info - visible in production to help diagnose mobile issues */}
        <div className="text-xs text-gray-500 dark:text-gray-400 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
          <div className="font-semibold mb-1">🔍 Debug Info:</div>
          <div>API URL: <span className="font-mono">{apiUrl || "NOT SET"}</span></div>
          <div>Base URL: <span className="font-mono">{API.defaults.baseURL}</span></div>
          {!import.meta.env.VITE_API_URL && (
            <div className="text-red-600 dark:text-red-400 mt-1 font-semibold">
              ⚠️ VITE_API_URL not set! Set it in Vercel environment variables.
            </div>
          )}
        </div>
        
        <input 
          className="w-full border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 p-2 rounded" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="Email" 
          type="email"
          autoComplete="email"
          autoCapitalize="none"
        />
        <input 
          className="w-full border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 p-2 rounded" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="Password" 
          type="password"
          autoComplete="current-password"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <LoadingSpinner size={1.2} /> : null}
          <span className="ml-2">{loading ? "Logging in..." : "Login"}</span>
        </button>
      </form>
    </div>
  );
}
