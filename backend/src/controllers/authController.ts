import { Request, Response } from "express";
import prisma from "../prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

// Type assertion to ensure JWT_SECRET is always a string after the check
const getJwtSecret = (): string => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  return JWT_SECRET;
};

export async function register(req: Request, res: Response){
  try {
    const { email, password, name, role } = req.body;
    
    if(!email || !password) {
      return res.status(400).json({error:"email and password required"});
    }
    
    // Normalize email (lowercase and trim)
    const normalizedEmail = email.toLowerCase().trim();
    const trimmedPassword = password.trim();
    
    if (!normalizedEmail || !trimmedPassword) {
      return res.status(400).json({error:"email and password required"});
    }
    
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail }});
    if(existing) return res.status(400).json({error:"User exists"});
    
    const hash = await bcrypt.hash(trimmedPassword, 10);
    const user = await prisma.user.create({ 
      data: { 
        email: normalizedEmail, 
        password: hash, 
        name: (name || normalizedEmail).trim(), 
        role: role || "USER" 
      }
    });
    const token = jwt.sign({ userId: user.id, role: user.role }, getJwtSecret(), { expiresIn: "7d" });
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
  } catch (error: any) {
    console.error("Registration error:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      name: error?.name
    });
    
    // More specific error messages
    let errorMessage = "Database connection error. Please try again later.";
    let statusCode = 500;
    
    if (error?.code === "P1001" || error?.message?.includes("Can't reach database server")) {
      errorMessage = "Database server is unreachable. Check Railway: 1) PostgreSQL is running, 2) DATABASE_URL is set correctly.";
    } else if (error?.code === "P1000" || error?.message?.includes("Authentication failed")) {
      errorMessage = "Database authentication failed. Check DATABASE_URL in Railway.";
    } else if (error?.code === "P2002" || error?.message?.includes("Unique constraint")) {
      errorMessage = "A user with this email already exists.";
      statusCode = 400;
    } else if (error?.message?.includes("User exists")) {
      errorMessage = "A user with this email already exists.";
      statusCode = 400;
    } else if (error?.message?.includes("denied access")) {
      errorMessage = "Database connection failed. Please contact support.";
    }
    
    res.status(statusCode).json({ error: errorMessage });
  }
}

export async function login(req: Request, res: Response){
  try {
    const { email, password } = req.body;
    
    // Log login attempt (without password) for debugging
    console.log("Login attempt for email:", email ? email.toLowerCase().trim() : "missing");
    
    if (!email || !password) {
      console.log("Login failed: Missing email or password");
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    // Normalize email (lowercase and trim)
    const normalizedEmail = email.toLowerCase().trim();
    const trimmedPassword = password.trim();
    
    if (!normalizedEmail || !trimmedPassword) {
      console.log("Login failed: Empty email or password after normalization");
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail }});
    
    if(!user) {
      console.log("Login failed: User not found for email:", normalizedEmail);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const ok = await bcrypt.compare(trimmedPassword, user.password);
    
    if(!ok) {
      console.log("Login failed: Password mismatch for email:", normalizedEmail);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    console.log("Login successful for user:", user.email);
    const token = jwt.sign({ userId: user.id, role: user.role }, getJwtSecret(), { expiresIn: "7d" });
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
  } catch (error: any) {
    console.error("Login error:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      name: error?.name
    });
    
    // More specific error messages
    let errorMessage = "Database connection error. Please try again later.";
    
    if (error?.code === "P1001" || error?.message?.includes("Can't reach database server")) {
      errorMessage = "Database server is unreachable. Check Railway: 1) PostgreSQL is running, 2) DATABASE_URL is set correctly.";
    } else if (error?.code === "P1000" || error?.message?.includes("Authentication failed")) {
      errorMessage = "Database authentication failed. Check DATABASE_URL in Railway.";
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    res.status(500).json({ error: errorMessage });
  }
}
