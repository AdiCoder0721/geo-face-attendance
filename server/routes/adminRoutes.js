import express from "express";
import { todaysAttendance } from "../controllers/attendanceController.js";
import { verifyToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET /api/admin/attendance/today
router.get(
  "/attendance/today",
  verifyToken,
  requireAdmin,
  todaysAttendance
);

export default router;
