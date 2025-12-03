import { Router } from "express";
import { stats } from "../controllers/statsController";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.get("/", requireAuth, stats);
export default router;
