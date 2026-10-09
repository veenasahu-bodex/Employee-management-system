const express = require("express");

const {
  getEmployees,
  getEmployee,
  getMyProfile,
  createEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();


// Logged-in user's own profile
router.get(
  "/me",
  protect,
  getMyProfile
);


// Admin: get all employees
router.get(
  "/",
  protect,
  adminOnly,
  getEmployees
);


// Admin: get single employee
router.get(
  "/:id",
  protect,
  adminOnly,
  getEmployee
);


// Admin: create employee
router.post(
  "/",
  protect,
  adminOnly,
  createEmployee
);


// Admin: delete employee
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteEmployee
);


module.exports = router;
