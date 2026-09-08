import { useEffect, useState } from "react";

import {
  CalendarDays,
  Send,
  RefreshCw,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";

import "./LeaveRequest.css";

const LeaveRequest = () => {
  const [leaves, setLeaves] = useState([]);

  const [formData, setFormData] = useState({
    leaveType: "Casual Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ========================================
  // LOAD LEAVES
  // ========================================

  const loadLeaves = async () => {
    try {
      setError("");

      const response = await api.getMyLeaves();

      setLeaves(response.leaves || []);
    } catch (err) {
      console.error("Load Leaves Error:", err);

      setError(
        err.message ||
          "Failed to load leave requests."
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
  // HANDLE INPUT
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ========================================
  // SUBMIT LEAVE
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.leaveType ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.reason.trim()
    ) {
      setError(
        "Please fill all required fields."
      );

      return;
    }

    if (
      new Date(formData.endDate) <
      new Date(formData.startDate)
    ) {
      setError(
        "End date cannot be before start date."
      );

      return;
    }

    try {
      setSubmitting(true);

      const response =
        await api.createLeave({
          leaveType:
            formData.leaveType,

          startDate:
            formData.startDate,

          endDate:
            formData.endDate,

          reason:
            formData.reason.trim(),
        });

      setSuccess(
        response.message ||
          "Leave request submitted successfully."
      );

      setFormData({
        leaveType: "Casual Leave",
        startDate: "",
        endDate: "",
        reason: "",
      });

      await loadLeaves();
    } catch (err) {
      console.error(
        "Submit Leave Error:",
        err
      );

      setError(
        err.message ||
          "Failed to submit leave request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ========================================
  // REFRESH
  // ========================================

  const handleRefresh = async () => {
    setRefreshing(true);

    await loadLeaves();
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
  // STATUS CLASS
  // ========================================

  const getStatusClass = (status) => {
    return (
      status?.toLowerCase() || ""
    );
  };

  // ========================================
  // STATUS ICON
  // ========================================

  const getStatusIcon = (status) => {
    if (status === "Approved") {
      return <CheckCircle2 size={15} />;
    }

    if (status === "Rejected") {
      return <XCircle size={15} />;
    }

    return <Clock3 size={15} />;
  };

  // ========================================
  // SUMMARY
  // ========================================

  const pendingLeaves =
    leaves.filter(
      (leave) =>
        leave.status === "Pending"
    ).length;

  const approvedLeaves =
    leaves.filter(
      (leave) =>
        leave.status === "Approved"
    ).length;

  const rejectedLeaves =
    leaves.filter(
      (leave) =>
        leave.status === "Rejected"
    ).length;

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="leave-request-page">
        <div className="leave-request-loading">

          <div className="leave-loading-spinner"></div>

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
    <div className="leave-request-page">

      {/* HEADER */}

      <div className="leave-request-header">

        <div>
          <h1>
            Leave Request
          </h1>

          <p>
            Submit and track your leave
            requests.
          </p>
        </div>

        <button
          className="leave-refresh-button"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            size={18}
            className={
              refreshing
                ? "leave-refresh-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>

      {/* MESSAGES */}

      {success && (
        <div className="leave-success-message">
          <CheckCircle2 size={18} />

          <span>
            {success}
          </span>
        </div>
      )}

      {error && (
        <div className="leave-error-message">
          <AlertCircle size={18} />

          <span>
            {error}
          </span>
        </div>
      )}

      {/* SUMMARY */}

      <div className="leave-summary-grid">

        <div className="leave-summary-card">

          <div className="leave-summary-icon pending">
            <Clock3 size={20} />
          </div>

          <div>
            <span>
              Pending
            </span>

            <h2>
              {pendingLeaves}
            </h2>
          </div>

        </div>

        <div className="leave-summary-card">

          <div className="leave-summary-icon approved">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>
              Approved
            </span>

            <h2>
              {approvedLeaves}
            </h2>
          </div>

        </div>

        <div className="leave-summary-card">

          <div className="leave-summary-icon rejected">
            <XCircle size={20} />
          </div>

          <div>
            <span>
              Rejected
            </span>

            <h2>
              {rejectedLeaves}
            </h2>
          </div>

        </div>

        <div className="leave-summary-card">

          <div className="leave-summary-icon total">
            <CalendarDays size={20} />
          </div>

          <div>
            <span>
              Total Requests
            </span>

            <h2>
              {leaves.length}
            </h2>
          </div>

        </div>

      </div>

      {/* MAIN GRID */}

      <div className="leave-request-grid">

        {/* FORM */}

        <div className="leave-form-card">

          <div className="leave-card-header">

            <div className="leave-header-icon">
              <CalendarDays size={20} />
            </div>

            <div>
              <h2>
                Apply for Leave
              </h2>

              <p>
                Fill in the details below.
              </p>
            </div>

          </div>

          <form
            className="leave-form"
            onSubmit={handleSubmit}
          >

            {/* LEAVE TYPE */}

            <div className="leave-form-group">

              <label htmlFor="leaveType">
                Leave Type
                <span>*</span>
              </label>

              <select
                id="leaveType"
                name="leaveType"
                value={
                  formData.leaveType
                }
                onChange={handleChange}
              >
                <option value="Casual Leave">
                  Casual Leave
                </option>

                <option value="Sick Leave">
                  Sick Leave
                </option>

                <option value="Paid Leave">
                  Paid Leave
                </option>

                <option value="Emergency Leave">
                  Emergency Leave
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

            </div>

            {/* DATES */}

            <div className="leave-date-grid">

              <div className="leave-form-group">

                <label htmlFor="startDate">
                  Start Date
                  <span>*</span>
                </label>

                <input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={
                    formData.startDate
                  }
                  onChange={handleChange}
                />

              </div>

              <div className="leave-form-group">

                <label htmlFor="endDate">
                  End Date
                  <span>*</span>
                </label>

                <input
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={
                    formData.endDate
                  }
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* REASON */}

            <div className="leave-form-group">

              <label htmlFor="reason">
                Reason
                <span>*</span>
              </label>

              <textarea
                id="reason"
                name="reason"
                rows="5"
                placeholder="Enter reason for leave..."
                value={
                  formData.reason
                }
                onChange={handleChange}
              />

              <small>
                Please provide a clear
                reason for your leave.
              </small>

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="leave-submit-button"
              disabled={submitting}
            >
              <Send size={17} />

              {submitting
                ? "Submitting..."
                : "Submit Leave Request"}
            </button>

          </form>

        </div>

        {/* INFO CARD */}

        <div className="leave-info-card">

          <div className="leave-info-icon">
            <CalendarDays size={22} />
          </div>

          <h2>
            Leave Guidelines
          </h2>

          <ul>
            <li>
              Submit your leave request
              in advance whenever possible.
            </li>

            <li>
              Make sure the selected
              dates are correct.
            </li>

            <li>
              Provide a clear reason for
              your leave.
            </li>

            <li>
              Your request will remain
              pending until reviewed.
            </li>

            <li>
              You can track the status
              from this page.
            </li>
          </ul>

        </div>

      </div>

      {/* REQUEST HISTORY */}

      <div className="leave-history-card">

        <div className="leave-history-header">

          <div>
            <h2>
              My Leave Requests
            </h2>

            <p>
              View your submitted leave
              requests.
            </p>
          </div>

          <span className="leave-history-count">
            {leaves.length}
          </span>

        </div>

        {leaves.length === 0 ? (
          <div className="leave-empty">

            <CalendarDays size={40} />

            <h3>
              No leave requests
            </h3>

            <p>
              You haven't submitted any
              leave requests yet.
            </p>

          </div>
        ) : (
          <div className="leave-history-table-wrapper">

            <table className="leave-history-table">

              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>

              <tbody>
                {leaves.map(
                  (leave) => (
                    <tr
                      key={leave._id}
                    >

                      <td>
                        <strong>
                          {leave.leaveType}
                        </strong>
                      </td>

                      <td>
                        {formatDate(
                          leave.startDate
                        )}
                      </td>

                      <td>
                        {formatDate(
                          leave.endDate
                        )}
                      </td>

                      <td>
                        <span className="leave-reason">
                          {leave.reason}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`leave-request-status ${getStatusClass(
                            leave.status
                          )}`}
                        >
                          {getStatusIcon(
                            leave.status
                          )}

                          {leave.status}
                        </span>
                      </td>

                      <td>
                        {formatDate(
                          leave.createdAt
                        )}
                      </td>

                    </tr>
                  )
                )}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};

export default LeaveRequest;