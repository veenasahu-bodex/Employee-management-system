import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  History,
  Clock3,
  UserCircle,
  LogOut,
  X,
} from "lucide-react";
import { logout } from "../features/auth/authSlice";
import "./EmployeeSidebar.css";

const EmployeeSidebar = ({ isOpen, closeSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    dispatch(logout());

    if (closeSidebar) {
      closeSidebar();
    }

    navigate("/login", { replace: true });
  };

  const menuItems = [
    {
      title: "Dashboard",
      path: "/employee/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Attendance",
      path: "/employee/attendance",
      icon: CalendarCheck,
    },
    {
      title: "Check In / Check Out",
      path: "/employee/check-in",
      icon: Clock3,
    },
    {
      title: "Leave Request",
      path: "/employee/leave-request",
      icon: CalendarDays,
    },
    {
      title: "Attendance History",
      path: "/employee/history",
      icon: History,
    },
  ];

  const accountItems = [
    {
      title: "Profile",
      path: "/employee/profile",
      icon: UserCircle,
    },
  ];

  return (
    <aside
      className={`employee-sidebar ${
        isOpen ? "employee-sidebar-open" : ""
      }`}
    >
      <div className="employee-sidebar-header">
        <div className="employee-sidebar-brand">
          <div className="employee-sidebar-logo">EA</div>

          <div className="employee-sidebar-brand-text">
            <h2>Employee</h2>
            <span>Attendance</span>
          </div>
        </div>

        <button
          className="employee-sidebar-close"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        >
          <X size={22} />
        </button>
      </div>

      <div className="employee-sidebar-content">
        <p className="employee-sidebar-section-title">
          MAIN MENU
        </p>

        <nav className="employee-sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `employee-sidebar-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>

        <p className="employee-sidebar-section-title employee-account-title">
          ACCOUNT
        </p>

        <nav className="employee-sidebar-menu">
          {accountItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `employee-sidebar-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="employee-sidebar-footer">
        <button
          className="employee-logout-button"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default EmployeeSidebar;