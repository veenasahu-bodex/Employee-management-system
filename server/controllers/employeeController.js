const User = require("../models/User");
const bcrypt = require("bcryptjs");

// =====================================
// GET ALL EMPLOYEES
// Admin Only
// =====================================

const getEmployees = async (req, res) => {
  try {
    const employees = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error("Get Employees Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch employees.",
    });
  }
};


// =====================================
// GET SINGLE EMPLOYEE
// Admin Only
// =====================================

const getEmployee = async (req, res) => {
  try {
    const employee = await User.findById(
      req.params.id
    ).select("-password");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error("Get Employee Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch employee.",
    });
  }
};


// =====================================
// GET MY PROFILE
// Logged-in User
// =====================================

const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      employee: user,
    });
  } catch (error) {
    console.error("Get My Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile.",
    });
  }
};


// =====================================
// CREATE EMPLOYEE
// Admin Only
// =====================================

const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      employeeId,
      phone,
      department,
      designation,
      joiningDate,
      role,
    } = req.body;

    // Required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required.",
      });
    }

    // Check email
    const existingEmail = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Create employee
    const employee = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      employeeId:
        employeeId || undefined,
      phone: phone || "",
      department: department || "",
      designation: designation || "",
      joiningDate:
        joiningDate || undefined,
      role: role || "employee",
    });

    res.status(201).json({
      success: true,
      message:
        "Employee created successfully.",
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        employeeId:
          employee.employeeId,
        phone: employee.phone,
        department:
          employee.department,
        designation:
          employee.designation,
        joiningDate:
          employee.joiningDate,
        role: employee.role,
        status: employee.status,
      },
    });
  } catch (error) {
    console.error(
      "Create Employee Error:",
      error
    );

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Employee ID or email already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to create employee.",
    });
  }
};


// =====================================
// DELETE EMPLOYEE
// Admin Only
// =====================================

const deleteEmployee = async (req, res) => {
  try {
    const employee =
      await User.findByIdAndDelete(
        req.params.id
      );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Employee deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Employee Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete employee.",
    });
  }
};


// =====================================
// EXPORT
// =====================================

module.exports = {
  getEmployees,
  getEmployee,
  getMyProfile,
  createEmployee,
  deleteEmployee,
};