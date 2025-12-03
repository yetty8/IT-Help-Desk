import { Request, Response } from "express";
import prisma from "../prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export async function register(req: Request, res: Response){
  try {
    const { email, password, name, role } = req.body;
    if(!email || !password) return res.status(400).json({error:"email and password required"});
    
    const existing = await prisma.user.findUnique({ where: { email }});
    if(existing) return res.status(400).json({error:"User exists"});
    
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hash, name: name || email, role: role || "USER" }});
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
  } catch (error: any) {
    console.error("Registration error:", error);
    // Simplify error message for users
    let errorMessage = "Database connection error. Please try again later.";
    if (error?.message?.includes("denied access")) {
      errorMessage = "Database connection failed. Please contact support.";
    } else if (error?.message?.includes("User exists")) {
      errorMessage = "A user with this email already exists.";
    }
    res.status(500).json({ error: errorMessage });
  }
}

export async function login(req: Request, res: Response){
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email }});
    if(!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
  } catch (error: any) {
    console.error("Login error:", error);
    const errorMessage = error?.message || "Database connection error";
    res.status(500).json({ error: errorMessage });
  }
}
