import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DarkModeToggle from "../components/DarkModeToggle";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900">

      {/* Sidebar */}
      <aside className="w-60 bg-white dark:bg-slate-800 shadow-lg flex flex-col py-6 px-4">
        <div className="text-2xl font-bold text-center dark:text-white mb-8">
          IT Helpdesk
        </div>

        <nav className="flex flex-col gap-3">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium 
            text-gray-700 dark:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <span>🏠</span> Dashboard
          </Link>

          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium 
            text-gray-700 dark:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <span>🎫</span> Tickets
          </Link>

          <Link
            to="/create"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium 
            text-gray-700 dark:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <span>➕</span> Create Ticket
          </Link>

          <Link
            to="/profile"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium 
            text-gray-700 dark:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <span>👤</span> Profile
          </Link>
        </nav>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Logout */}
        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium 
            text-red-500 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-slate-700"
          >
            <span>🚪</span> Logout
          </button>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        
        {/* Top Bar */}
        <header className="w-full h-14 bg-white dark:bg-slate-800 shadow 
        flex items-center justify-end px-6">
          <DarkModeToggle />
        </header>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
