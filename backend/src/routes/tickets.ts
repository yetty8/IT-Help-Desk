import express from "express";
import multer from "multer";
import path from "path";
import { requireAuth } from "../middleware/auth";
import * as ctrl from "../controllers/ticketsController";

const router = express.Router();

// multer
const storage = multer.diskStorage({
  destination: path.join(process.cwd(), "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// routes
router.get("/", requireAuth, ctrl.listTickets);
router.post("/", requireAuth, upload.single("file"), ctrl.createTicket);
router.get("/:id", requireAuth, ctrl.getTicket);
router.post("/:id/comments", requireAuth, ctrl.addComment);
router.post("/:id/assign", requireAuth, ctrl.assignTicket);
router.post("/:id/status", requireAuth, ctrl.updateStatus);
router.patch("/:id/priority", requireAuth, ctrl.updatePriority);

export default router;
