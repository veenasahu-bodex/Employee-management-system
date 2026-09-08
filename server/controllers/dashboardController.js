const User = require("../models/User");
const Attendance = require("../models/Attendance");

// ===============================
// DASHBOARD STATS
// ===============================
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Total employees
    const totalEmployees = await User.countDocuments({
      role: "employee",
    });

    // Today's attendance
    const todayAttendance = await Attendance.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const presentToday = todayAttendance.filter(
      (item) => item.status === "Present"
    ).length;

    const lateToday = todayAttendance.filter(
      (item) => item.status === "Late"
    ).length;

    const halfDayToday = todayAttendance.filter(
      (item) => item.status === "Half Day"
    ).length;

    const leaveToday = todayAttendance.filter(
      (item) => item.status === "Leave"
    ).length;

    // Employees who have no attendance today
    const absentToday = Math.max(
      totalEmployees -
        todayAttendance.length,
      0
    );

    // Recent attendance
    const recentAttendance =
      await Attendance.find()
        .populate(
          "employeeId",
          "name employeeId department designation"
        )
        .sort({ date: -1 })
        .limit(10);

    res.status(200).json({
      success: true,

      stats: {
        totalEmployees,
        presentToday,
        absentToday,
        lateToday,
        halfDayToday,
        leaveToday,
      },

      recentAttendance,
    });
  } catch (error) {
    console.error(
      "Dashboard Stats Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch dashboard data.",
    });
  }
};


// ===============================
// MONTHLY ATTENDANCE
// ===============================
const getMonthlyAttendance = async (
  req,
  res
) => {
  try {
    const year =
      Number(req.query.year) ||
      new Date().getFullYear();

    const month =
      Number(req.query.month) ??
      new Date().getMonth();

    const startDate = new Date(
      year,
      month,
      1
    );

    const endDate = new Date(
      year,
      month + 1,
      1
    );

    const attendance =
      await Attendance.find({
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      }).populate(
        "employeeId",
        "name employeeId department"
      );

    const monthlyData = {};

    attendance.forEach((item) => {
      const day = new Date(
        item.date
      ).getDate();

      if (!monthlyData[day]) {
        monthlyData[day] = {
          date: day,
          present: 0,
          late: 0,
          absent: 0,
          halfDay: 0,
          leave: 0,
        };
      }

      if (item.status === "Present") {
        monthlyData[day].present++;
      }

      if (item.status === "Late") {
        monthlyData[day].late++;
      }

      if (item.status === "Absent") {
        monthlyData[day].absent++;
      }

      if (item.status === "Half Day") {
        monthlyData[day].halfDay++;
      }

      if (item.status === "Leave") {
        monthlyData[day].leave++;
      }
    });

    const result = Object.values(
      monthlyData
    ).sort(
      (a, b) => a.date - b.date
    );

    res.status(200).json({
      success: true,
      year,
      month,
      data: result,
    });
  } catch (error) {
    console.error(
      "Monthly Attendance Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch monthly attendance.",
    });
  }
};


module.exports = {
  getDashboardStats,
  getMonthlyAttendance,
};