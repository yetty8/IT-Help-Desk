// backend/src/index.ts
import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Load .env ONLY in development
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
  "https://it-help-desk-mauve.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
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
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/* ------------------------------- HEALTHCHECK ------------------------------- */
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "IT Helpdesk API" });
});

/* ------------------------------- API ROUTES ------------------------------- */
app.use("/api/auth", authRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/users", usersRouter);

// Fallback for unknown API endpoints
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

/* ------------------------------- PRISMA CONNECTION ------------------------------- */
const prisma = new PrismaClient();

prisma
  .$connect()
  .then(() => console.log("✅ Prisma connected successfully"))
  .catch((err) => {
    console.error("❌ Prisma connection failed:", err);
    process.exit(1); // Stop container if DB is unreachable
  });

/* ------------------------------- SERVER START ------------------------------- */
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`🌐 Allowed CORS origins: ${allowedOrigins.join(", ")}`);
});
