const Department = require("../models/Department");

// ========================================
// GET ALL DEPARTMENTS
// ========================================

const getDepartments = async (req, res) => {
  try {
    const departments =
      await Department.find()
        .populate(
          "manager",
          "name email employeeId designation"
        )
        .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: departments.length,
      departments,
    });
  } catch (error) {
    console.error(
      "Get Departments Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch departments.",
    });
  }
};


// ========================================
// GET SINGLE DEPARTMENT
// ========================================

const getDepartment = async (req, res) => {
  try {
    const department =
      await Department.findById(
        req.params.id
      ).populate(
        "manager",
        "name email employeeId designation"
      );

    if (!department) {
      return res.status(404).json({
        success: false,
        message:
          "Department not found.",
      });
    }

    res.status(200).json({
      success: true,
      department,
    });
  } catch (error) {
    console.error(
      "Get Department Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch department.",
    });
  }
};


// ========================================
// CREATE DEPARTMENT
// ========================================

const createDepartment = async (req, res) => {
  try {
    const {
      name,
      description,
      manager,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message:
          "Department name is required.",
      });
    }

    const existingDepartment =
      await Department.findOne({
        name: name.trim(),
      });

    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        message:
          "Department already exists.",
      });
    }

    const department =
      await Department.create({
        name: name.trim(),
        description:
          description || "",
        manager: manager || null,
      });

    const populatedDepartment =
      await Department.findById(
        department._id
      ).populate(
        "manager",
        "name email employeeId designation"
      );

    res.status(201).json({
      success: true,
      message:
        "Department created successfully.",
      department:
        populatedDepartment,
    });
  } catch (error) {
    console.error(
      "Create Department Error:",
      error
    );

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Department already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to create department.",
    });
  }
};


// ========================================
// UPDATE DEPARTMENT
// ========================================

const updateDepartment = async (req, res) => {
  try {
    const {
      name,
      description,
      manager,
    } = req.body;

    const department =
      await Department.findById(
        req.params.id
      );

    if (!department) {
      return res.status(404).json({
        success: false,
        message:
          "Department not found.",
      });
    }

    if (name) {
      const existingDepartment =
        await Department.findOne({
          name: name.trim(),
          _id: {
            $ne: req.params.id,
          },
        });

      if (existingDepartment) {
        return res.status(400).json({
          success: false,
          message:
            "Another department with this name already exists.",
        });
      }

      department.name =
        name.trim();
    }

    if (description !== undefined) {
      department.description =
        description;
    }

    if (manager !== undefined) {
      department.manager =
        manager || null;
    }

    await department.save();

    const updatedDepartment =
      await Department.findById(
        department._id
      ).populate(
        "manager",
        "name email employeeId designation"
      );

    res.status(200).json({
      success: true,
      message:
        "Department updated successfully.",
      department:
        updatedDepartment,
    });
  } catch (error) {
    console.error(
      "Update Department Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update department.",
    });
  }
};


// ========================================
// DELETE DEPARTMENT
// ========================================

const deleteDepartment = async (req, res) => {
  try {
    const department =
      await Department.findByIdAndDelete(
        req.params.id
      );

    if (!department) {
      return res.status(404).json({
        success: false,
        message:
          "Department not found.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Department deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Department Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete department.",
    });
  }
};


module.exports = {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};