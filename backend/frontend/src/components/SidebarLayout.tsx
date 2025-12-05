// src/components/SidebarLayout.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-slate-900">
      <aside className="w-64 bg-white dark:bg-slate-800 border-r dark:border-slate-700 p-4 hidden md:block">
        <div className="mb-6">
          <h2 className="text-xl font-bold dark:text-slate-100">IT Helpdesk</h2>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{user?.name ?? user?.email}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Role: {user?.role ?? "GUEST"}</div>
        </div>

        <nav className="space-y-2">
          <Link className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-slate-200" to="/">Tickets</Link>
          <Link className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-slate-200" to="/create">Create Ticket</Link>
          <Link className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-slate-200" to="/profile">Profile</Link>
        </nav>

        <div className="mt-6">
          {user ? (
            <button onClick={() => { logout(); window.location.href = "/login"; }} className="w-full text-left px-3 py-2 rounded bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400">Logout</button>
          ) : (
            <Link to="/login" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-slate-200">Login</Link>
          )}
        </div>
      </aside>

      <main className="flex-1 p-6">
        {/* mobile header */}
        <div className="md:hidden mb-4 flex justify-between items-center">
          <h2 className="text-lg font-bold dark:text-slate-100">IT Helpdesk</h2>
          <div>
            {user ? (
              <button onClick={() => { logout(); window.location.href = "/login"; }} className="px-2 py-1 rounded bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">Logout</button>
            ) : (
              <Link to="/login" className="px-2 py-1 dark:text-slate-200">Login</Link>
            )}
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
