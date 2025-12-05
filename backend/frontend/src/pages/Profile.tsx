// src/pages/Profile.tsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";

export default function Profile() {
  const { user } = useAuth();

  // Prevent white screen if user is missing
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <h1 className="text-2xl font-bold text-red-500">User not found</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-300">
          Please log in again.
        </p>
        <BackButton to="/" />
      </div>
    );
  }

  return (
    <div className="flex justify-center pt-10 px-4">
      <div className="max-w-md w-full">
        <BackButton to="/" />

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow mt-4 border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold dark:text-slate-100 mb-4">
            Profile
          </h2>

          <div className="space-y-3 dark:text-slate-200">
            <div className="flex justify-between">
              <strong>Name:</strong>
              <span>{user.name}</span>
            </div>

            <div className="flex justify-between">
              <strong>Email:</strong>
              <span>{user.email}</span>
            </div>

            <div className="flex justify-between">
              <strong>Role:</strong>
              <span className="capitalize">{user.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
