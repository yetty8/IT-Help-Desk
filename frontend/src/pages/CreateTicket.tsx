// src/pages/CreateTicket.tsx
import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import { useAuth } from "../context/AuthContext";

export default function CreateTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [category, setCategory] = useState("GENERAL");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string>("");

  const nav = useNavigate();
  const { user } = useAuth();

  // Log API URL on mount for debugging
  React.useEffect(() => {
    const url = (import.meta.env.VITE_API_URL || API.defaults.baseURL) as string;
    setApiUrl(url);
    console.log("CreateTicket - API URL:", url);
    console.log("CreateTicket - Full API Base:", API.defaults.baseURL);
    console.log("CreateTicket - VITE_API_URL env:", import.meta.env.VITE_API_URL || "NOT SET");
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // 🔥 Validation
    if (title.trim().length < 5) {
      setError("Title must be at least 5 characters long.");
      return;
    }
    if (description.trim().length < 10) {
      setError("Description must be at least 10 characters long.");
      return;
    }

    try {
      setLoading(true);

      // Check if user is logged in
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not logged in. Please log in and try again.");
        setLoading(false);
        return;
      }

      // Ensure token is set in API defaults
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Log API details for debugging
      console.log("Creating ticket with API:", API.defaults.baseURL);
      console.log("Token present:", !!token);
      console.log("Authorization header:", API.defaults.headers.common["Authorization"] ? "Set" : "Missing");

      // 🔥 Send as multipart form (supports file upload)
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("priority", priority);
      formData.append("category", category);
      if (file) {
        formData.append("file", file);
        console.log("Including file:", file.name, file.size, "bytes");
      }

      // For multipart/form-data, let axios set Content-Type automatically
      // But explicitly include Authorization header
      const response = await API.post("/tickets", formData, {
        headers: { 
          "Authorization": `Bearer ${token}`
          // Don't set Content-Type - axios will set it with boundary for multipart
        },
      });

    console.log("Ticket created successfully:", response.data);
    setLoading(false);

    // Show success message and then redirect
    setError("Ticket created successfully! Redirecting...");
    setTimeout(() => {
      nav("/");
    }, 1500);
    } catch (err: any) {
      setLoading(false);
      console.error("Create ticket error:", err);
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
      if (err?.response?.status === 401) {
        setError("You are not logged in or your session expired. Please log in and try again.");
        // Clear invalid token
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => nav("/login"), 2000);
      } else if (err?.response?.status === 0 || err?.code === "ERR_NETWORK" || err?.code === "ERR_INTERNET_DISCONNECTED") {
        const apiUrl = API.defaults.baseURL || "NOT SET";
        setError(`Network error. Cannot reach backend at ${apiUrl}. Please check: 1) Backend is running, 2) VITE_API_URL is set in Vercel.`);
      } else if (err?.response?.status === 500) {
        const errorMsg = err?.response?.data?.error || "Server error";
        setError(`Server error: ${errorMsg}. The backend might be having issues. Check Railway logs.`);
      } else if (err?.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err?.message) {
        setError(`Error: ${err.message}`);
      } else {
        setError("Failed to create ticket. Please check the browser console for details.");
      }
    }
  }

  return (
    <div className="max-w-2xl">
      <form
        onSubmit={submit}
        className="bg-white dark:bg-slate-800 p-6 rounded shadow space-y-4"
      >
        <h2 className="text-xl font-semibold dark:text-slate-100">
          Create Ticket
        </h2>

        {/* Error Alert */}
        <ErrorAlert message={error} />
        
        {/* Debug info - visible in production to help diagnose issues */}
        <div className="text-xs text-gray-500 dark:text-gray-400 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
          <div className="font-semibold mb-2">🔍 Debug Info:</div>
          <div>API URL: <span className="font-mono text-xs">{apiUrl || "NOT SET"}</span></div>
          <div>Base URL: <span className="font-mono text-xs">{API.defaults.baseURL}</span></div>
          <div>Environment: {import.meta.env.MODE}</div>
          <div>VITE_API_URL: {import.meta.env.VITE_API_URL || "NOT SET"}</div>
          {!import.meta.env.VITE_API_URL && import.meta.env.PROD && (
            <div className="text-red-600 dark:text-red-400 mt-2 font-semibold">
              ⚠️ VITE_API_URL not set! Set it in Vercel environment variables.
            </div>
          )}
          {!import.meta.env.VITE_API_URL && import.meta.env.DEV && (
            <div className="text-blue-600 dark:text-blue-400 mt-2">
              ℹ️ Using localhost API (development mode - this is normal)
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <input
            maxLength={100}
            className="w-full border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 p-2 rounded"
            placeholder="Title (minimum 5 characters)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <p className="text-xs text-right text-slate-500 dark:text-slate-400">
            {title.length}/100
          </p>
        </div>

        {/* Description */}
        <div>
          <textarea
            maxLength={500}
            className="w-full border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 p-2 rounded h-32"
            placeholder="Describe the issue (minimum 10 characters)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p className="text-xs text-right text-slate-500 dark:text-slate-400">
            {description.length}/500
          </p>
        </div>

        {/* Category */}
        <select
          className="border w-full p-2 rounded dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="GENERAL">General</option>
          <option value="HARDWARE">Hardware</option>
          <option value="SOFTWARE">Software</option>
          <option value="NETWORK">Network</option>
          <option value="ACCESS">Access Request</option>
        </select>

        {/* Priority */}
        <select
          className="border w-full p-2 rounded dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            Attachment (optional):
          </label>
          <input
            type="file"
            className="block w-full text-sm text-gray-900 dark:text-slate-200 
            file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 
            file:text-sm file:font-semibold 
            file:bg-blue-50 file:text-blue-700 
            dark:file:bg-slate-700 dark:file:text-slate-200
            hover:file:bg-blue-100 dark:hover:file:bg-slate-600
            cursor-pointer border dark:border-slate-600 rounded p-1"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Selected: {file.name}
            </p>
          )}
        </div>

        {/* Created by */}
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Ticket will be created by: <strong>{user?.name || user?.email || "Unknown"}</strong>
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded text-white flex items-center ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? <LoadingSpinner size={1.1} /> : null}
            <span className="ml-2">
              {loading ? "Creating..." : "Create Ticket"}
            </span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => nav("/")}
            className="px-3 py-2 bg-gray-100 dark:bg-slate-700 dark:text-slate-100 rounded hover:bg-gray-200 dark:hover:bg-slate-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
