import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export interface AuthRequest extends Request {
  user?: { userId: number; role: string; }
}

export function requireAuth(req: Request, res: Response, next: NextFunction){
  const authReq = req as AuthRequest;
  const auth = authReq.headers.authorization;
  if(!auth) return res.status(401).json({ error: "Missing auth" });
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    authReq.user = { userId: payload.userId, role: payload.role };
    next();
  } catch(e){
    res.status(401).json({ error: "Invalid token" });
  }
}
