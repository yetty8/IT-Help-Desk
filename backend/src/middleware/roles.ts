// src/middleware/roles.ts
import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

export function requireRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    if (req.user.role !== role) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  if (req.user.role !== "ADMIN") return res.status(403).json({ error: "Admin access required" });
  next();
}

export function requireTech(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  if (req.user.role !== "TECH" && req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Tech or Admin access required" });
  }
  next();
}
