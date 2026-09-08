import { useState } from "react";
import { Outlet } from "react-router-dom";

import EmployeeSidebar from "./EmployeeSidebar";
import EmployeeNavbar from "./EmployeeNavbar";

import "./EmployeeLayout.css";

const EmployeeLayout = () => {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="employee-layout">

      {/* SIDEBAR */}

      <EmployeeSidebar
        isOpen={sidebarOpen}
        closeSidebar={closeSidebar}
      />


      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="employee-sidebar-overlay"
          onClick={closeSidebar}
        />
      )}


      {/* MAIN AREA */}

      <div className="employee-main">

        <EmployeeNavbar
          openSidebar={openSidebar}
        />

        <main className="employee-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default EmployeeLayout;