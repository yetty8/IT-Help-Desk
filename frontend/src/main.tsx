import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TicketList from "./pages/TicketList";
import CreateTicket from "./pages/CreateTicket";
import TicketDetail from "./pages/TicketDetail";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import "./index.css";
import { setToken } from "./api";
import { AuthProvider, useAuth } from "./context/AuthContext";

const token = localStorage.getItem("token");
if (token) setToken(token);

function App() {
  const { token: ctxToken, logout } = useAuth();
  const isLoggedIn = !!ctxToken;

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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);