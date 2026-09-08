import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  Search,
  RefreshCw,
  Clock3,
  CheckCircle2,
  XCircle,
  CalendarDays,
} from "lucide-react";
import api from "../../services/api";
import "./AttendanceHistory.css";

const AttendanceHistory = () => {
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [period, setPeriod] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadAttendance = async () => {
    try {
      setError("");
      const response = await api.getMyAttendance();
      setAttendance(response.attendance || []);
    } catch (err) {
      console.error("Attendance History Error:", err);
      setError(err.message || "Failed to load attendance history.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAttendance();
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredAttendance = useMemo(() => {
    const now = new Date();

    return attendance.filter((item) => {
      const itemDate = new Date(item.date);

      const matchesSearch =
        search.trim() === "" ||
        item.status?.toLowerCase().includes(search.toLowerCase()) ||
        formatDate(item.date).toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      let matchesPeriod = true;

      if (period !== "All") {
        const days = Number(period);
        const startDate = new Date(now);
        startDate.setDate(now.getDate() - days);
        startDate.setHours(0, 0, 0, 0);
        matchesPeriod = itemDate >= startDate;
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPeriod
      );
    });
  }, [attendance, search, statusFilter, period]);

  const presentCount = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const lateCount = attendance.filter(
    (item) => item.status === "Late"
  ).length;

  const halfDayCount = attendance.filter(
    (item) => item.status === "Half Day"
  ).length;

  const totalHours = attendance.reduce(
    (total, item) => total + (Number(item.workingHours) || 0),
    0
  );

  const getStatusClass = (status) =>
    status?.toLowerCase().replace(/\s+/g, "-") || "";

  const getStatusIcon = (status) => {
    if (status === "Present") return <CheckCircle2 size={14} />;
    if (status === "Late") return <Clock3 size={14} />;
    if (status === "Leave") return <CalendarDays size={14} />;
    return <XCircle size={14} />;
  };

  if (loading) {
    return (
      <div className="attendance-history-page">
        <div className="attendance-history-loading">
          <div className="attendance-history-spinner"></div>
          <p>Loading attendance history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="attendance-history-page">
      <div className="attendance-history-header">
        <div>
          <h1>Attendance History</h1>
          <p>View and track your complete attendance record.</p>
        </div>

        <button
          className="attendance-history-refresh"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            size={17}
            className={refreshing ? "attendance-spin" : ""}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="attendance-history-error">
          <XCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="attendance-history-summary">
        <div className="attendance-history-card">
          <div className="attendance-history-icon total">
            <CalendarCheck size={20} />
          </div>
          <div>
            <span>Total Records</span>
            <h2>{attendance.length}</h2>
          </div>
        </div>

        <div className="attendance-history-card">
          <div className="attendance-history-icon present">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span>Present</span>
            <h2>{presentCount}</h2>
          </div>
        </div>

        <div className="attendance-history-card">
          <div className="attendance-history-icon late">
            <Clock3 size={20} />
          </div>
          <div>
            <span>Late</span>
            <h2>{lateCount}</h2>
          </div>
        </div>

        <div className="attendance-history-card">
          <div className="attendance-history-icon hours">
            <Clock3 size={20} />
          </div>
          <div>
            <span>Total Hours</span>
            <h2>{totalHours.toFixed(1)}h</h2>
          </div>
        </div>
      </div>

      <div className="attendance-history-panel">
        <div className="attendance-history-filters">
          <div className="attendance-history-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search attendance..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Half Day">Half Day</option>
            <option value="Leave">Leave</option>
            <option value="Absent">Absent</option>
          </select>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="All">All Time</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>

        <div className="attendance-history-table-wrapper">
          {filteredAttendance.length === 0 ? (
            <div className="attendance-history-empty">
              <CalendarCheck size={40} />
              <h3>No attendance records found</h3>
              <p>Try changing your search or filters.</p>
            </div>
          ) : (
            <table className="attendance-history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Working Hours</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>

              <tbody>
                {filteredAttendance.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <strong>{formatDate(item.date)}</strong>
                    </td>

                    <td>{formatTime(item.checkIn)}</td>

                    <td>{formatTime(item.checkOut)}</td>

                    <td>
                      {item.workingHours
                        ? `${Number(item.workingHours).toFixed(2)} hrs`
                        : "-"}
                    </td>

                    <td>
                      <span
                        className={`attendance-history-status ${getStatusClass(
                          item.status
                        )}`}
                      >
                        {getStatusIcon(item.status)}
                        {item.status}
                      </span>
                    </td>

                    <td>
                      <span className="attendance-history-remarks">
                        {item.remarks || "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="attendance-history-footer">
          Showing {filteredAttendance.length} of {attendance.length} records
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;