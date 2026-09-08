const express = require("express");

const {
  getAllLeaves,
  getMyLeaves,
  createLeave,
  approveLeave,
  rejectLeave,
} = require("../controllers/leaveController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/my",
  protect,
  getMyLeaves
);

router.post(
  "/",
  protect,
  createLeave
);

router.get(
  "/",
  protect,
  adminOnly,
  getAllLeaves
);

router.put(
  "/:id/approve",
  protect,
  adminOnly,
  approveLeave
);

router.put(
  "/:id/reject",
  protect,
  adminOnly,
  rejectLeave
);

module.exports = router;