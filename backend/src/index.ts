import dotenv from "dotenv";
import path from "path";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import ticketsRouter from "./routes/tickets";
import statsRouter from "./routes/stats";
import usersRouter from "./routes/users";

// Load .env file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "IT Helpdesk API" });
});

// API routes
app.use("/api/auth", authRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/users", usersRouter);

// 404 handler for unknown /api routes
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Use the PORT Railway gives us, default 8080 locally
const PORT = Number(process.env.PORT) || 8080;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`🚀 Backend API running at http://${HOST}:${PORT}`);
  console.log(`✅ CORS enabled for: ${allowedOrigins.join(", ") || "all origins"}`);
});
