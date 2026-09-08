import { useEffect, useState } from "react";
import {
  FileText,
  RefreshCw,
  Users,
  UserCheck,
  UserX,
  Clock,
  CalendarDays,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import api from "../../services/api";
import "./Reports.css";

const Reports = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState("all");

  const loadReports = async () => {
    try {
      setError("");
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");

      const [attendanceResponse, employeeResponse] = await Promise.all([
        api.getAllAttendance(token),
        api.getEmployees(token),
      ]);

      setAttendance(attendanceResponse.attendance || []);
      setEmployees(employeeResponse.employees || []);
    } catch (err) {
      console.error("Reports Error:", err);
      setError(err.message || "Failed to load reports.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadReports();
  };

  const getFilteredAttendance = () => {
    if (dateRange === "all") return attendance;

    const now = new Date();
    const startDate = new Date(now);

    if (dateRange === "7") {
      startDate.setDate(now.getDate() - 7);
    } else if (dateRange === "30") {
      startDate.setDate(now.getDate() - 30);
    } else if (dateRange === "90") {
      startDate.setDate(now.getDate() - 90);
    }

    startDate.setHours(0, 0, 0, 0);

    return attendance.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate;
    });
  };

  const filteredAttendance = getFilteredAttendance();

  const totalEmployees = employees.filter(
    (employee) => employee.role === "employee"
  ).length;

  const totalRecords = filteredAttendance.length;

  const presentCount = filteredAttendance.filter(
    (item) => item.status === "Present"
  ).length;

  const lateCount = filteredAttendance.filter(
    (item) => item.status === "Late"
  ).length;

  const absentCount = filteredAttendance.filter(
    (item) => item.status === "Absent"
  ).length;

  const halfDayCount = filteredAttendance.filter(
    (item) => item.status === "Half Day"
  ).length;

  const leaveCount = filteredAttendance.filter(
    (item) => item.status === "Leave"
  ).length;

  const totalWorkingHours = filteredAttendance.reduce(
    (total, item) => total + (Number(item.workingHours) || 0),
    0
  );

  const averageWorkingHours =
    totalRecords > 0
      ? (totalWorkingHours / totalRecords).toFixed(2)
      : "0.00";

  const statusChartData = [
    { name: "Present", count: presentCount },
    { name: "Late", count: lateCount },
    { name: "Half Day", count: halfDayCount },
    { name: "Leave", count: leaveCount },
    { name: "Absent", count: absentCount },
  ];

  const statusColors = {
    Present: "#22c55e",
    Late: "#f59e0b",
    "Half Day": "#8b5cf6",
    Leave: "#ec4899",
    Absent: "#ef4444",
  };

  const employeeReport = employees
    .filter((employee) => employee.role === "employee")
    .map((employee) => {
      const records = filteredAttendance.filter(
        (item) => item.employeeId?._id === employee._id
      );

      const present = records.filter(
        (item) => item.status === "Present"
      ).length;

      const late = records.filter(
        (item) => item.status === "Late"
      ).length;

      const halfDay = records.filter(
        (item) => item.status === "Half Day"
      ).length;

      const leave = records.filter(
        (item) => item.status === "Leave"
      ).length;

      const absent = records.filter(
        (item) => item.status === "Absent"
      ).length;

      const workingHours = records.reduce(
        (total, item) => total + (Number(item.workingHours) || 0),
        0
      );

      return {
        ...employee,
        total: records.length,
        present,
        late,
        halfDay,
        leave,
        absent,
        workingHours: workingHours.toFixed(2),
      };
    });

  if (loading) {
    return (
      <div className="reports-page">
        <div className="reports-loading">
          <div className="loading-spinner"></div>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div className="reports-title">
          <div className="reports-title-icon">
            <FileText size={25} />
          </div>
          <div>
            <h1>Reports</h1>
            <p>Attendance reports and employee performance overview.</p>
          </div>
        </div>

        <div className="reports-header-actions">
          <select
            className="report-period-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>

          <button
            className="reports-refresh"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              size={18}
              className={refreshing ? "refresh-icon spinning" : "refresh-icon"}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {error && <div className="reports-error">{error}</div>}

      <div className="reports-stats">
        <div className="report-stat-card employees-stat">
          <div className="report-stat-icon">
            <Users size={23} />
          </div>
          <div>
            <span>Total Employees</span>
            <h2>{totalEmployees}</h2>
          </div>
        </div>

        <div className="report-stat-card present-stat">
          <div className="report-stat-icon">
            <UserCheck size={23} />
          </div>
          <div>
            <span>Present Records</span>
            <h2>{presentCount}</h2>
          </div>
        </div>

        <div className="report-stat-card late-stat">
          <div className="report-stat-icon">
            <Clock size={23} />
          </div>
          <div>
            <span>Late Records</span>
            <h2>{lateCount}</h2>
          </div>
        </div>

        <div className="report-stat-card absent-stat">
          <div className="report-stat-icon">
            <UserX size={23} />
          </div>
          <div>
            <span>Absent Records</span>
            <h2>{absentCount}</h2>
          </div>
        </div>

        <div className="report-stat-card leave-stat">
          <div className="report-stat-icon">
            <CalendarDays size={23} />
          </div>
          <div>
            <span>Leave Records</span>
            <h2>{leaveCount}</h2>
          </div>
        </div>
      </div>

      <div className="reports-grid">
        <div className="reports-card">
          <div className="reports-card-header">
            <div>
              <h2>Attendance Status</h2>
              <p>Attendance records by status.</p>
            </div>
          </div>

          <div className="report-chart">
            {totalRecords === 0 ? (
              <div className="reports-empty-small">
                No attendance data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={340}>
                <BarChart
                  data={statusChartData}
                  margin={{
                    top: 10,
                    right: 15,
                    left: -20,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />

                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />

                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />

                  <Tooltip
                    cursor={{ fill: "rgba(124, 58, 237, 0.06)" }}
                    contentStyle={{
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
                    }}
                    formatter={(value) => [`${value}`, "Records"]}
                  />

                  <Legend
                    verticalAlign="bottom"
                    height={35}
                    wrapperStyle={{
                      fontSize: "12px",
                      paddingTop: "10px",
                    }}
                  />

                  <Bar
                    dataKey="count"
                    name="Records"
                    radius={[7, 7, 0, 0]}
                    barSize={42}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={statusColors[entry.name]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="reports-card">
          <div className="reports-card-header">
            <div>
              <h2>Attendance Summary</h2>
              <p>Overall report summary.</p>
            </div>
          </div>

          <div className="report-summary">
            <div className="report-summary-row">
              <span>Total Records</span>
              <strong>{totalRecords}</strong>
            </div>

            <div className="report-summary-row present-row">
              <span>Present</span>
              <strong>{presentCount}</strong>
            </div>

            <div className="report-summary-row late-row">
              <span>Late</span>
              <strong>{lateCount}</strong>
            </div>

            <div className="report-summary-row half-row">
              <span>Half Day</span>
              <strong>{halfDayCount}</strong>
            </div>

            <div className="report-summary-row leave-row">
              <span>Leave</span>
              <strong>{leaveCount}</strong>
            </div>

            <div className="report-summary-row absent-row">
              <span>Absent</span>
              <strong>{absentCount}</strong>
            </div>

            <div className="report-summary-row hours-row">
              <span>Avg. Working Hours</span>
              <strong>{averageWorkingHours} hrs</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="reports-card employee-report-card">
        <div className="reports-card-header">
          <div>
            <h2>Employee Attendance Report</h2>
            <p>Employee-wise attendance summary.</p>
          </div>

          <div className="report-record-count">
            {employeeReport.length} Employees
          </div>
        </div>

        {employeeReport.length === 0 ? (
          <div className="reports-empty">
            <div className="reports-empty-icon">
              <FileText size={30} />
            </div>
            <h3>No employee data</h3>
            <p>Employee attendance data will appear here.</p>
          </div>
        ) : (
          <div className="employee-report-table-wrapper">
            <table className="employee-report-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Records</th>
                  <th>Present</th>
                  <th>Late</th>
                  <th>Half Day</th>
                  <th>Leave</th>
                  <th>Absent</th>
                  <th>Working Hours</th>
                </tr>
              </thead>

              <tbody>
                {employeeReport.map((employee) => (
                  <tr key={employee._id}>
                    <td>
                      <div className="report-employee">
                        <div className="report-avatar">
                          {employee.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>

                        <div>
                          <strong>{employee.name}</strong>
                          <span>{employee.designation || "Employee"}</span>
                        </div>
                      </div>
                    </td>

                    <td>{employee.employeeId || "-"}</td>
                    <td>{employee.department || "-"}</td>

                    <td>
                      <span className="record-number">
                        {employee.total}
                      </span>
                    </td>

                    <td>
                      <span className="table-count present-count">
                        {employee.present}
                      </span>
                    </td>

                    <td>
                      <span className="table-count late-count">
                        {employee.late}
                      </span>
                    </td>

                    <td>
                      <span className="table-count half-count">
                        {employee.halfDay}
                      </span>
                    </td>

                    <td>
                      <span className="table-count leave-count">
                        {employee.leave}
                      </span>
                    </td>

                    <td>
                      <span className="table-count absent-count">
                        {employee.absent}
                      </span>
                    </td>

                    <td>
                      <strong className="working-hours">
                        {employee.workingHours} hrs
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;