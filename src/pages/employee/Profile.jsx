import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ShieldCheck,
  RefreshCw,
  UserRound,
} from "lucide-react";
import api from "../../services/api";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setError("");
      const response = await api.getMyProfile();
      setProfile(response.employee || response.user || response);
    } catch (err) {
      console.error("Profile Error:", err);
      setError(err.message || "Failed to load profile.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="employee-profile-page">
        <div className="employee-profile-loading">
          <div className="employee-profile-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="employee-profile-page">
        <div className="employee-profile-error">
          <UserRound size={38} />
          <h3>Profile not found</h3>
          <p>{error || "Unable to load your profile."}</p>
          <button onClick={loadProfile}>
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-profile-page">
      <div className="employee-profile-header">
        <div>
          <h1>My Profile</h1>
          <p>View your personal and professional information.</p>
        </div>

        <button
          className="employee-profile-refresh"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            size={17}
            className={refreshing ? "employee-profile-spin" : ""}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="employee-profile-alert">
          <span>{error}</span>
        </div>
      )}

      <div className="employee-profile-grid">
        <div className="employee-profile-card employee-profile-main">
          <div className="employee-profile-avatar">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt="Profile" />
            ) : (
              getInitials(profile.name)
            )}
          </div>

          <h2>{profile.name || "Employee"}</h2>
          <p className="employee-profile-designation">
            {profile.designation || "Employee"}
          </p>

          <span
            className={`employee-profile-status ${
              profile.status === "active" ? "active" : "inactive"
            }`}
          >
            <span></span>
            {profile.status || "active"}
          </span>

          <div className="employee-profile-id">
            Employee ID: <strong>{profile.employeeId || "-"}</strong>
          </div>
        </div>

        <div className="employee-profile-card">
          <div className="employee-profile-section-title">
            <User size={19} />
            <h3>Personal Information</h3>
          </div>

          <div className="employee-profile-info-grid">
            <div className="employee-profile-info">
              <div className="employee-profile-info-icon">
                <User size={17} />
              </div>
              <div>
                <span>Full Name</span>
                <strong>{profile.name || "-"}</strong>
              </div>
            </div>

            <div className="employee-profile-info">
              <div className="employee-profile-info-icon">
                <Mail size={17} />
              </div>
              <div>
                <span>Email</span>
                <strong>{profile.email || "-"}</strong>
              </div>
            </div>

            <div className="employee-profile-info">
              <div className="employee-profile-info-icon">
                <Phone size={17} />
              </div>
              <div>
                <span>Phone</span>
                <strong>{profile.phone || "-"}</strong>
              </div>
            </div>

            <div className="employee-profile-info">
              <div className="employee-profile-info-icon">
                <ShieldCheck size={17} />
              </div>
              <div>
                <span>Role</span>
                <strong>{profile.role || "-"}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="employee-profile-card employee-profile-professional">
          <div className="employee-profile-section-title">
            <BriefcaseBusiness size={19} />
            <h3>Professional Information</h3>
          </div>

          <div className="employee-profile-info-grid">
            <div className="employee-profile-info">
              <div className="employee-profile-info-icon">
                <BriefcaseBusiness size={17} />
              </div>
              <div>
                <span>Designation</span>
                <strong>{profile.designation || "-"}</strong>
              </div>
            </div>

            <div className="employee-profile-info">
              <div className="employee-profile-info-icon">
                <Building2 size={17} />
              </div>
              <div>
                <span>Department</span>
                <strong>{profile.department || "-"}</strong>
              </div>
            </div>

            <div className="employee-profile-info">
              <div className="employee-profile-info-icon">
                <CalendarDays size={17} />
              </div>
              <div>
                <span>Joining Date</span>
                <strong>{formatDate(profile.joiningDate)}</strong>
              </div>
            </div>

            <div className="employee-profile-info">
              <div className="employee-profile-info-icon">
                <ShieldCheck size={17} />
              </div>
              <div>
                <span>Account Status</span>
                <strong>{profile.status || "-"}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;