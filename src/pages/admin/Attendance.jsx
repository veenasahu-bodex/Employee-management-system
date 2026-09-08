import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  Search,
  RefreshCw,
} from "lucide-react";

import api from "../../services/api";

import "./Attendance.css";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [error, setError] = useState("");

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

      const data =
        await api.getAllAttendance(token);

      setAttendance(data.attendance || []);
    } catch (err) {
      console.error(
        "Attendance Error:",
        err
      );

      setError(
        err.message ||
          "Failed to load attendance."
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

  const filteredAttendance = useMemo(() => {
    return attendance.filter((item) => {
      const employee = item.employeeId;

      const searchText =
        search.toLowerCase();

      const matchesSearch =
        employee?.name
          ?.toLowerCase()
          .includes(searchText) ||
        employee?.employeeId
          ?.toLowerCase()
          .includes(searchText) ||
        employee?.department
          ?.toLowerCase()
          .includes(searchText);

      const itemDate = item.date
        ? new Date(item.date)
            .toISOString()
            .split("T")[0]
        : "";

      const matchesDate =
        !dateFilter ||
        itemDate === dateFilter;

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      return (
        matchesSearch &&
        matchesDate &&
        matchesStatus
      );
    });
  }, [
    attendance,
    search,
    dateFilter,
    statusFilter,
  ]);

  const statusCounts = {
    Present: attendance.filter(
      (item) =>
        item.status === "Present"
    ).length,

    Late: attendance.filter(
      (item) =>
        item.status === "Late"
    ).length,

    "Half Day": attendance.filter(
      (item) =>
        item.status === "Half Day"
    ).length,

    Leave: attendance.filter(
      (item) =>
        item.status === "Leave"
    ).length,

    Absent: attendance.filter(
      (item) =>
        item.status === "Absent"
    ).length,
  };

  if (loading) {
    return (
      <div className="attendance-page">
        <div className="attendance-loading">
          <div className="attendance-spinner"></div>

          <p>
            Loading attendance...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="attendance-page">

      {/* HEADER */}

      <div className="attendance-header">

        <div>
          <h1>
            Attendance
          </h1>

          <p>
            Manage and monitor employee
            attendance.
          </p>
        </div>

        <button
          className="attendance-refresh"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            size={18}
            className={
              refreshing
                ? "attendance-refresh-icon spinning"
                : "attendance-refresh-icon"
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>


      {/* ERROR */}

      {error && (
        <div className="attendance-error">
          {error}
        </div>
      )}


      {/* STATS */}

      <div className="attendance-stats">

        <div className="attendance-stat-card">

          <div className="attendance-stat-icon">
            <CalendarCheck size={22} />
          </div>

          <div>
            <span>
              Total Records
            </span>

            <strong>
              {attendance.length}
            </strong>
          </div>

        </div>


        <div className="attendance-stat-card">

          <div className="attendance-stat-icon">
            <CalendarCheck size={22} />
          </div>

          <div>
            <span>
              Present
            </span>

            <strong>
              {statusCounts.Present}
            </strong>
          </div>

        </div>


        <div className="attendance-stat-card">

          <div className="attendance-stat-icon">
            <CalendarCheck size={22} />
          </div>

          <div>
            <span>
              Late
            </span>

            <strong>
              {statusCounts.Late}
            </strong>
          </div>

        </div>


        <div className="attendance-stat-card">

          <div className="attendance-stat-icon">
            <CalendarCheck size={22} />
          </div>

          <div>
            <span>
              Half Day
            </span>

            <strong>
              {statusCounts["Half Day"]}
            </strong>
          </div>

        </div>

      </div>


      {/* FILTERS */}
      <div className="attendance-card">

        <div className="attendance-filters">

          <div className="attendance-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>
          <div className="attendance-filter-group">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(
                  e.target.value
                )
              }
            />


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
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="attendance-card">

        <div className="attendance-table-wrapper">

          {filteredAttendance.length ===
          0 ? (
            <div className="attendance-empty">
              <CalendarCheck
                size={42}
              />

              <h3>
                No attendance records
              </h3>

              <p>
                Attendance data will appear
                here once employees check in.
              </p>
            </div>
          ) : (
            <table className="attendance-table">

              <thead>
                <tr>

                  <th>
                    Employee
                  </th>

                  <th>
                    Employee ID
                  </th>

                  <th>
                    Department
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Check In
                  </th>

                  <th>
                    Check Out
                  </th>

                  <th>
                    Working Hours
                  </th>

                  <th>
                    Status
                  </th>

                </tr>
              </thead>


              <tbody>

                {filteredAttendance.map(
                  (item) => {
                    const employee =
                      item.employeeId;

                    return (
                      <tr
                        key={item._id}
                      >

                        <td>
                          <div className="attendance-employee">

                            <div className="attendance-avatar">
                              {employee?.name
                                ?.charAt(
                                  0
                                )
                                ?.toUpperCase() ||
                                "?"}
                            </div>

                            <strong>
                              {employee?.name ||
                                "Unknown"}
                            </strong>

                          </div>
                        </td>

                        <td>
                          {employee?.employeeId ||
                            "-"}
                        </td>

                        <td>
                          {employee?.department ||
                            "-"}
                        </td>

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
                    );
                  }
                )}

              </tbody>

            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;