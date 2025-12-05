import React, { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("dark") === "1");

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("dark", dark ? "1" : "0");
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="px-3 py-2 border dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 rounded touch-manipulation active:bg-gray-100 dark:active:bg-slate-700 transition-colors"
      aria-pressed={dark}
      aria-label="Toggle dark mode"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {dark ? "Light" : "Dark"}
    </button>
  );
}