// src/pages/Login.tsx
import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string>("");

  // Log API URL on mount for debugging
  React.useEffect(() => {
    const url = import.meta.env.VITE_API_URL || API.defaults.baseURL;
    setApiUrl(url);
    console.log("Login page - API URL:", url);
    console.log("Login page - Full API Base:", API.defaults.baseURL);
    
    // Test API connection on mount
    API.get("/stats")
      .then(() => console.log("✅ API connection test successful"))
      .catch((err) => {
        console.error("❌ API connection test failed:", err);
        console.error("API URL being used:", API.defaults.baseURL);
        console.error("Error details:", err.response?.status, err.message);
      });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    
    // Trim email to handle mobile keyboard issues
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    
    if (!trimmedEmail || !trimmedPassword) {
      setError("Email and password are required");
      return;
    }
    
    try {
      setLoading(true);
      const res = await API.post("/auth/login", { 
        email: trimmedEmail, 
        password: trimmedPassword 
      });
      const { token, user } = res.data;
      login(token, user);
      setLoading(false);
      nav("/");
    } catch (err: any) {
      setLoading(false);
      console.error("Login error:", err);
      
      // Better error handling
      if (err?.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err?.response?.status === 0 || err?.code === "ERR_NETWORK") {
        setError("Network error. Please check your connection and API URL.");
      } else if (err?.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Login failed. Please try again.");
      }
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
