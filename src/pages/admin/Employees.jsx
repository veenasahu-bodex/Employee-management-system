import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Users,
  UserCheck,
  UserX,
  Plus,
  Search,
  Trash2,
  Eye,
  X,
} from "lucide-react";

import api from "../../services/api";

import "./Employees.css";

const Employees = () => {
  const { user } = useSelector((state) => state.auth);

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    employeeId: "",
    phone: "",
    department: "",
    designation: "",
    joiningDate: "",
    role: "employee",
  });


  // ========================================
  // GET EMPLOYEES
  // ========================================

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found.");
        return;
      }

      const data = await api.getEmployees(token);

      setEmployees(data.employees || []);
    } catch (error) {
      console.error(error);

      setError(
        error.message || "Failed to load employees."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchEmployees();
  }, []);


  // ========================================
  // FORM CHANGE
  // ========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // ========================================
  // CREATE EMPLOYEE
  // ========================================

  const handleCreateEmployee = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const data = await api.createEmployee(
        formData,
        token
      );

      alert(data.message);

      setShowAddModal(false);

      setFormData({
        name: "",
        email: "",
        password: "",
        employeeId: "",
        phone: "",
        department: "",
        designation: "",
        joiningDate: "",
        role: "employee",
      });

      fetchEmployees();
    } catch (error) {
      alert(
        error.message || "Failed to create employee."
      );
    }
  };


  // ========================================
  // DELETE EMPLOYEE
  // ========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const data = await api.deleteEmployee(
        id,
        token
      );

      alert(data.message);

      fetchEmployees();
    } catch (error) {
      alert(
        error.message || "Failed to delete employee."
      );
    }
  };


  // ========================================
  // SEARCH
  // ========================================

  const filteredEmployees = employees.filter(
    (employee) => {
      const searchText = search.toLowerCase();

      return (
        employee.name
          ?.toLowerCase()
          .includes(searchText) ||
        employee.email
          ?.toLowerCase()
          .includes(searchText) ||
        employee.employeeId
          ?.toLowerCase()
          .includes(searchText) ||
        employee.department
          ?.toLowerCase()
          .includes(searchText)
      );
    }
  );


  // ========================================
  // STATS
  // ========================================

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) => employee.status === "active"
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) => employee.status === "inactive"
  ).length;


  return (
    <div className="employees-page">

      {/* HEADER */}

      <div className="employees-header">

        <div>
          <h1>Employees</h1>
          <p>
            Manage employees and their information.
          </p>
        </div>

        <button
          className="add-employee-button"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} />
          Add Employee
        </button>

      </div>


      {/* STATS */}

      <div className="employee-stats">

        <div className="employee-stat-card">
          <div className="employee-stat-icon blue">
            <Users size={21} />
          </div>

          <div>
            <span>Total Employees</span>
            <strong>{totalEmployees}</strong>
          </div>
        </div>


        <div className="employee-stat-card">
          <div className="employee-stat-icon green">
            <UserCheck size={21} />
          </div>

          <div>
            <span>Active Employees</span>
            <strong>{activeEmployees}</strong>
          </div>
        </div>


        <div className="employee-stat-card">
          <div className="employee-stat-icon red">
            <UserX size={21} />
          </div>

          <div>
            <span>Inactive Employees</span>
            <strong>{inactiveEmployees}</strong>
          </div>
        </div>

      </div>


      {/* SEARCH */}

      <div className="employees-toolbar">

        <div className="employee-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

      </div>


      {/* ERROR */}

      {error && (
        <div className="employees-error">
          {error}
        </div>
      )}


      {/* TABLE */}

      <div className="employees-table-card">

        {loading ? (
          <div className="employees-loading">
            Loading employees...
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="employees-empty">
            <Users size={40} />

            <h3>No employees found</h3>

            <p>
              Add your first employee to get started.
            </p>
          </div>
        ) : (

          <div className="employees-table-wrapper">

            <table className="employees-table">

              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>


              <tbody>

                {filteredEmployees.map(
                  (employee) => (

                    <tr key={employee._id}>

                      <td>
                        <div className="employee-name-cell">

                          <div className="employee-avatar">
                            {employee.name
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {employee.name}
                            </strong>

                            <small>
                              {employee.phone || "No phone"}
                            </small>
                          </div>

                        </div>
                      </td>


                      <td>
                        {employee.employeeId || "-"}
                      </td>


                      <td>
                        {employee.department || "-"}
                      </td>


                      <td>
                        {employee.designation || "-"}
                      </td>


                      <td>
                        {employee.email}
                      </td>


                      <td>

                        <span
                          className={`employee-status ${
                            employee.status
                          }`}
                        >
                          {employee.status}
                        </span>

                      </td>


                      <td>

                        <div className="employee-actions">

                          <button
                            title="View"
                            onClick={() =>
                              setSelectedEmployee(
                                employee
                              )
                            }
                          >
                            <Eye size={16} />
                          </button>


                          {employee._id !== user?.id && (
                            <button
                              className="delete-action"
                              title="Delete"
                              onClick={() =>
                                handleDelete(
                                  employee._id
                                )
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>


      {/* ADD EMPLOYEE MODAL */}

      {showAddModal && (

        <div className="employee-modal-overlay">

          <div className="employee-modal">

            <div className="employee-modal-header">

              <div>
                <h2>Add Employee</h2>
                <p>
                  Create a new employee account.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowAddModal(false)
                }
              >
                <X size={20} />
              </button>

            </div>


            <form
              onSubmit={handleCreateEmployee}
              className="employee-form"
            >

              <div className="form-row">

                <div className="employee-form-group">
                  <label>Name</label>

                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Employee name"
                    required
                  />
                </div>


                <div className="employee-form-group">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="employee@company.com"
                    required
                  />
                </div>

              </div>


              <div className="form-row">

                <div className="employee-form-group">
                  <label>Password</label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    minLength={6}
                    required
                  />
                </div>


                <div className="employee-form-group">
                  <label>Employee ID</label>

                  <input
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="EMP001"
                  />
                </div>

              </div>


              <div className="form-row">

                <div className="employee-form-group">
                  <label>Phone</label>

                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                  />
                </div>


                <div className="employee-form-group">
                  <label>Department</label>

                  <input
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Development"
                  />
                </div>

              </div>


              <div className="form-row">

                <div className="employee-form-group">
                  <label>Designation</label>

                  <input
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="Software Developer"
                  />
                </div>


                <div className="employee-form-group">
                  <label>Joining Date</label>

                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                  />
                </div>

              </div>


              <div className="employee-form-group">
                <label>Role</label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="employee">
                    Employee
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>
              </div>


              <div className="employee-modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-employee-button"
                >
                  Create Employee
                </button>

              </div>

            </form>

          </div>

        </div>
      )}


      {/* VIEW EMPLOYEE MODAL */}

      {selectedEmployee && (

        <div className="employee-modal-overlay">

          <div className="employee-modal employee-details-modal">

            <div className="employee-modal-header">

              <div>
                <h2>Employee Details</h2>
                <p>
                  Employee information
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedEmployee(null)
                }
              >
                <X size={20} />
              </button>

            </div>


            <div className="employee-details">

              <div className="details-avatar">
                {selectedEmployee.name
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <h2>
                {selectedEmployee.name}
              </h2>

              <p>
                {selectedEmployee.designation ||
                  "Employee"}
              </p>


              <div className="details-grid">

                <div>
                  <span>Employee ID</span>
                  <strong>
                    {selectedEmployee.employeeId ||
                      "-"}
                  </strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>
                    {selectedEmployee.email}
                  </strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>
                    {selectedEmployee.phone ||
                      "-"}
                  </strong>
                </div>

                <div>
                  <span>Department</span>
                  <strong>
                    {selectedEmployee.department ||
                      "-"}
                  </strong>
                </div>

                <div>
                  <span>Role</span>
                  <strong>
                    {selectedEmployee.role}
                  </strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>
                    {selectedEmployee.status}
                  </strong>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Employees;