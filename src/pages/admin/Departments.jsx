import { useEffect, useState } from "react";

import {
  Building2,
  Plus,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  X,
} from "lucide-react";

import api from "../../services/api";
import "./Departments.css";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] =
    useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    manager: "",
  });

  const [saving, setSaving] = useState(false);

  // LOAD DEPARTMENTS
  const loadDepartments = async () => {
    try {
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const response =
        await api.getDepartments(token);
      setDepartments(
        response.departments || []
      );
    } catch (err) {
      console.error(
        "Departments Error:",
        err
      );

      setError(
        err.message ||
          "Failed to load departments."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // LOAD EMPLOYEES FOR MANAGER
  const loadEmployees = async () => {
    try {
      const token = localStorage.getItem("token");

      const response =
        await api.getEmployees(token);

      setEmployees(
        response.employees || []
      );
    } catch (err) {
      console.error(
        "Employees Error:",
        err
      );
    }
  };

  useEffect(() => {
    loadDepartments();
    loadEmployees();
  }, []);

  // REFRESH
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDepartments();
  };

  // FORM HANDLERS
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // OPEN ADD MODAL
  const handleAdd = () => {
    setEditingDepartment(null);

    setFormData({
      name: "",
      description: "",
      manager: "",
    });

    setShowModal(true);
    setError("");
  };

  // OPEN EDIT MODAL
  const handleEdit = (department) => {
    setEditingDepartment(department);

    setFormData({
      name: department.name || "",
      description:
        department.description || "",
      manager:
        department.manager?._id ||
        department.manager ||
        "",
    });

    setShowModal(true);
    setError("");
  };

  // CLOSE MODAL
  const handleCloseModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingDepartment(null);

    setFormData({
      name: "",
      description: "",
      manager: "",
    });
  };

  // CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError(
        "Department name is required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const token =
        localStorage.getItem("token");

      const payload = {
        name: formData.name.trim(),
        description:
          formData.description.trim(),
        manager:
          formData.manager || null,
      };

      if (editingDepartment) {
        await api.updateDepartment(
          editingDepartment._id,
          payload,
          token
        );
      } else {
        await api.createDepartment(
          payload,
          token
        );
      }

      handleCloseModal();

      await loadDepartments();
    } catch (err) {
      console.error(
        "Save Department Error:",
        err
      );

      setError(
        err.message ||
          "Failed to save department."
      );
    } finally {
      setSaving(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this department?"
    );

    if (!confirmDelete) return;

    try {
      setError("");

      const token =
        localStorage.getItem("token");

      await api.deleteDepartment(
        id,
        token
      );

      await loadDepartments();
    } catch (err) {
      console.error(
        "Delete Department Error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete department."
      );
    }
  };

  // SEARCH
  const filteredDepartments =
    departments.filter((department) => {
      const searchText =
        search.toLowerCase().trim();

      if (!searchText) return true;

      const name =
        department.name?.toLowerCase() || "";

      const description =
        department.description?.toLowerCase() ||
        "";

      const manager =
        department.manager?.name?.toLowerCase() ||
        "";

      return (
        name.includes(searchText) ||
        description.includes(searchText) ||
        manager.includes(searchText)
      );
    });

  // LOADING
  if (loading) {
    return (
      <div className="departments-page">
        <div className="departments-loading">
          <div className="loading-spinner"></div>

          <p>
            Loading departments...
          </p>
        </div>
      </div>
    );
  }

  // UI
  return (
    <div className="departments-page">

      {/* HEADER */}

      <div className="departments-header">

        <div>
          <h1>Departments</h1>

          <p>
            Manage company departments
            and their managers.
          </p>
        </div>

        <div className="departments-header-actions">

          <button
            className="departments-refresh"
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

          <button
            className="add-department-button"
            onClick={handleAdd}
          >
            <Plus size={18} />

            Add Department
          </button>

        </div>

      </div>

      {/* ERROR */}
      {error && (
        <div className="departments-error">
          {error}
        </div>
      )}

      {/* SEARCH */}
      <div className="departments-toolbar">

        <div className="department-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search departments..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="department-count">
          {filteredDepartments.length}{" "}
          department
          {filteredDepartments.length !== 1
            ? "s"
            : ""}
        </div>
      </div>

      {/* DEPARTMENT CARDS */}

      {filteredDepartments.length === 0 ? (
        <div className="departments-empty">
          <div className="empty-icon">
            <Building2 size={32} />
          </div>

          <h3>
            No departments found
          </h3>

          <p>
            {search
              ? "Try a different search."
              : "Create your first department to get started."}
          </p>

          {!search && (
            <button
              className="add-department-button"
              onClick={handleAdd}
            >
              <Plus size={18} />
              Add Department
            </button>
          )}

        </div>
      ) : (
        <div className="departments-grid">

          {filteredDepartments.map(
            (department) => (
              <div
                className="department-card"
                key={department._id}
              >

                <div className="department-card-top">

                  <div className="department-icon">
                    <Building2 size={24} />
                  </div>

                  <div className="department-actions">

                    <button
                      className="department-edit"
                      onClick={() =>
                        handleEdit(
                          department
                        )
                      }
                      title="Edit"
                    >
                      <Edit size={17} />
                    </button>
                    <button
                      className="department-delete"
                      onClick={() =>
                        handleDelete(
                          department._id
                        )
                      }
                      title="Delete"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                </div>

                <div className="department-card-content">
                  <h2>
                    {department.name}
                  </h2>

                  <p>
                    {department.description ||
                      "No description available."}
                  </p>
                </div>

                <div className="department-card-footer">
                  <span className="manager-label">
                    Manager
                  </span>
                  <div className="manager-info">
                    <div className="manager-avatar">
                      {department.manager?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "N"}
                    </div>
                    <div>
                      <strong>
                        {department.manager
                          ?.name ||
                          "Not assigned"}
                      </strong>
                      {department.manager
                        ?.designation && (
                        <span>
                          {
                            department
                              .manager
                              .designation
                          }
                        </span>
                      )}
                    </div>

                  </div>

                </div>

              </div>
            )
          )}

        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div
          className="department-modal-overlay"
          onClick={handleCloseModal}
        >

          <div
            className="department-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="department-modal-header">

              <div>
                <h2>
                  {editingDepartment
                    ? "Edit Department"
                    : "Add Department"}
                </h2>

                <p>
                  {editingDepartment
                    ? "Update department details."
                    : "Create a new company department."}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={
                  handleCloseModal
                }
                disabled={saving}
              >
                <X size={20} />
              </button>

            </div>

            <form
              className="department-form"
              onSubmit={handleSubmit}
            >

              <div className="form-group">

                <label>
                  Department Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Human Resources"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Enter department description..."
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  rows="4"
                />

              </div>

              <div className="form-group">

                <label>
                  Department Manager
                </label>

                <select
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                >

                  <option value="">
                    No Manager
                  </option>

                  {employees.map(
                    (employee) => (
                      <option
                        key={employee._id}
                        value={employee._id}
                      >
                        {employee.name}
                        {employee.designation
                          ? ` - ${employee.designation}`
                          : ""}
                      </option>
                    )
                  )}

                </select>

              </div>

              <div className="department-form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={
                    handleCloseModal
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingDepartment
                    ? "Update Department"
                    : "Create Department"}
                </button>

              </div>
            </form>
          </div>

        </div>
      )}

    </div>
  );
};

export default Departments;