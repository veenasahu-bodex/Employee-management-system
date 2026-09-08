import { useSelector } from "react-redux";

import {
  Menu,
  Bell,
} from "lucide-react";

import "./EmployeeNavbar.css";

const EmployeeNavbar = ({
  openSidebar,
}) => {
  const { user } = useSelector(
    (state) => state.auth
  );

  const userName =
    user?.name || "Employee";

  const userRole =
    user?.designation || "Employee";

  return (
    <header className="employee-navbar">

      {/* LEFT */}

      <div className="employee-navbar-left">

        <button
          className="employee-navbar-menu"
          onClick={openSidebar}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="employee-navbar-title">
          <span>
            Employee Portal
          </span>
        </div>

      </div>


      {/* RIGHT */}

      <div className="employee-navbar-right">

        <button
          className="employee-navbar-notification"
          title="Notifications"
        >
          <Bell size={20} />

          <span className="employee-notification-dot"></span>
        </button>


        <div className="employee-navbar-profile">

          <div className="employee-navbar-avatar">
            {userName
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="employee-navbar-user">

            <strong>
              {userName}
            </strong>

            <span>
              {userRole}
            </span>

          </div>

        </div>

      </div>

    </header>
  );
};

export default EmployeeNavbar;