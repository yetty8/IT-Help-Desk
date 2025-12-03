// src/controllers/statsController.ts
import { Request, Response } from "express";
import prisma from "../prisma/client";

export async function stats(req: Request, res: Response) {
  const total = await prisma.ticket.count();
  const open = await prisma.ticket.count({ where: { status: "OPEN" } });
  const inProgress = await prisma.ticket.count({ where: { status: "IN_PROGRESS" } });
  const resolved = await prisma.ticket.count({ where: { status: "RESOLVED" } });
  const closed = await prisma.ticket.count({ where: { status: "CLOSED" } });
  res.json({ total, open, inProgress, resolved, closed });
}
