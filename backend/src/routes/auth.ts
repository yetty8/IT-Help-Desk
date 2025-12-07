// backend/src/routes/auth.ts
import { Router } from "express";
const router = Router();

router.post("/register", async (req, res) => {
  // your registration logic
  res.json({ message: "User registered successfully" });
});

router.post("/login", async (req, res) => {
  // your login logic
  res.json({ message: "User logged in successfully" });
});

export default router;
