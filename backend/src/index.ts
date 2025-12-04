import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import express from "express";
import authRouter from "./routes/auth";
import ticketRouter from "./routes/tickets";
import statsRouter from "./routes/stats";
import usersRouter from "./routes/users";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// HEALTH CHECK for Railway (must be first!)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// API ROUTES
app.use("/api/auth", authRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/stats", statsRouter);
app.use("/api/users", usersRouter);

// 🔥 SERVE FRONTEND (React Build)
const frontendPath = path.join(__dirname, "frontend/dist");
console.log(`📁 Looking for frontend at: ${frontendPath}`);
console.log(`📁 __dirname is: ${__dirname}`);
console.log(`📁 Checking if frontend exists: ${require('fs').existsSync(frontendPath)}`);

if (require('fs').existsSync(frontendPath)) {
  console.log(`✅ Frontend directory found! Serving from: ${frontendPath}`);
  app.use(express.static(frontendPath));
} else {
  console.error(`❌ Frontend directory NOT FOUND at: ${frontendPath}`);
  console.error(`📁 Current working directory: ${process.cwd()}`);
  console.error(`📁 Listing dist directory:`, require('fs').readdirSync(__dirname).join(', '));
}

// SPA fallback: serve index.html for all non-API routes (including root)
app.get("*", (req, res) => {
  // Don't serve index.html for API routes or health check
  if (req.path.startsWith("/api") || req.path === "/health") {
    return res.status(404).json({ error: "Not found" });
  }
  // Serve frontend for all other routes (including root)
  res.sendFile(path.join(frontendPath, "index.html"));
});

// SERVER
const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || "0.0.0.0";

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
  console.log(`✅ Frontend served from: ${frontendPath}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
});
