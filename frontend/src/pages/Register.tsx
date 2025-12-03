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
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      setLoading(true);
      const res = await API.post("/auth/register", { email, name, password });
      const { token, user } = res.data;
      login(token, user);
      setLoading(false);
      nav("/");
    } catch (err: any) {
      setLoading(false);
      setError(err?.response?.data?.error || "Error registering");
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
