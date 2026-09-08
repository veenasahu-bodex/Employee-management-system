import { useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  Search,
  RefreshCw,
  Check,
  X,
} from "lucide-react";

import api from "../../services/api";

import "./Leaves.css";

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [processingId, setProcessingId] =
    useState(null);

  const [error, setError] = useState("");

  // ========================================
  // LOAD LEAVES
  // ========================================

  const loadLeaves = async () => {
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
        await api.getAllLeaves(token);

      setLeaves(data.leaves || []);
    } catch (err) {
      console.error(
        "Leaves Error:",
        err
      );

      setError(
        err.message ||
          "Failed to load leaves."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  // ========================================
  // REFRESH
  // ========================================

  const handleRefresh = async () => {
    setRefreshing(true);

    await loadLeaves();
  };

  // ========================================
  // APPROVE LEAVE
  // ========================================

  const handleApprove = async (leaveId) => {
    const confirmApprove =
      window.confirm(
        "Are you sure you want to approve this leave request?"
      );

    if (!confirmApprove) return;

    try {
      setProcessingId(leaveId);
      setError("");

      const token =
        localStorage.getItem("token");

      await api.approveLeave(
        leaveId,
        token
      );

      await loadLeaves();
    } catch (err) {
      console.error(
        "Approve Leave Error:",
        err
      );

      setError(
        err.message ||
          "Failed to approve leave."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ========================================
  // REJECT LEAVE
  // ========================================

  const handleReject = async (leaveId) => {
    const confirmReject =
      window.confirm(
        "Are you sure you want to reject this leave request?"
      );

    if (!confirmReject) return;

    try {
      setProcessingId(leaveId);
      setError("");

      const token =
        localStorage.getItem("token");

      await api.rejectLeave(
        leaveId,
        token
      );

      await loadLeaves();
    } catch (err) {
      console.error(
        "Reject Leave Error:",
        err
      );

      setError(
        err.message ||
          "Failed to reject leave."
      );
    } finally {
      setProcessingId(null);
    }
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
  // CALCULATE LEAVE DAYS
  // ========================================

  const calculateDays = (
    startDate,
    endDate
  ) => {
    if (!startDate || !endDate) {
      return 0;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const difference =
      end.getTime() -
      start.getTime();

    return (
      Math.floor(
        difference /
          (1000 * 60 * 60 * 24)
      ) + 1
    );
  };

  // ========================================
  // FILTER
  // ========================================

  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      const employee =
        leave.employeeId;

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
          .includes(searchText) ||
        leave.leaveType
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        leave.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    leaves,
    search,
    statusFilter,
  ]);

  // ========================================
  // COUNTS
  // ========================================

  const pendingCount =
    leaves.filter(
      (leave) =>
        leave.status === "Pending"
    ).length;

  const approvedCount =
    leaves.filter(
      (leave) =>
        leave.status === "Approved"
    ).length;

  const rejectedCount =
    leaves.filter(
      (leave) =>
        leave.status === "Rejected"
    ).length;

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="leaves-page">
        <div className="leaves-loading">
          <div className="leaves-spinner"></div>

          <p>
            Loading leave requests...
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="leaves-page">

      {/* HEADER */}

      <div className="leaves-header">

        <div>
          <h1>
            Leave Management
          </h1>

          <p>
            Manage employee leave requests
            and approvals.
          </p>
        </div>

        <button
          className="leaves-refresh"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            size={18}
            className={
              refreshing
                ? "leaves-refresh-icon spinning"
                : "leaves-refresh-icon"
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>


      {/* ERROR */}

      {error && (
        <div className="leaves-error">
          {error}
        </div>
      )}


      {/* STATS */}

      <div className="leaves-stats">

        <div className="leaves-stat-card">

          <div className="leaves-stat-icon">
            <CalendarDays
              size={22}
            />
          </div>

          <div>
            <span>
              Total Requests
            </span>

            <strong>
              {leaves.length}
            </strong>
          </div>

        </div>


        <div className="leaves-stat-card">

          <div className="leaves-stat-icon pending">
            <CalendarDays
              size={22}
            />
          </div>

          <div>
            <span>
              Pending
            </span>

            <strong>
              {pendingCount}
            </strong>
          </div>

        </div>


        <div className="leaves-stat-card">

          <div className="leaves-stat-icon approved">
            <Check size={22} />
          </div>

          <div>
            <span>
              Approved
            </span>

            <strong>
              {approvedCount}
            </strong>
          </div>

        </div>


        <div className="leaves-stat-card">

          <div className="leaves-stat-icon rejected">
            <X size={22} />
          </div>

          <div>
            <span>
              Rejected
            </span>

            <strong>
              {rejectedCount}
            </strong>
          </div>

        </div>

      </div>


      {/* FILTER CARD */}

      <div className="leaves-card">

        <div className="leaves-filters">

          <div className="leaves-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search employee or leave type..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>


          <select
            className="leaves-status-filter"
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

            <option value="Pending">
              Pending
            </option>

            <option value="Approved">
              Approved
            </option>

            <option value="Rejected">
              Rejected
            </option>
          </select>

        </div>

      </div>


      {/* TABLE */}

      <div className="leaves-card">

        <div className="leaves-table-wrapper">

          {filteredLeaves.length ===
          0 ? (
            <div className="leaves-empty">

              <CalendarDays
                size={42}
              />

              <h3>
                No leave requests
              </h3>

              <p>
                Leave requests will appear
                here when employees submit
                them.
              </p>

            </div>
          ) : (
            <table className="leaves-table">

              <thead>
                <tr>

                  <th>
                    Employee
                  </th>

                  <th>
                    Employee ID
                  </th>

                  <th>
                    Leave Type
                  </th>

                  <th>
                    Start Date
                  </th>

                  <th>
                    End Date
                  </th>

                  <th>
                    Days
                  </th>

                  <th>
                    Reason
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>
              </thead>


              <tbody>

                {filteredLeaves.map(
                  (leave) => {
                    const employee =
                      leave.employeeId;

                    const isProcessing =
                      processingId ===
                      leave._id;

                    return (
                      <tr
                        key={leave._id}
                      >

                        {/* EMPLOYEE */}

                        <td>

                          <div className="leaves-employee">

                            <div className="leaves-avatar">
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


                        {/* EMPLOYEE ID */}

                        <td>
                          {employee?.employeeId ||
                            "-"}
                        </td>


                        {/* LEAVE TYPE */}

                        <td>
                          {leave.leaveType}
                        </td>


                        {/* START */}

                        <td>
                          {formatDate(
                            leave.startDate
                          )}
                        </td>


                        {/* END */}

                        <td>
                          {formatDate(
                            leave.endDate
                          )}
                        </td>


                        {/* DAYS */}

                        <td>
                          {calculateDays(
                            leave.startDate,
                            leave.endDate
                          )}{" "}
                          {calculateDays(
                            leave.startDate,
                            leave.endDate
                          ) === 1
                            ? "day"
                            : "days"}
                        </td>


                        {/* REASON */}

                        <td>

                          <div className="leave-reason">
                            {leave.reason ||
                              "-"}
                          </div>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`leave-status ${leave.status
                              ?.toLowerCase()}`}
                          >
                            {leave.status}
                          </span>

                        </td>


                        {/* ACTION */}

                        <td>

                          {leave.status ===
                          "Pending" ? (
                            <div className="leave-actions">

                              <button
                                className="leave-approve-button"
                                onClick={() =>
                                  handleApprove(
                                    leave._id
                                  )
                                }
                                disabled={
                                  isProcessing
                                }
                                title="Approve"
                              >
                                <Check
                                  size={16}
                                />

                                <span>
                                  Approve
                                </span>
                              </button>


                              <button
                                className="leave-reject-button"
                                onClick={() =>
                                  handleReject(
                                    leave._id
                                  )
                                }
                                disabled={
                                  isProcessing
                                }
                                title="Reject"
                              >
                                <X
                                  size={16}
                                />

                                <span>
                                  Reject
                                </span>
                              </button>

                            </div>
                          ) : (
                            <span className="leave-processed">
                              Processed
                            </span>
                          )}

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

export default Leaves;