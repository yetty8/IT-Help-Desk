import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

// Load .env ONLY in development (NEVER in Railway)
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(process.cwd(), ".env") });
}

import authRouter from "./routes/auth";
import ticketsRouter from "./routes/tickets";
import statsRouter from "./routes/stats";
import usersRouter from "./routes/users";

const app = express();

/* ------------------------------- CORS SETUP ------------------------------- */

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://it-help-desk-mauve.vercel.app", // Vercel frontend
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow server-to-server
      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error(`CORS blocked for: ${origin}`));
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

/* ------------------------------- MIDDLEWARE ------------------------------- */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file upload serving
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/* --------------------------------- HEALTH -------------------------------- */

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "IT Helpdesk API" });
});

/* ---------------------------------- API ---------------------------------- */

app.use("/api/auth", authRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/users", usersRouter);

// Unknown API fallback
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

/* ----------------------------- SERVER START ------------------------------ */

// MOST IMPORTANT LINE FOR RAILWAY — DO NOT CHANGE
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`🌐 Allowed CORS origins: ${allowedOrigins.join(", ")}`);
});
