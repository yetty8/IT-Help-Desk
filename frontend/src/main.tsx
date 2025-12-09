import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { setToken } from "./api";
import '@fontsource/inter/400.css'; // Regular weight
import '@fontsource/inter/500.css'; // Medium weight
import '@fontsource/inter/600.css'; // Semi-bold weight
import '@fontsource/inter/700.css'; // Bold weight

// Set token from localStorage on app load
const token = localStorage.getItem("token");
if (token) setToken(token);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);