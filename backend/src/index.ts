import dotenv from "dotenv";
import path from "path";

// Load .env file FIRST, before any other imports
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import ticketRouter from "./routes/tickets";
import statsRouter from "./routes/stats";
import usersRouter from "./routes/users";

const app = express();

// CORS configuration - uses environment variable for frontend URL
const allowedOrigins = [
  "http://localhost:5174",
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : true, // Allow all origins in dev if FRONTEND_URL not set
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Track server readiness
let serverReady = false;

// Health check endpoint (for Railway/health checks)
// Railway checks this endpoint to verify the service is running
// Must respond quickly (< 1 second)
app.get("/health", (req, res) => {
  if (!serverReady) {
    return res.status(503).json({ status: "starting" });
  }
  res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint for Railway health checks (some platforms check /)
app.get("/", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    service: "IT Helpdesk API",
    timestamp: new Date().toISOString(),
    ready: serverReady
  });
});

// Database connection test endpoint (for debugging)
app.get("/api/test-db", async (req, res) => {
  try {
    const prisma = (await import("./prisma/client")).default;
    await prisma.$queryRaw`SELECT 1 as test`;
    res.status(200).json({ 
      status: "ok", 
      message: "Database connection successful",
      databaseUrl: process.env.DATABASE_URL ? "Set (hidden)" : "NOT SET"
    });
  } catch (error: any) {
    console.error("Database connection test failed:", error);
    res.status(500).json({ 
      status: "error",
      message: "Database connection failed",
      error: error?.message || "Unknown error",
      code: error?.code,
      databaseUrl: process.env.DATABASE_URL ? "Set (hidden)" : "NOT SET"
    });
  }
});

app.use("/api/auth", authRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/stats", statsRouter);
app.use("/api/users", usersRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || "0.0.0.0"; // Railway needs 0.0.0.0, not localhost

// Keep process alive and handle errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit - keep server running
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit - keep server running
});

const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Server running on http://${HOST}:${PORT}`);
  console.log(`✅ Health check available at http://${HOST}:${PORT}/health`);
  console.log(`✅ Root endpoint available at http://${HOST}:${PORT}/`);
  
  // Mark server as ready after a brief moment
  // This gives time for all routes to be registered
  setTimeout(() => {
    serverReady = true;
    console.log(`✅ Server is ready and accepting requests`);
  }, 100);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
