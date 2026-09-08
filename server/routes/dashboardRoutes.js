const express = require("express");

const {
  getDashboardStats,
  getMonthlyAttendance,
} = require("../controllers/dashboardController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/stats",
  protect,
  adminOnly,
  getDashboardStats
);

router.get(
  "/monthly",
  protect,
  adminOnly,
  getMonthlyAttendance
);

module.exports = router;