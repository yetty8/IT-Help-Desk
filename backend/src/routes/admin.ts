import express from "express";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/roles";
import * as adminCtrl from "../controllers/adminController";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/users", adminCtrl.listUsers);
router.post("/users", adminCtrl.createUser);
router.patch("/users/:id", adminCtrl.updateUser);
router.delete("/users/:id", adminCtrl.deleteUser);

export default router;
