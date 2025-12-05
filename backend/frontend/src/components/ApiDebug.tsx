// Debug component to check API configuration
// Remove this in production
import React from "react";
import API from "../api";

export default function ApiDebug() {
  if (import.meta.env.PROD) return null; // Hide in production
  
  const apiUrl = import.meta.env.VITE_API_URL || "Not set";
  const actualBaseUrl = API.defaults.baseURL;
  
  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 dark:bg-yellow-900 p-4 rounded shadow text-xs max-w-xs">
      <div className="font-bold mb-2">API Debug Info</div>
      <div>VITE_API_URL: {apiUrl}</div>
      <div>Base URL: {actualBaseUrl}</div>
      <div>Environment: {import.meta.env.MODE}</div>
      <button
        onClick={async () => {
          try {
            const res = await API.get("/stats");
            console.log("API Test Success:", res.data);
            alert("API connection successful!");
          } catch (err: any) {
            console.error("API Test Failed:", err);
            alert(`API connection failed: ${err.message}`);
          }
        }}
        className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
      >
        Test API Connection
      </button>
    </div>
  );
}

