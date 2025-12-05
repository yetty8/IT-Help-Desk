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
    <nav className="w-full bg-white dark:bg-slate-900 shadow px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {/* Left: Logo */}
      <Link
        to="/"
        className="text-xl font-bold dark:text-white tracking-wide block"
      >
        IT Helpdesk
      </Link>

      {/* Right: Menu */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-6 w-full sm:w-auto justify-end">

        {/* Authenticated Navigation */}
        {user && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <Link
              to="/"
              className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors touch-manipulation"
              style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              Tickets
            </Link>

            <Link
              to="/create"
              className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors touch-manipulation"
              style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              Create Ticket
            </Link>

            <Link
              to="/profile"
              className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors touch-manipulation"
              style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="text-sm sm:text-base text-red-500 dark:text-red-400 font-medium hover:underline px-3 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors touch-manipulation"
              style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              Logout
            </button>
          </div>
        )}

        {/* Non-logged-in */}
        {!user && (
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/login"
              className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors touch-manipulation active:bg-gray-200 dark:active:bg-slate-700"
              style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm sm:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-4 py-2 rounded-md transition-colors touch-manipulation active:bg-blue-800 dark:active:bg-blue-700"
              style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              Register
            </Link>
          </div>
        )}

        {/* Dark Mode Toggle */}
        <div className="ml-0 sm:ml-4">
          <DarkModeToggle />
        </div>
      </div>
    </nav>
  );
}
