import { Request, Response } from "express";
import prisma from "../prisma/client";
import { AuthRequest } from "../middleware/auth";

// ---------------------------
// GET /tickets  (list all)
// ---------------------------
export async function listTickets(req: Request, res: Response) {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        reporter: true,
        assignee: true
      }
    });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: "Failed to load tickets" });
  }
}

// Helper function to generate ticket number
async function generateTicketNumber(): Promise<string> {
  const lastTicket = await prisma.ticket.findFirst({
    orderBy: { id: "desc" },
    select: { ticketNumber: true } as any
  });

  let nextNumber = 1001;
  if (lastTicket && (lastTicket as any).ticketNumber) {
    const match = (lastTicket as any).ticketNumber.match(/IT-(\d+)/);
    if (match) {
      nextNumber = parseInt(match[1]) + 1;
    }
  }

  return `IT-${nextNumber}`;
}

// ---------------------------
// POST /tickets  (create)
// ---------------------------
export async function createTicket(req: AuthRequest, res: Response) {
  const { title, description, priority, category, location, device, dueDate, slaLevel } = req.body;
  const userId = req.user!.userId;

  if (!title || !description) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Handle file upload if present
  let fileUrl: string | undefined;
  if (req.file) {
    fileUrl = `/uploads/${req.file.filename}`;
  }

  try {
    const ticketNumber = await generateTicketNumber();
    
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        title,
        description,
        priority: priority || "MEDIUM",
        category: category || "GENERAL",
        location,
        device,
        dueDate: dueDate ? new Date(dueDate) : null,
        slaLevel: slaLevel || "MEDIUM",
        fileUrl,
        reporterId: userId,
      } as any,
      include: {
        reporter: true,
        assignee: true
      }
    });

    // Log ticket creation activity
    await (prisma as any).activityLog.create({
      data: {
        action: "TICKET_CREATED",
        newValue: ticketNumber,
        details: `Ticket ${ticketNumber} created`,
        authorId: userId,
        ticketId: ticket.id,
      }
    });

    // Log file upload if present
    if (fileUrl) {
      await (prisma as any).activityLog.create({
        data: {
          action: "FILE_UPLOADED",
          details: `File uploaded: ${req.file?.originalname}`,
          authorId: userId,
          ticketId: ticket.id,
        }
      });
    }

    res.json(ticket);
  } catch (err: any) {
    console.error("Create ticket error:", err);
    res.status(500).json({ error: err.message || "Failed to create ticket" });
  }
}

// ---------------------------
// GET /tickets/:id  (details)
// ---------------------------
export async function getTicket(req: Request, res: Response) {
  const ticketId = Number(req.params.id);

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        reporter: true,
        assignee: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: "asc" }
        }
      } as any
    });

    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    // Fetch activities separately to avoid type issues
    const activities = await (prisma as any).activityLog.findMany({
      where: { ticketId },
      include: { author: true },
      orderBy: { createdAt: "asc" }
    });

    res.json({ ...ticket, activities });
  } catch (err) {
    res.status(500).json({ error: "Failed to get ticket" });
  }
}

// ---------------------------
// POST /tickets/:id/comments
// ---------------------------
export async function addComment(req: AuthRequest, res: Response) {
  const ticketId = Number(req.params.id);
  const { body } = req.body;
  const authorId = req.user!.userId;

  if (!body) return res.status(400).json({ error: "Comment required" });

  try {
    const comment = await prisma.comment.create({
      data: {
        body,
        ticketId,
        authorId
      },
      include: { author: true }
    });

    // Log activity
    await (prisma as any).activityLog.create({
      data: {
        action: "COMMENT_ADDED",
        details: `Comment added: ${body.substring(0, 50)}...`,
        authorId,
        ticketId,
      }
    });

    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
}

// ---------------------------
// POST /tickets/:id/assign
// ---------------------------
export async function assignTicket(req: AuthRequest, res: Response) {
  const ticketId = Number(req.params.id);
  const { assigneeId } = req.body;
  const authorId = req.user!.userId;

  try {
    const oldTicket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { assigneeId: true }
    });

    const ticket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { assigneeId },
      include: { assignee: true }
    });

    // Log activity
    const assignee = await prisma.user.findUnique({ where: { id: assigneeId || 0 }, select: { name: true } });
    await (prisma as any).activityLog.create({
      data: {
        action: "ASSIGNED",
        oldValue: oldTicket?.assigneeId?.toString() || "Unassigned",
        newValue: assigneeId?.toString() || "Unassigned",
        details: assigneeId ? `Assigned to ${assignee?.name || "user"}` : "Unassigned",
        authorId,
        ticketId,
      }
    });

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: "Failed to assign ticket" });
  }
}

// ---------------------------
// POST /tickets/:id/status
// ---------------------------
export async function updateStatus(req: AuthRequest, res: Response) {
  const ticketId = Number(req.params.id);
  const { status } = req.body;
  const authorId = req.user!.userId;

  try {
    const oldTicket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { status: true }
    });

    const ticket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status }
    });

    // Log activity
    await (prisma as any).activityLog.create({
      data: {
        action: "STATUS_CHANGED",
        oldValue: oldTicket?.status || "",
        newValue: status,
        details: `Status changed from ${oldTicket?.status} to ${status}`,
        authorId,
        ticketId,
      }
    });

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
}

// ---------------------------
// PATCH /tickets/:id/priority
// ---------------------------
export async function updatePriority(req: AuthRequest, res: Response) {
  const ticketId = Number(req.params.id);
  const { priority } = req.body;
  const authorId = req.user!.userId;

  try {
    const oldTicket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { priority: true }
    });

    const ticket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { priority }
    });

    // Log activity
    await (prisma as any).activityLog.create({
      data: {
        action: "PRIORITY_CHANGED",
        oldValue: oldTicket?.priority || "",
        newValue: priority,
        details: `Priority changed from ${oldTicket?.priority} to ${priority}`,
        authorId,
        ticketId,
      }
    });

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: "Failed to update priority" });
  }
}

// ---------------------------
// POST /tickets/reorder
// ---------------------------
export async function reorderTickets(req: Request, res: Response) {
  const { tickets } = req.body;

  if (!Array.isArray(tickets)) {
    return res.status(400).json({ error: "Tickets array required" });
  }

  try {
    // Update each ticket's order
    await Promise.all(
      tickets.map((t: { id: number; order: number }) =>
        prisma.ticket.update({
          where: { id: t.id },
          data: { order: t.order } as any
        })
      )
    );

    res.json({ success: true });
  } catch (err: any) {
    console.error("Reorder error:", err);
    res.status(500).json({ error: "Failed to reorder tickets" });
  }
}
