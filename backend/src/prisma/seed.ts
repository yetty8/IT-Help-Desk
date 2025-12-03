import prisma from "./client";
import bcrypt from "bcryptjs";

async function main(){
  // ⚠️  WARNING: This is a development seed file
  // In production, remove this file or use secure random passwords
  const defaultPassword = process.env.SEED_PASSWORD || "ChangeMe123!";
  const pass = await bcrypt.hash(defaultPassword, 10);

  await prisma.user.upsert({
    where: { email: "admin@local" },
    update: {},
    create: { email: "admin@local", password: pass, name: "Admin", role: "ADMIN" }
  });

  await prisma.user.upsert({
    where: { email: "tech@local" },
    update: {},
    create: { email: "tech@local", password: pass, name: "Tech", role: "TECH" }
  });
  console.log("Seed done");
}

main().catch(e => { console.error(e); process.exit(1);}).finally(() => prisma.$disconnect());
