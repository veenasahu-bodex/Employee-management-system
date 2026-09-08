const Attendance = require("../models/Attendance");
const User = require("../models/User");

// CHECK IN
const checkIn = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "You have already checked in today.",
      });
    }

    const now = new Date();

    // 10:00 AM
    const officeStart = new Date(now);
    officeStart.setHours(10, 0, 0, 0);

    const status =
      now <= officeStart ? "Present" : "Late";

    const attendance = await Attendance.create({
      employeeId,
      date: today,
      checkIn: now,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Check-in successful.",
      attendance,
    });
  } catch (error) {
    console.error("Check In Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to check in.",
    });
  }
};


// CHECK OUT
const checkOut = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const attendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Please check in first.",
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: "You have already checked out.",
      });
    }

    const now = new Date();

    const workingMilliseconds =
      now - attendance.checkIn;

    const workingHours =
      workingMilliseconds / (1000 * 60 * 60);

    attendance.checkOut = now;
    attendance.workingHours =
      Number(workingHours.toFixed(2));

    if (workingHours < 4) {
      attendance.status = "Half Day";
    }

    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Check-out successful.",
      attendance,
    });
  } catch (error) {
    console.error("Check Out Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to check out.",
    });
  }
};


// GET MY ATTENDANCE
const getMyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      employeeId: req.user.id,
    })
      .populate(
        "employeeId",
        "name employeeId department designation"
      )
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    console.error("Get My Attendance Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance.",
    });
  }
};


// GET ALL ATTENDANCE - ADMIN
const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate(
        "employeeId",
        "name employeeId department designation"
      )
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    console.error("Get All Attendance Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance.",
    });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
};