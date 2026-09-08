import { useSelector } from "react-redux";
import { Bell } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  const userName = user?.name || "Admin User";
  const userRole = user?.designation || "Administrator";

  return (
    <header className="navbar">
      <div className="navbar-right">
        <button
          className="navbar-icon-button"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>

        <div className="navbar-profile">
          <div className="navbar-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>

          <div className="navbar-user-info">
            <strong>{userName}</strong>
            <span>{userRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;