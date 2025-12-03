// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import API, { setToken, decodeToken } from "../api";

type User = { userId: number; role: string; email?: string; name?: string };

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user?: Partial<User>) => void;
  logout: () => void;
  updateUser: (u: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTok] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : token ? decodeToken(token) : null;
  });

  useEffect(() => {
    if (token) setToken(token);
    else setToken(undefined);
  }, [token]);

  function login(newToken: string, u?: Partial<User>) {
    localStorage.setItem("token", newToken);
    setTok(newToken);
    const decoded = decodeToken(newToken);
    const nextUser = { ...(decoded || {}), ...u } as User;
    setUser(nextUser);
    localStorage.setItem("user", JSON.stringify(nextUser));
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setTok(null);
    setUser(null);
    setToken(undefined);
    // optionally navigate to login in components
  }

  function updateUser(u: Partial<User>) {
    const next = { ...(user || {}), ...u } as User;
    setUser(next);
    localStorage.setItem("user", JSON.stringify(next));
  }

  return <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
