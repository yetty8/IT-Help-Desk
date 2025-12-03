import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../prisma/client";
import bcrypt from "bcryptjs";

export async function listUsers(req: AuthRequest, res: Response) {
  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to list users" });
  }
}

export async function createUser(req: AuthRequest, res: Response) {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hash, role: role || "USER" } });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
}

export async function updateUser(req: AuthRequest, res: Response) {
  try {
    const id = Number(req.params.id);
    const { name, role } = req.body;
    const user = await prisma.user.update({ where: { id }, data: { name, role } });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
}

export async function deleteUser(req: AuthRequest, res: Response) {
  try {
    const id = Number(req.params.id);
    await prisma.user.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
}
