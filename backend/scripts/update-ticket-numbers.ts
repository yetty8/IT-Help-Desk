import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateTicketNumbers() {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { id: "asc" },
      select: { id: true }
    });

    for (let i = 0; i < tickets.length; i++) {
      const ticketNumber = `IT-${1001 + i}`;
      await prisma.ticket.update({
        where: { id: tickets[i].id },
        data: { ticketNumber } as any
      });
      console.log(`Updated ticket ${tickets[i].id} to ${ticketNumber}`);
    }

    console.log("All tickets updated successfully!");
  } catch (error) {
    console.error("Error updating tickets:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateTicketNumbers();

