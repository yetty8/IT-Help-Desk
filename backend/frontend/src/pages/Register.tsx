// src/pages/Register.tsx
import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";

export default function Register() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    // Trim inputs to handle mobile keyboard issues
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    const trimmedPassword = password.trim();
    
    if (!trimmedEmail || !trimmedPassword) {
      setError("Email and password are required");
      return;
    }
    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      setLoading(true);
      const res = await API.post("/auth/register", { 
        email: trimmedEmail, 
        name: trimmedName || trimmedEmail,
        password: trimmedPassword 
      });
      const { token, user } = res.data;
      login(token, user);
      setLoading(false);
      nav("/");
    } catch (err: any) {
      setLoading(false);
      console.error("Registration error:", err);
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
      
      // Better error handling with more details
      if (err?.response?.status === 0 || err?.code === "ERR_NETWORK" || err?.code === "ERR_INTERNET_DISCONNECTED") {
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
        setError("Registration failed. Please check the browser console for details.");
      }
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={submit} className="bg-white dark:bg-slate-800 p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold dark:text-slate-100">Register</h2>
        <ErrorAlert message={error} />
        <input className="w-full border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 p-2 rounded" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />
        <input className="w-full border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 p-2 rounded" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input className="w-full border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 p-2 rounded" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
        <button className="px-4 py-2 bg-green-600 text-white rounded flex items-center">
          {loading ? <LoadingSpinner size={1.2} /> : null}
          <span className="ml-2">{loading ? "Registering..." : "Register"}</span>
        </button>
      </form>
    </div>
  );
}
