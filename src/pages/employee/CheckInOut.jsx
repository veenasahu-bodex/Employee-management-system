import { useEffect, useState } from "react";
import {
  Clock3,
  CalendarDays,
  LogIn,
  LogOut,
  RefreshCw,
  CheckCircle2,
  Timer,
  AlertCircle,
} from "lucide-react";
import api from "../../services/api";
import "./CheckInOut.css";

const CheckInOut = () => {
  const [attendance, setAttendance] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadTodayAttendance = async () => {
    try {
      setError("");
      const response = await api.getMyAttendance();
      const records = response.attendance || [];
      const today = new Date().toDateString();

      const todayRecord = records.find(
        (item) => new Date(item.date).toDateString() === today
      );

      setAttendance(todayRecord || null);
    } catch (err) {
      console.error("Attendance Error:", err);
      setError(err.message || "Failed to load attendance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodayAttendance();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const response = await api.checkIn();

      setMessage(response.message || "Check-in successful.");
      await loadTodayAttendance();
    } catch (err) {
      setError(err.message || "Check-in failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const response = await api.checkOut();

      setMessage(response.message || "Check-out successful.");
      await loadTodayAttendance();
    } catch (err) {
      setError(err.message || "Check-out failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await loadTodayAttendance();
  };

  const formatTime = (date) => {
    if (!date) return "--:--";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    if (status === "Present") return "present";
    if (status === "Late") return "late";
    if (status === "Half Day") return "half-day";
    return "default";
  };

  if (loading) {
    return (
      <div className="check-in-out-page">
        <div className="check-in-out-loading">
          <div className="check-in-out-spinner"></div>
          <p>Loading today's attendance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="check-in-out-page">
      <div className="check-in-out-header">
        <div>
          <h1>Check In / Check Out</h1>
          <p>Manage your attendance for today.</p>
        </div>

        <button
          className="check-in-out-refresh"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {message && (
        <div className="check-in-out-message">
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="check-in-out-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="check-in-out-grid">
        <div className="check-in-out-clock-card">
          <div className="check-in-out-clock-icon">
            <Clock3 size={28} />
          </div>

          <div className="check-in-out-time">
            {formatTime(currentTime)}
          </div>

          <div className="check-in-out-date">
            <CalendarDays size={16} />
            {formatDate(currentTime)}
          </div>
        </div>

        <div className="check-in-out-status-card">
          <div className="check-in-out-section-title">
            <Timer size={19} />
            <h3>Today's Attendance</h3>
          </div>

          <div className="check-in-out-details">
            <div>
              <span>Check In</span>
              <strong>
                {attendance?.checkIn
                  ? formatTime(attendance.checkIn)
                  : "--:--"}
              </strong>
            </div>

            <div>
              <span>Check Out</span>
              <strong>
                {attendance?.checkOut
                  ? formatTime(attendance.checkOut)
                  : "--:--"}
              </strong>
            </div>

            <div>
              <span>Working Hours</span>
              <strong>
                {attendance?.workingHours
                  ? `${Number(attendance.workingHours).toFixed(2)} hrs`
                  : "--"}
              </strong>
            </div>

            <div>
              <span>Status</span>
              {attendance?.status ? (
                <strong
                  className={`check-in-out-status ${getStatusClass(
                    attendance.status
                  )}`}
                >
                  {attendance.status}
                </strong>
              ) : (
                <strong className="check-in-out-not-marked">
                  Not Marked
                </strong>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="check-in-out-action-card">
        <div>
          <h2>Attendance Action</h2>
          <p>
            {attendance?.checkIn
              ? attendance?.checkOut
                ? "Your attendance for today is complete."
                : "You are checked in. Don't forget to check out."
              : "You have not checked in yet today."}
          </p>
        </div>

        <div className="check-in-out-actions">
          <button
            className="check-in-button"
            onClick={handleCheckIn}
            disabled={actionLoading || Boolean(attendance?.checkIn)}
          >
            <LogIn size={18} />
            {actionLoading ? "Processing..." : "Check In"}
          </button>

          <button
            className="check-out-button"
            onClick={handleCheckOut}
            disabled={
              actionLoading ||
              !attendance?.checkIn ||
              Boolean(attendance?.checkOut)
            }
          >
            <LogOut size={18} />
            {actionLoading ? "Processing..." : "Check Out"}
          </button>
        </div>
      </div>

      <div className="check-in-out-info">
        <Clock3 size={18} />
        <div>
          <strong>Attendance Rules</strong>
          <p>
            Check-in before 9:00 AM is marked Present. Check-in after
            9:00 AM is marked Late. Working hours below 4 hours are
            marked as Half Day.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckInOut;