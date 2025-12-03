import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../prisma/client";

export async function stats(req: AuthRequest, res: Response) {
  try {
    const total = await prisma.ticket.count();
    const open = await prisma.ticket.count({ where: { status: "OPEN" } });
    const inProgress = await prisma.ticket.count({ where: { status: "IN_PROGRESS" } });
    const resolved = await prisma.ticket.count({ where: { status: "RESOLVED" } });
    // tickets per priority
    const urgent = await prisma.ticket.count({ where: { priority: "URGENT" } });

    res.json({ total, open, inProgress, resolved, urgent });
  } catch (err) {
    res.status(500).json({ error: "Failed to load stats" });
  }
}
