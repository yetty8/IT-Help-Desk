import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import express from "express";

import authRouter from "./routes/auth";
import ticketRouter from "./routes/tickets";
import statsRouter from "./routes/stats";
import usersRouter from "./routes/users";

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "IT Helpdesk API",
    ready: true,
  });
});

// API routes
app.use("/api/auth", authRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/stats", statsRouter);
app.use("/api/users", usersRouter);

// ---------------------------
// 🚀 FRONTEND SETUP
// ---------------------------

const frontendPath = path.join(__dirname, "../frontend/dist");
const indexHtml = path.join(frontendPath, "index.html");

console.log("📁 __dirname:", __dirname);
console.log("📁 Looking for frontend at:", frontendPath);
console.log("📁 Frontend exists:", fs.existsSync(frontendPath));

// Serve static frontend files
if (fs.existsSync(frontendPath)) {
  console.log("✅ Frontend FOUND! Serving static files.");
  app.use(express.static(frontendPath));
} else {
  console.error("❌ Frontend not found. Build it with npm run build.");
}

// ---------------------------
// SPA FALLBACK (EXPRESS 5 FIX)
// ---------------------------
// Express 5 DOES NOT support "*" or "/*"
// Use a REGEX instead → works 100%
app.get(/.*/, (req, res) => {
  // Allow API & uploads to behave normally
  if (
    req.path.startsWith("/api") ||
    req.path.startsWith("/uploads") ||
    req.path === "/health"
  ) {
    return res.status(404).json({ error: "Not found" });
  }

  if (fs.existsSync(indexHtml)) {
    return res.sendFile(indexHtml);
  } else {
    return res.status(500).send("Frontend not built. Run npm run build.");
  }
});

// ---------------------------
// START SERVER
// ---------------------------
const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
  console.log(`📁 Serving frontend from: ${frontendPath}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down...");
  process.exit(0);
});
