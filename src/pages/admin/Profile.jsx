import { useEffect, useState } from "react";

import {
  UserCircle,
  Mail,
  Phone,
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  BadgeCheck,
  RefreshCw,
} from "lucide-react";
import api from "../../services/api";

import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [error, setError] = useState("");

  // LOAD PROFILE
  const loadProfile = async () => {
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
        await api.getMyProfile(token);
      setProfile(
        response.employee || null
      );
    } catch (err) {
      console.error(
        "Profile Error:",
        err
      );

      setError(
        err.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // REFRESH
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
  };

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  // INITIAL
  const getInitial = () => {
    return (
      profile?.name
        ?.charAt(0)
        ?.toUpperCase() || "U"
    );
  };

  // LOADING
  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="loading-spinner"></div>

          <p>
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // UI
  return (
    <div className="profile-page">

      {/* HEADER */}

      <div className="profile-header">

        <div>
          <h1>My Profile</h1>

          <p>
            View your account and
            professional information.
          </p>
        </div>

        <button
          className="profile-refresh"
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

      {/* ERROR */}

      {error && (
        <div className="profile-error">
          {error}
        </div>
      )}

      {!profile ? (
        <div className="profile-empty">

          <div className="profile-empty-icon">
            <UserCircle size={32} />
          </div>

          <h3>
            Profile not found
          </h3>

          <p>
            Unable to load your profile
            information.
          </p>

        </div>
      ) : (
        <div className="profile-content">

          {/* PROFILE SUMMARY */}

          <div className="profile-summary-card">

            <div className="profile-avatar">
              {profile.profileImage ? (
                <img
                  src={
                    profile.profileImage
                  }
                  alt={profile.name}
                />
              ) : (
                getInitial()
              )}
            </div>

            <div className="profile-summary-info">

              <h2>
                {profile.name}
              </h2>

              <p>
                {profile.designation ||
                  "Administrator"}
              </p>

              <div className="profile-status">

                <span className="status-dot"></span>

                <span>
                  {profile.status ===
                  "active"
                    ? "Active"
                    : "Inactive"}
                </span>

              </div>

            </div>

            <div className="profile-role">

              <BadgeCheck size={18} />

              <span>
                {profile.role ===
                "admin"
                  ? "Administrator"
                  : "Employee"}
              </span>

            </div>

          </div>

          {/* PERSONAL INFORMATION */}
          <div className="profile-card">
            <div className="profile-card-header">
              <div>
                <h2>
                  Personal Information
                </h2>

                <p>
                  Your basic account
                  information.
                </p>
              </div>
            </div>

            <div className="profile-details-grid">
              <div className="profile-detail">

                <div className="detail-icon">
                  <UserCircle
                    size={19}
                  />
                </div>
                <div>
                  <span>
                    Full Name
                  </span>

                  <strong>
                    {profile.name ||
                      "Not available"}
                  </strong>
                </div>
              </div>

              <div className="profile-detail">
                <div className="detail-icon">
                  <Mail size={19} />
                </div>

                <div>
                  <span>
                    Email Address
                  </span>

                  <strong>
                    {profile.email ||
                      "Not available"}
                  </strong>
                </div>

              </div>

              <div className="profile-detail">

                <div className="detail-icon">
                  <Phone size={19} />
                </div>

                <div>
                  <span>
                    Phone Number
                  </span>

                  <strong>
                    {profile.phone ||
                      "Not available"}
                  </strong>
                </div>

              </div>

              <div className="profile-detail">

                <div className="detail-icon">
                  <Building2
                    size={19}
                  />
                </div>

                <div>
                  <span>
                    Department
                  </span>

                  <strong>
                    {profile.department ||
                      "Not assigned"}
                  </strong>
                </div>

              </div>

            </div>

          </div>

          {/* PROFESSIONAL INFORMATION */}
          <div className="profile-card">
            <div className="profile-card-header">
              <div>
                <h2>
                  Professional Information
                </h2>

                <p>
                  Your employee and
                  company details.
                </p>
              </div>

            </div>
            <div className="profile-details-grid">
              <div className="profile-detail">
                <div className="detail-icon">
                  <BadgeCheck
                    size={19}
                  />
                </div>

                <div>
                  <span>
                    Employee ID
                  </span>

                  <strong>
                    {profile.employeeId ||
                      "Not assigned"}
                  </strong>
                </div>
              </div>

              <div className="profile-detail">
                <div className="detail-icon">
                  <BriefcaseBusiness
                    size={19}
                  />
                </div>

                <div>
                  <span>
                    Designation
                  </span>

                  <strong>
                    {profile.designation ||
                      "Not assigned"}
                  </strong>
                </div>

              </div>
              <div className="profile-detail">
                <div className="detail-icon">
                  <CalendarDays
                    size={19}
                  />
                </div>

                <div>
                  <span>
                    Joining Date
                  </span>

                  <strong>
                    {formatDate(
                      profile.joiningDate
                    )}
                  </strong>
                </div>

              </div>
              <div className="profile-detail">

                <div className="detail-icon">
                  <UserCircle
                    size={19}
                  />
                </div>

                <div>
                  <span>
                    Account Role
                  </span>

                  <strong>
                    {profile.role ===
                    "admin"
                      ? "Administrator"
                      : "Employee"}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* ACCOUNT INFORMATION */}

          <div className="profile-card">
            <div className="profile-card-header">
              <div>
                <h2>
                  Account Information
                </h2>

                <p>
                  Current account status.
                </p>
              </div>

            </div>

            <div className="account-info-grid">
              <div className="account-info-item">
                <span>
                  Account Status
                </span>

                <strong
                  className={
                    profile.status ===
                    "active"
                      ? "account-active"
                      : "account-inactive"
                  }
                >
                  {profile.status ===
                  "active"
                    ? "Active"
                    : "Inactive"}
                </strong>
              </div>
              <div className="account-info-item">
                <span>
                  Account Created
                </span>

                <strong>
                  {formatDate(
                    profile.createdAt
                  )}
                </strong>
              </div>
              <div className="account-info-item">

                <span>
                  Last Updated
                </span>

                <strong>
                  {formatDate(
                    profile.updatedAt
                  )}
                </strong>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Profile;