import { useEffect, useMemo, useState } from "react";

import {
  CalendarCheck,
  Clock,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

import api from "../../services/api";

import "./MyAttendance.css";

const MyAttendance = () => {
  const [attendance, setAttendance] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [dateFilter, setDateFilter] =
    useState("All");

  // ========================================
  // FETCH ATTENDANCE
  // ========================================

  const loadAttendance = async () => {
    try {
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const response =
        await api.getMyAttendance(token);

      setAttendance(
        response.attendance || []
      );
    } catch (err) {
      console.error(
        "My Attendance Error:",
        err
      );

      setError(
        err.message ||
          "Failed to fetch attendance."
      );
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

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

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


  const isDateInRange = (date) => {
    if (dateFilter === "All") {
      return true;
    }

    const recordDate = new Date(date);
    const today = new Date();

    recordDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const difference =
      Math.floor(
        (today - recordDate) /
          (1000 * 60 * 60 * 24)
      );

    if (dateFilter === "7") {
      return difference <= 7;
    }

    if (dateFilter === "30") {
      return difference <= 30;
    }

    if (dateFilter === "90") {
      return difference <= 90;
    }

    return true;
  };

  const filteredAttendance = useMemo(() => {
    return attendance.filter((item) => {
      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        formatDate(item.date)
          .toLowerCase()
          .includes(searchText) ||
        item.status
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      const matchesDate =
        isDateInRange(item.date);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [
    attendance,
    search,
    statusFilter,
    dateFilter,
  ]);


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

  const leaveCount =
    attendance.filter(
      (item) =>
        item.status === "Leave"
    ).length;

  const totalWorkingHours =
    attendance.reduce(
      (total, item) =>
        total +
        Number(item.workingHours || 0),
      0
    );

  const averageWorkingHours =
    attendance.length > 0
      ? (
          totalWorkingHours /
          attendance.length
        ).toFixed(2)
      : "0.00";



  const getStatusClass = (status) => {
    return (
      status
        ?.toLowerCase()
        .replace(" ", "-") || ""
    );
  };


  if (loading) {
    return (
      <div className="my-attendance-page">
        <div className="my-attendance-loading">

          <div className="attendance-loading-spinner"></div>

          <p>
            Loading attendance...
          </p>

        </div>
      </div>
    );
  }


  return (
    <div className="my-attendance-page">

      {/* HEADER */}

      <div className="my-attendance-header">

        <div>
          <h1>
            My Attendance
          </h1>

          <p>
            View and track your complete
            attendance history.
          </p>
        </div>

        <button
          className="attendance-refresh-button"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            size={18}
            className={
              refreshing
                ? "attendance-refresh-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="my-attendance-error">
          <AlertCircle size={18} />

          <span>
            {error}
          </span>
        </div>
      )}

      {/* SUMMARY CARDS */}

      <div className="attendance-summary-grid">

        <div className="attendance-summary-card">

          <div className="attendance-summary-icon">
            <CalendarCheck size={21} />
          </div>

          <div>
            <span>
              Total Records
            </span>

            <h2>
              {attendance.length}
            </h2>
          </div>

        </div>

        <div className="attendance-summary-card">

          <div className="attendance-summary-icon">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>
              Present
            </span>

            <h2>
              {presentCount}
            </h2>
          </div>

        </div>

        <div className="attendance-summary-card">

          <div className="attendance-summary-icon">
            <Clock size={21} />
          </div>

          <div>
            <span>
              Late
            </span>

            <h2>
              {lateCount}
            </h2>
          </div>

        </div>

        <div className="attendance-summary-card">

          <div className="attendance-summary-icon">
            <Clock size={21} />
          </div>

          <div>
            <span>
              Avg. Hours
            </span>

            <h2>
              {averageWorkingHours}
            </h2>
          </div>

        </div>

      </div>

      {/* FILTERS */}

      <div className="attendance-filter-card">

        <div className="attendance-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search by date or status..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
        >
          <option value="All">
            All Status
          </option>

          <option value="Present">
            Present
          </option>

          <option value="Late">
            Late
          </option>

          <option value="Half Day">
            Half Day
          </option>

          <option value="Leave">
            Leave
          </option>

          <option value="Absent">
            Absent
          </option>
        </select>

        <select
          value={dateFilter}
          onChange={(e) =>
            setDateFilter(
              e.target.value
            )
          }
        >
          <option value="All">
            All Time
          </option>

          <option value="7">
            Last 7 Days
          </option>

          <option value="30">
            Last 30 Days
          </option>

          <option value="90">
            Last 90 Days
          </option>
        </select>

      </div>

      {/* TABLE */}

      <div className="my-attendance-card">

        <div className="my-attendance-card-header">

          <div>
            <h2>
              Attendance History
            </h2>

            <p>
              {filteredAttendance.length}{" "}
              record
              {filteredAttendance.length !==
              1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>

          <div className="attendance-header-count">
            {filteredAttendance.length}
          </div>

        </div>

        {filteredAttendance.length ===
        0 ? (
          <div className="attendance-empty">

            <XCircle size={40} />

            <h3>
              No attendance records
            </h3>

            <p>
              No records match your
              current filters.
            </p>

          </div>
        ) : (
          <div className="my-attendance-table-wrapper">

            <table className="my-attendance-table">

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
                {filteredAttendance.map(
                  (item) => (
                    <tr
                      key={item._id}
                    >

                      <td>
                        <div className="attendance-date">
                          <CalendarCheck
                            size={15}
                          />

                          {formatDate(
                            item.date
                          )}
                        </div>
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
                        <strong>
                          {item.workingHours
                            ? `${item.workingHours} hrs`
                            : "-"}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`my-attendance-status ${getStatusClass(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td>
                        <span className="attendance-remarks">
                          {item.remarks ||
                            "-"}
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

      {/* ADDITIONAL SUMMARY */}

      <div className="attendance-bottom-summary">

        <div>
          <span>
            Half Days
          </span>

          <strong>
            {halfDayCount}
          </strong>
        </div>

        <div>
          <span>
            Leave Days
          </span>

          <strong>
            {leaveCount}
          </strong>
        </div>

        <div>
          <span>
            Total Working Hours
          </span>

          <strong>
            {totalWorkingHours.toFixed(
              2
            )}{" "}
            hrs
          </strong>
        </div>

      </div>

    </div>
  );
};

export default MyAttendance;