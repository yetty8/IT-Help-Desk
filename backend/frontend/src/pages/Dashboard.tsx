// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import API from "../api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Dashboard(){
  const [stats, setStats] = useState<any|null>(null);
  useEffect(()=>{
    API.get("/stats").then(r => setStats(r.data)).catch(e => console.error(e));
  }, []);
  if(!stats) return <div className="flex justify-center"><LoadingSpinner size={2} /></div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="p-4 bg-white dark:bg-slate-800 rounded shadow">
        <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
        <div className="text-2xl font-bold dark:text-slate-100">{stats.total}</div>
      </div>
      <div className="p-4 bg-white dark:bg-slate-800 rounded shadow">
        <div className="text-sm text-gray-500 dark:text-gray-400">Open</div>
        <div className="text-2xl font-bold dark:text-slate-100">{stats.open}</div>
      </div>
      <div className="p-4 bg-white dark:bg-slate-800 rounded shadow">
        <div className="text-sm text-gray-500 dark:text-gray-400">In Progress</div>
        <div className="text-2xl font-bold dark:text-slate-100">{stats.inProgress}</div>
      </div>
      <div className="p-4 bg-white dark:bg-slate-800 rounded shadow">
        <div className="text-sm text-gray-500 dark:text-gray-400">Resolved</div>
        <div className="text-2xl font-bold dark:text-slate-100">{stats.resolved}</div>
      </div>
    </div>
  );
}
