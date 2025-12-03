// src/components/Navbar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="w-full bg-white dark:bg-slate-900 shadow px-6 py-4 flex justify-between items-center">
      {/* Left: Logo */}
      <Link
        to="/"
        className="text-xl font-bold dark:text-white tracking-wide"
      >
        IT Helpdesk
      </Link>

      {/* Right: Menu */}
      <div className="flex items-center gap-6">

        {/* Authenticated Navigation */}
        {user && (
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Tickets
            </Link>

            <Link
              to="/create"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Create Ticket
            </Link>

            <Link
              to="/profile"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="text-sm text-red-500 dark:text-red-400 font-medium hover:underline"
            >
              Logout
            </button>
          </div>
        )}

        {/* Non-logged-in */}
        {!user && (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:underline"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:underline"
            >
              Register
            </Link>
          </div>
        )}

        {/* Dark Mode Toggle */}
        <div className="ml-4">
          <DarkModeToggle />
        </div>
      </div>
    </nav>
  );
}
