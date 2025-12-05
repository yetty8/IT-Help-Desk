// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TicketList from "./pages/TicketList";
import TicketDetail from "./pages/TicketDetail";
import CreateTicket from "./pages/CreateTicket";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import DashboardLayout from "./layouts/DashboardLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./index.css";

function AppRoutes() {
  const { token } = useAuth();
  const isLoggedIn = !!token;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6">
          <Routes>
            <Route path="/" element={isLoggedIn ? <TicketList /> : <Navigate to="/login" />} />
            <Route path="/create" element={isLoggedIn ? <CreateTicket /> : <Navigate to="/login" />} />
            <Route path="/ticket/:id" element={isLoggedIn ? <TicketDetail /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
