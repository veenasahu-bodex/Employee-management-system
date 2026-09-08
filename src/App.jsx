import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";

import Layout from "./components/Layout";
import EmployeeLayout from "./components/EmployeeLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Employees from "./pages/admin/Employees";
import Attendance from "./pages/admin/Attendance";
import Leaves from "./pages/admin/Leaves";
import Departments from "./pages/admin/Departments";
import Reports from "./pages/admin/Reports";
import Profile from "./pages/admin/Profile";

// Employee Pages
import EmployeeDashboard from "./pages/employee/Dashboard";
import MyAttendance from "./pages/employee/MyAttendance";
import LeaveRequest from "./pages/employee/LeaveRequest";
import AttendanceHistory from "./pages/employee/AttendanceHistory";
import EmployeeProfile from "./pages/employee/Profile";
import CheckInOut from "./pages/employee/CheckInOut";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<Layout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/employees" element={<Employees />} />
            <Route path="/admin/attendance" element={<Attendance />} />
            <Route path="/admin/leaves" element={<Leaves />} />
            <Route path="/admin/departments" element={<Departments />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Employee Routes */}
        <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
          <Route element={<EmployeeLayout />}>
            <Route
              path="/employee/dashboard"
              element={<EmployeeDashboard />}
            />
            <Route
              path="/employee/attendance"
              element={<MyAttendance />}
            />
            <Route
              path="/employee/leave-request"
              element={<LeaveRequest />}
            />

            <Route
               path="/employee/history"
               element={<AttendanceHistory />}
               />
               <Route
               path="/employee/profile"
               element={<EmployeeProfile />}
               />
               <Route
                path="/employee/check-in"
                element={<CheckInOut />}
                />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;