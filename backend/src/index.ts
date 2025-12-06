import dotenv from "dotenv";
import path from "path";
import express from "express";
import cors from "cors";

import authRouter from "./routes/auth";
import ticketRouter from "./routes/tickets";
import statsRouter from "./routes/stats";
import usersRouter from "./routes/users";

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "IT Helpdesk API" });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/stats", statsRouter);
app.use("/api/users", usersRouter);

// 404 for unknown API routes
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  next();
});

const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`🚀 API running at http://${HOST}:${PORT}`);
  console.log(`✅ CORS enabled for: ${allowedOrigins.join(", ")}`);
});
