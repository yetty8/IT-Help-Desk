import { PrismaClient } from "@prisma/client";

// dotenv should already be loaded in index.ts, but ensure it's loaded here too
if (!process.env.DATABASE_URL) {
  const dotenv = require("dotenv");
  const path = require("path");
  dotenv.config({ path: path.resolve(process.cwd(), ".env") });
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set in environment variables");
  console.error("📋 To fix this:");
  console.error("   1. Go to Railway: https://railway.com/project/ba992519-9d9f-40b5-ac41-0a4bcdc29ba6");
  console.error("   2. Click '+ New' → 'Database' → 'Add PostgreSQL'");
  console.error("   3. Railway will automatically set DATABASE_URL");
  console.error("   4. Redeploy your backend service");
  console.error("📖 See URGENT_ADD_DATABASE.md for detailed instructions");
  throw new Error("DATABASE_URL is not set. Add PostgreSQL database in Railway first!");
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

export default prisma;
