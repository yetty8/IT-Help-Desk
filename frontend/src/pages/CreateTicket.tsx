import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";

type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type Category = "GENERAL" | "HARDWARE" | "SOFTWARE" | "NETWORK" | "ACCESS";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function CreateTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [category, setCategory] = useState<Category>("GENERAL");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const nav = useNavigate();
  const { user } = useAuth();

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setCategory("GENERAL");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const validateForm = useCallback((): boolean => {
    if (title.trim().length < 5) {
      setError("Title must be at least 5 characters long.");
      return false;
    }
    if (description.trim().length < 10) {
      setError("Description must be at least 10 characters long.");
      return false;
    }
    if (file && file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
      return false;
    }
    return true;
  }, [title, description, file]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
        setError(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }
      setFile(selectedFile);
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in. Please log in and try again.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("priority", priority);
      formData.append("category", category);
      if (file) {
        formData.append("file", file);
      }

      await API.post("/tickets", formData, {
        headers: { 
          "Authorization": `Bearer ${token}`,
        },
      });

      setError("Ticket created successfully! Redirecting...");
      resetForm();
      
      setTimeout(() => {
        nav("/tickets");
      }, 1500);

    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => nav("/login"), 2000);
      } else if (err?.response?.status === 413) {
        setError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      } else if (err?.response?.status === 429) {
        setError("Too many requests. Please wait a moment and try again.");
      } else if (err?.code === "ERR_NETWORK" || err?.code === "ERR_INTERNET_DISCONNECTED") {
        setError("Network error. Please check your internet connection.");
      } else if (err?.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(err?.response?.data?.error || "Failed to create ticket. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [title, description, priority, category, file, validateForm, resetForm, nav]);

  const isFormDirty = title.trim() || description.trim() || file;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md space-y-4"
        aria-busy={loading}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create New Ticket
        </h2>

        <ErrorAlert message={error} />

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            maxLength={100}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
            placeholder="Brief description of your issue"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            required
          />
          <p className="text-xs text-right text-gray-500 dark:text-gray-400 mt-1">
            {title.length}/100 characters
          </p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            maxLength={500}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white h-32"
            placeholder="Please provide detailed information about your issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            required
          />
          <p className="text-xs text-right text-gray-500 dark:text-gray-400 mt-1">
            {description.length}/500 characters
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              id="category"
              className="w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              disabled={loading}
            >
              <option value="GENERAL">General</option>
              <option value="HARDWARE">Hardware</option>
              <option value="SOFTWARE">Software</option>
              <option value="NETWORK">Network</option>
              <option value="ACCESS">Access Request</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              id="priority"
              className="w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              disabled={loading}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Attachment (optional, max {MAX_FILE_SIZE_MB}MB)
          </label>
          <div className="mt-1 flex items-center">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              disabled={loading}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600"
            >
              Choose File
            </label>
            <span className="ml-3 text-sm text-gray-500 dark:text-gray-300">
              {file ? file.name : "No file chosen"}
            </span>
          </div>
          {file && (
            <button
              type="button"
              onClick={() => {
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="mt-1 text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              disabled={loading}
            >
              Remove file
            </button>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => nav(-1)}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600 disabled:opacity-50"
          >
            Cancel
          </button>
          
          <div className="flex items-center space-x-3">
            {isFormDirty && (
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600 disabled:opacity-50"
              >
                Reset
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading || !title.trim() || !description.trim()}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <LoadingSpinner size={1.2} className="mr-2" />
                  Creating...
                </span>
              ) : (
                "Create Ticket"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}