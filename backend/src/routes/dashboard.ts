import express from "express";
import { requireAuth } from "../middleware/auth";
import * as ctrl from "../controllers/dashboardController";
const router = express.Router();
router.get("/stats", requireAuth, ctrl.stats);
export default router;
