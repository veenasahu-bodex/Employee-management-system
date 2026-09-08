const express = require("express");

const {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
} = require("../controllers/attendanceController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Employee check-in
router.post(
  "/check-in",
  protect,
  checkIn
);

// Employee check-out
router.put(
  "/check-out",
  protect,
  checkOut
);

// Employee's own attendance
router.get(
  "/my",
  protect,
  getMyAttendance
);

// Admin: all attendance
router.get(
  "/",
  protect,
  adminOnly,
  getAllAttendance
);

module.exports = router;