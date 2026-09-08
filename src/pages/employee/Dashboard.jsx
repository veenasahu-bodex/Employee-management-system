import { useEffect, useState } from "react";
import { Clock3, CalendarCheck, CalendarDays, LogIn, LogOut, RefreshCw } from "lucide-react";
import api from "../../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [time, setTime] = useState(new Date());

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [profileData, attendanceData, leavesData] = await Promise.all([
        api.getMyProfile(),
        api.getMyAttendance(),
        api.getMyLeaves(),
      ]);

      setProfile(profileData.user || profileData);
      setAttendance(attendanceData.attendance || attendanceData || []);
      setLeaves(leavesData.leaves || leavesData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const todayRecord = attendance.find(
    (item) => new Date(item.date).toISOString().split("T")[0] === today
  );

  const presentDays = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const lateDays = attendance.filter(
    (item) => item.status === "Late"
  ).length;

  const leaveDays = leaves.filter(
    (item) => item.status === "Approved"
  ).length;

  const totalWorkingHours = attendance.reduce(
    (total, item) => total + Number(item.workingHours || 0),
    0
  );

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      await api.checkIn();
      await loadDashboard();
      alert("Check-in successful.");
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      await api.checkOut();
      await loadDashboard();
      alert("Check-out successful.");
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (value) => {
    if (!value) return "--:--";
    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (value) => {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="employee-dashboard-loading">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="employee-dashboard">
      <div className="employee-dashboard-header">
        <div>
          <h1>Welcome, {profile?.name || "Employee"} 👋</h1>
          <p>
            {profile?.designation || "Employee"} •{" "}
            {profile?.department || "Department"}
          </p>
        </div>

        <button
          className="employee-refresh-btn"
          onClick={loadDashboard}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="employee-dashboard-error">
          {error}
        </div>
      )}

      <div className="employee-today-card">
        <div className="today-info">
          <div className="today-icon">
            <Clock3 size={26} />
          </div>

          <div>
            <span>Current Time</span>
            <strong>
              {time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </strong>
            <small>
              {time.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </small>
          </div>
        </div>

        <div className="today-actions">
          {!todayRecord?.checkIn && (
            <button
              className="checkin-btn"
              onClick={handleCheckIn}
              disabled={actionLoading}
            >
              <LogIn size={18} />
              {actionLoading ? "Processing..." : "Check In"}
            </button>
          )}

          {todayRecord?.checkIn && !todayRecord?.checkOut && (
            <button
              className="checkout-btn"
              onClick={handleCheckOut}
              disabled={actionLoading}
            >
              <LogOut size={18} />
              {actionLoading ? "Processing..." : "Check Out"}
            </button>
          )}

          {todayRecord?.checkIn && todayRecord?.checkOut && (
            <div className="completed-badge">
              Attendance Completed
            </div>
          )}
        </div>
      </div>

      <div className="today-attendance-card">
        <div className="section-title">
          <div>
            <h2>Today's Attendance</h2>
            <p>Your attendance for today</p>
          </div>

          <span
            className={`attendance-status ${
              todayRecord?.status?.toLowerCase().replace(" ", "-") ||
              "absent"
            }`}
          >
            {todayRecord?.status || "Not Marked"}
          </span>
        </div>

        <div className="attendance-details">
          <div>
            <span>Check In</span>
            <strong>
              {formatTime(todayRecord?.checkIn)}
            </strong>
          </div>

          <div>
            <span>Check Out</span>
            <strong>
              {formatTime(todayRecord?.checkOut)}
            </strong>
          </div>

          <div>
            <span>Working Hours</span>
            <strong>
              {todayRecord?.workingHours
                ? `${todayRecord.workingHours} hrs`
                : "0 hrs"}
            </strong>
          </div>

          <div>
            <span>Remarks</span>
            <strong>
              {todayRecord?.remarks || "No remarks"}
            </strong>
          </div>
        </div>
      </div>

      <div className="employee-stats-grid">
        <div className="employee-stat-card">
          <div className="stat-icon">
            <CalendarCheck size={22} />
          </div>
          <div>
            <span>Present Days</span>
            <strong>{presentDays}</strong>
          </div>
        </div>

        <div className="employee-stat-card">
          <div className="stat-icon">
            <Clock3 size={22} />
          </div>
          <div>
            <span>Late Days</span>
            <strong>{lateDays}</strong>
          </div>
        </div>

        <div className="employee-stat-card">
          <div className="stat-icon">
            <CalendarDays size={22} />
          </div>
          <div>
            <span>Approved Leaves</span>
            <strong>{leaveDays}</strong>
          </div>
        </div>

        <div className="employee-stat-card">
          <div className="stat-icon">
            <Clock3 size={22} />
          </div>
          <div>
            <span>Working Hours</span>
            <strong>{totalWorkingHours.toFixed(1)}h</strong>
          </div>
        </div>
      </div>

      <div className="employee-dashboard-grid">
        <div className="dashboard-section-card">
          <div className="section-title">
            <div>
              <h2>Recent Attendance</h2>
              <p>Your latest attendance records</p>
            </div>
          </div>

          {attendance.length === 0 ? (
            <div className="dashboard-empty">
              No attendance records found.
            </div>
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
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
                  {attendance.slice(0, 5).map((item) => (
                    <tr key={item._id}>
                      <td>{formatDate(item.date)}</td>
                      <td>{formatTime(item.checkIn)}</td>
                      <td>{formatTime(item.checkOut)}</td>
                      <td>
                        {item.workingHours
                          ? `${item.workingHours}h`
                          : "-"}
                      </td>
                      <td>
                        <span
                          className={`table-status ${item.status
                            ?.toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="dashboard-section-card">
          <div className="section-title">
            <div>
              <h2>Recent Leaves</h2>
              <p>Your latest leave requests</p>
            </div>
          </div>

          {leaves.length === 0 ? (
            <div className="dashboard-empty">
              No leave requests found.
            </div>
          ) : (
            <div className="leave-list">
              {leaves.slice(0, 5).map((leave) => (
                <div className="leave-item" key={leave._id}>
                  <div>
                    <strong>{leave.leaveType}</strong>
                    <span>
                      {formatDate(leave.startDate)} -{" "}
                      {formatDate(leave.endDate)}
                    </span>
                  </div>

                  <span
                    className={`table-status ${leave.status.toLowerCase()}`}
                  >
                    {leave.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;