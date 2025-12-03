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

  const nav = useNavigate();
  const { user } = useAuth();

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

      // 🔥 Send as multipart form (supports file upload)
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("priority", priority);
      formData.append("category", category);
      if (file) formData.append("file", file);

      await API.post("/tickets", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setLoading(false);
      nav("/");
    } catch (err: any) {
      setLoading(false);
      setError(err?.response?.data?.error || "Failed to create ticket");
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
