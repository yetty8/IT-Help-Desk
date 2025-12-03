import { Request, Response } from "express";
import prisma from "../prisma/client";
import { AuthRequest } from "../middleware/auth";
import bcrypt from "bcryptjs";

// ---------------------------
// GET /users (list all - Admin only)
// ---------------------------
export async function listUsers(req: AuthRequest, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            tickets: true,
            assigned: true,
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to load users" });
  }
}

// ---------------------------
// POST /users (create user - Admin only)
// ---------------------------
export async function createUser(req: AuthRequest, res: Response) {
  const { email, password, name, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        name: name || email,
        role: role || "USER",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      }
    });

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to create user" });
  }
}

// ---------------------------
// PATCH /users/:id (update user - Admin only)
// ---------------------------
export async function updateUser(req: AuthRequest, res: Response) {
  const userId = Number(req.params.id);
  const { name, role, isActive, password } = req.body;

  try {
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      }
    });

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update user" });
  }
}

// ---------------------------
// DELETE /users/:id (delete user - Admin only)
// ---------------------------
export async function deleteUser(req: AuthRequest, res: Response) {
  const userId = Number(req.params.id);

  try {
    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete user" });
  }
}

