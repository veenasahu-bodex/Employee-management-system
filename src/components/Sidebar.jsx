import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarDays,
  Building2,
  FileText,
  UserCircle,
  LogOut,
  X,
} from "lucide-react";

import { logout } from "../features/auth/authSlice";

import "./Sidebar.css";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

    // Redux logout
    dispatch(logout());

    // Close mobile sidebar
    if (closeSidebar) {
      closeSidebar();
    }

    // Redirect to login
    navigate("/login", { replace: true });
  };

  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Employees",
      path: "/admin/employees",
      icon: Users,
    },
    {
      title: "Attendance",
      path: "/admin/attendance",
      icon: CalendarCheck,
    },
    {
      title: "Leaves",
      path: "/admin/leaves",
      icon: CalendarDays,
    },
    {
      title: "Departments",
      path: "/admin/departments",
      icon: Building2,
    },
    {
      title: "Reports",
      path: "/admin/reports",
      icon: FileText,
    },
  ];

  const accountItems = [
    {
      title: "Profile",
      path: "/admin/profile",
      icon: UserCircle,
    },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>

      {/* =================================
          SIDEBAR HEADER
      ================================== */}

      <div className="sidebar-header">

        <div className="sidebar-brand">

          <div className="sidebar-logo">
            EA
          </div>

          <div className="sidebar-brand-text">
            <h2>Employee</h2>
            <span>Attendance</span>
          </div>

        </div>

        {/* Mobile Close Button */}
        <button
          className="sidebar-close"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        >
          <X size={22} />
        </button>

      </div>

      {/* =================================
          MAIN MENU
      ================================== */}

      <div className="sidebar-content">

        <p className="sidebar-section-title">
          MAIN MENU
        </p>

        <nav className="sidebar-menu">

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive ? "active" : ""
                  }`
                }
              >

                <Icon size={20} />

                <span>
                  {item.title}
                </span>

              </NavLink>
            );
          })}

        </nav>

        {/* =================================
            ACCOUNT
        ================================== */}

        <p className="sidebar-section-title account-title">
          ACCOUNT
        </p>

        <nav className="sidebar-menu">

          {accountItems.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive ? "active" : ""
                  }`
                }
              >

                <Icon size={20} />

                <span>
                  {item.title}
                </span>

              </NavLink>
            );
          })}

        </nav>

      </div>

      {/* =================================
          SIDEBAR FOOTER
      ================================== */}

      <div className="sidebar-footer">

        <button
          className="logout-button"
          onClick={handleLogout}
        >

          <LogOut size={20} />

          <span>
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
};

export default Sidebar;