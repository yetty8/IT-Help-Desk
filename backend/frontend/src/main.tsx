import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { setToken } from "./api";

// Set token from localStorage on app load
const token = localStorage.getItem("token");
if (token) setToken(token);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);