const express = require("express");
const router = express.Router();

const {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, adminOnly, getDepartments);
router.get("/:id", protect, adminOnly, getDepartment);
router.post("/", protect, adminOnly, createDepartment);
router.put("/:id", protect, adminOnly, updateDepartment);
router.delete("/:id", protect, adminOnly, deleteDepartment);

module.exports = router;