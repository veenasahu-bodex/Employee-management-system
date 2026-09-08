const Leave = require("../models/Leave");

// GET ALL LEAVES - ADMIN
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate(
        "employeeId",
        "name employeeId department designation"
      )
      .populate(
        "approvedBy",
        "name email"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    console.error(
      "Get All Leaves Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch leaves.",
    });
  }
};


// GET MY LEAVES - EMPLOYEE
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({
      employeeId: req.user.id,
    })
      .populate(
        "employeeId",
        "name employeeId department designation"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    console.error(
      "Get My Leaves Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch your leaves.",
    });
  }
};


// CREATE LEAVE REQUEST
const createLeave = async (req, res) => {
  try {
    const {
      leaveType,
      startDate,
      endDate,
      reason,
    } = req.body;

    if (
      !leaveType ||
      !startDate ||
      !endDate ||
      !reason
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Leave type, dates and reason are required.",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return res.status(400).json({
        success: false,
        message:
          "End date cannot be before start date.",
      });
    }

    const leave = await Leave.create({
      employeeId: req.user.id,
      leaveType,
      startDate: start,
      endDate: end,
      reason,
    });

    const populatedLeave =
      await Leave.findById(leave._id)
        .populate(
          "employeeId",
          "name employeeId department designation"
        );

    res.status(201).json({
      success: true,
      message:
        "Leave request submitted successfully.",
      leave: populatedLeave,
    });
  } catch (error) {
    console.error(
      "Create Leave Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to submit leave request.",
    });
  }
};


// APPROVE LEAVE
const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(
      req.params.id
    );

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found.",
      });
    }

    if (leave.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message:
          "This leave request has already been processed.",
      });
    }

    leave.status = "Approved";
    leave.approvedBy = req.user.id;

    await leave.save();

    const updatedLeave =
      await Leave.findById(leave._id)
        .populate(
          "employeeId",
          "name employeeId department designation"
        )
        .populate(
          "approvedBy",
          "name email"
        );

    res.status(200).json({
      success: true,
      message:
        "Leave request approved successfully.",
      leave: updatedLeave,
    });
  } catch (error) {
    console.error(
      "Approve Leave Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to approve leave.",
    });
  }
};


// REJECT LEAVE
const rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(
      req.params.id
    );

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found.",
      });
    }

    if (leave.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message:
          "This leave request has already been processed.",
      });
    }

    leave.status = "Rejected";
    leave.approvedBy = req.user.id;

    await leave.save();

    const updatedLeave =
      await Leave.findById(leave._id)
        .populate(
          "employeeId",
          "name employeeId department designation"
        )
        .populate(
          "approvedBy",
          "name email"
        );

    res.status(200).json({
      success: true,
      message:
        "Leave request rejected successfully.",
      leave: updatedLeave,
    });
  } catch (error) {
    console.error(
      "Reject Leave Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to reject leave.",
    });
  }
};


module.exports = {
  getAllLeaves,
  getMyLeaves,
  createLeave,
  approveLeave,
  rejectLeave,
};