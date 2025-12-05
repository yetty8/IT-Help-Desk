// src/components/BackButton.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackButton({ to = "/" }: { to?: string }) {
  const nav = useNavigate();
  return (
    <button onClick={() => nav(to)} className="text-sm px-3 py-1 bg-gray-100 dark:bg-slate-700 dark:text-slate-100 rounded hover:bg-gray-200 dark:hover:bg-slate-600">
      ← Back
    </button>
  );
}
