import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import express from "express";
import authRouter from "./routes/auth";
import ticketRouter from "./routes/tickets";
import statsRouter from "./routes/stats";
import usersRouter from "./routes/users";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "IT Helpdesk API", ready: true });
});

// API ROUTES
app.use("/api/auth", authRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/stats", statsRouter);
app.use("/api/users", usersRouter);

// 🔥 Serve React frontend (built)
const frontendPath = path.join(__dirname, "frontend");
const indexFile = path.join(frontendPath, "index.html");

console.log(`📁 Looking for frontend at: ${frontendPath}`);
console.log(`📁 __dirname is: ${__dirname}`);
console.log(`📁 Checking if frontend exists: ${fs.existsSync(frontendPath)}`);

if (fs.existsSync(frontendPath)) {
  console.log(`✅ Frontend directory found! Serving from: ${frontendPath}`);
  app.use(express.static(frontendPath));
} else {
  console.error(`❌ Frontend directory NOT FOUND at: ${frontendPath}`);
}

// SPA fallback: serve index.html for all non-API routes
// This middleware runs last and handles 404s for frontend routes
app.use((req, res, next) => {
  // Don't handle API routes, uploads, or health check (let them 404 naturally)
  if (
    req.path.startsWith("/api") ||
    req.path.startsWith("/uploads") ||
    req.path === "/health"
  ) {
    return res.status(404).json({ error: "Not found" });
  }

  // For all other routes, serve the React app (SPA routing)
  if (fs.existsSync(indexFile)) {
    res.sendFile(path.resolve(indexFile));
  } else {
    res.status(500).send("Frontend not built. Run npm run build first.");
  }
});

// SERVER
const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
  console.log(`✅ Frontend served from: ${frontendPath}`);
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully...");
  process.exit(0);
});
// Railway deployment trigger - Thu Dec  4 19:11:48 EST 2025
