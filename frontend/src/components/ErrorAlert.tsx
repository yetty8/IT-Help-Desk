// src/components/ErrorAlert.tsx
import React from "react";

export default function ErrorAlert({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800 px-4 py-2 rounded">
      {message}
    </div>
  );
}
