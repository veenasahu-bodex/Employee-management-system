import { useEffect, useState } from "react";

import {
  UserCheck,
  Clock,
  CalendarDays,
  ClipboardCheck,
  LogIn,
  LogOut,
  RefreshCw,
} from "lucide-react";

import api from "../../services/api";

import "./Dashboard.css";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);

  const [attendance, setAttendance] =
    useState([]);

  const [leaves, setLeaves] =
    useState([]);

  const [todayAttendance, setTodayAttendance] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] =
    useState("");

  // ========================================
  // LOAD DASHBOARD DATA
  // ========================================

  const loadDashboard = async () => {
    try {
      setError("");
      setMessage("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const [
        profileResponse,
        attendanceResponse,
        leavesResponse,
      ] = await Promise.all([
        api.getMyProfile(token),
        api.getMyAttendance(token),
        api.getMyLeaves(token),
      ]);

      const employee =
        profileResponse.employee || null;

      const attendanceData =
        attendanceResponse.attendance || [];

      const leavesData =
        leavesResponse.leaves || [];

      setProfile(employee);
      setAttendance(attendanceData);
      setLeaves(leavesData);

      // Find today's attendance
      const today = new Date();

      const todayRecord =
        attendanceData.find((item) => {
          if (!item.date) return false;

          const recordDate =
            new Date(item.date);

          return (
            recordDate.getDate() ===
              today.getDate() &&
            recordDate.getMonth() ===
              today.getMonth() &&
            recordDate.getFullYear() ===
              today.getFullYear()
          );
        });

      setTodayAttendance(
        todayRecord || null
      );
    } catch (err) {
      console.error(
        "Employee Dashboard Error:",
        err
      );

      setError(
        err.message ||
          "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // ========================================
  // REFRESH
  // ========================================

  const handleRefresh = async () => {
    setRefreshing(true);

    await loadDashboard();
  };

  // ========================================
  // CHECK IN
  // ========================================

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const token =
        localStorage.getItem("token");

      const response =
        await api.checkIn(token);

      setMessage(
        response.message ||
          "Check-in successful."
      );

      await loadDashboard();
    } catch (err) {
      console.error(
        "Check In Error:",
        err
      );

      setError(
        err.message ||
          "Failed to check in."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ========================================
  // CHECK OUT
  // ========================================

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const token =
        localStorage.getItem("token");

      const response =
        await api.checkOut(token);

      setMessage(
        response.message ||
          "Check-out successful."
      );

      await loadDashboard();
    } catch (err) {
      console.error(
        "Check Out Error:",
        err
      );

      setError(
        err.message ||
          "Failed to check out."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ========================================
  // FORMAT TIME
  // ========================================

  const formatTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ========================================
  // ATTENDANCE STATS
  // ========================================

  const presentCount =
    attendance.filter(
      (item) =>
        item.status === "Present"
    ).length;

  const lateCount =
    attendance.filter(
      (item) =>
        item.status === "Late"
    ).length;

  const halfDayCount =
    attendance.filter(
      (item) =>
        item.status === "Half Day"
    ).length;

  const approvedLeaves =
    leaves.filter(
      (item) =>
        item.status === "Approved"
    ).length;

  const pendingLeaves =
    leaves.filter(
      (item) =>
        item.status === "Pending"
    ).length;

  const recentAttendance =
    attendance.slice(0, 5);

  const recentLeaves =
    leaves.slice(0, 4);

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="employee-dashboard-page">
        <div className="employee-dashboard-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading dashboard...
          </p>

        </div>
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="employee-dashboard-page">

      {/* HEADER */}

      <div className="employee-dashboard-header">

        <div>
          <h1>
            Welcome back,{" "}
            {profile?.name || "Employee"}!
          </h1>

          <p>
            Here's your attendance
            overview for today.
          </p>
        </div>

        <button
          className="employee-dashboard-refresh"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            size={18}
            className={
              refreshing
                ? "refresh-icon spinning"
                : "refresh-icon"
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>

      {/* MESSAGE */}

      {message && (
        <div className="employee-success">
          {message}
        </div>
      )}

      {/* ERROR */}

      {error && (
        <div className="employee-error">
          {error}
        </div>
      )}

      {/* TODAY ATTENDANCE */}

      <div className="employee-today-card">

        <div className="today-card-info">

          <div className="today-icon">
            <ClipboardCheck
              size={25}
            />
          </div>

          <div>
            <h2>
              Today's Attendance
            </h2>

            <p>
              {formatDate(new Date())}
            </p>
          </div>

        </div>

        <div className="today-attendance-details">

          <div className="time-detail">

            <span>
              <LogIn size={15} />
              Check In
            </span>

            <strong>
              {formatTime(
                todayAttendance?.checkIn
              )}
            </strong>

          </div>

          <div className="time-detail">

            <span>
              <LogOut size={15} />
              Check Out
            </span>

            <strong>
              {formatTime(
                todayAttendance?.checkOut
              )}
            </strong>

          </div>

          <div className="time-detail">

            <span>
              <Clock size={15} />
              Working Hours
            </span>

            <strong>
              {todayAttendance?.workingHours
                ? `${todayAttendance.workingHours} hrs`
                : "-"}
            </strong>

          </div>

          <div className="today-action">

            {!todayAttendance ? (
              <button
                className="check-in-button"
                onClick={handleCheckIn}
                disabled={actionLoading}
              >
                <LogIn size={18} />

                {actionLoading
                  ? "Processing..."
                  : "Check In"}
              </button>
            ) : !todayAttendance.checkOut ? (
              <button
                className="check-out-button"
                onClick={handleCheckOut}
                disabled={actionLoading}
              >
                <LogOut size={18} />

                {actionLoading
                  ? "Processing..."
                  : "Check Out"}
              </button>
            ) : (
              <span
                className={`today-status ${
                  todayAttendance.status
                    ?.toLowerCase()
                    .replace(
                      " ",
                      "-"
                    )
                }`}
              >
                {todayAttendance.status}
              </span>
            )}

          </div>

        </div>

      </div>

      {/* STATS */}

      <div className="employee-stats">

        <div className="employee-stat-card">

          <div className="employee-stat-icon">
            <UserCheck size={21} />
          </div>

          <div>
            <span>
              Present Days
            </span>

            <h2>
              {presentCount}
            </h2>
          </div>

        </div>

        <div className="employee-stat-card">

          <div className="employee-stat-icon">
            <Clock size={21} />
          </div>

          <div>
            <span>
              Late Days
            </span>

            <h2>
              {lateCount}
            </h2>
          </div>

        </div>

        <div className="employee-stat-card">

          <div className="employee-stat-icon">
            <CalendarDays
              size={21}
            />
          </div>

          <div>
            <span>
              Approved Leaves
            </span>

            <h2>
              {approvedLeaves}
            </h2>
          </div>

        </div>

        <div className="employee-stat-card">

          <div className="employee-stat-icon">
            <ClipboardCheck
              size={21}
            />
          </div>

          <div>
            <span>
              Pending Leaves
            </span>

            <h2>
              {pendingLeaves}
            </h2>
          </div>

        </div>

      </div>

      {/* CONTENT GRID */}

      <div className="employee-dashboard-grid">

        {/* RECENT ATTENDANCE */}

        <div className="employee-dashboard-card">

          <div className="employee-card-header">

            <div>
              <h2>
                Recent Attendance
              </h2>

              <p>
                Your latest attendance
                records.
              </p>
            </div>

          </div>

          {recentAttendance.length ===
          0 ? (
            <div className="employee-empty">
              No attendance records
              available.
            </div>
          ) : (
            <div className="employee-table-wrapper">

              <table className="employee-table">

                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentAttendance.map(
                    (item) => (
                      <tr
                        key={item._id}
                      >

                        <td>
                          {formatDate(
                            item.date
                          )}
                        </td>

                        <td>
                          {formatTime(
                            item.checkIn
                          )}
                        </td>

                        <td>
                          {formatTime(
                            item.checkOut
                          )}
                        </td>

                        <td>
                          {item.workingHours
                            ? `${item.workingHours} hrs`
                            : "-"}
                        </td>

                        <td>
                          <span
                            className={`attendance-badge ${
                              item.status
                                ?.toLowerCase()
                                .replace(
                                  " ",
                                  "-"
                                )
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                      </tr>
                    )
                  )}
                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* LEAVE SUMMARY */}

        <div className="employee-dashboard-card">

          <div className="employee-card-header">

            <div>
              <h2>
                Recent Leaves
              </h2>

              <p>
                Your latest leave
                requests.
              </p>
            </div>

          </div>

          {recentLeaves.length ===
          0 ? (
            <div className="employee-empty">
              No leave requests
              available.
            </div>
          ) : (
            <div className="employee-leaves-list">

              {recentLeaves.map(
                (leave) => (
                  <div
                    className="employee-leave-item"
                    key={leave._id}
                  >

                    <div className="leave-item-icon">
                      <CalendarDays
                        size={19}
                      />
                    </div>

                    <div className="leave-item-content">

                      <strong>
                        {leave.leaveType}
                      </strong>

                      <span>
                        {formatDate(
                          leave.startDate
                        )}{" "}
                        -{" "}
                        {formatDate(
                          leave.endDate
                        )}
                      </span>

                    </div>

                    <span
                      className={`leave-status ${
                        leave.status
                          ?.toLowerCase()
                      }`}
                    >
                      {leave.status}
                    </span>

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </div>

      {/* PROFILE CARD */}

      <div className="employee-profile-card">

        <div className="employee-profile-avatar">

          {profile?.profileImage ? (
            <img
              src={
                profile.profileImage
              }
              alt={profile.name}
            />
          ) : (
            profile?.name
              ?.charAt(0)
              ?.toUpperCase() || "U"
          )}

        </div>

        <div className="employee-profile-info">

          <h2>
            {profile?.name ||
              "Employee"}
          </h2>

          <p>
            {profile?.designation ||
              "Employee"}
          </p>

          <span>
            {profile?.department ||
              "Department not assigned"}
          </span>

        </div>

        <div className="employee-profile-id">

          <span>
            Employee ID
          </span>

          <strong>
            {profile?.employeeId ||
              "Not assigned"}
          </strong>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;