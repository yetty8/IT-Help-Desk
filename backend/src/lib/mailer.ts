// src/lib/mailer.ts
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
});

export async function sendMail({ to, subject, text, html }: { to: string; subject: string; text?: string; html?: string }) {
  if (!process.env.SMTP_HOST) {
    console.log("Mailer not configured - skipping sending mail:", subject, "to", to);
    return;
  }
  return transport.sendMail({ from: process.env.SMTP_FROM || "no-reply@helpdesk.local", to, subject, text, html });
}
