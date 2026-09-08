
const API_URL = "http://localhost:5000/api";

const getToken = () => {
  return localStorage.getItem("token");
};

const request = async (
  endpoint,
  options = {}
) => {
  const token = getToken();

  const headers = {
    ...(options.body
      ? {
          "Content-Type":
            "application/json",
        }
      : {}),

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),

    ...(options.headers || {}),
  };

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Something went wrong."
    );
  }

  return data;
};

const api = {

  login: async (
    email,
    password
  ) => {
    return request(
      "/auth/login",
      {
        method: "POST",

        body: JSON.stringify({
          email,
          password,
        }),
      }
    );
  },


  register: async (
    userData
  ) => {
    return request(
      "/auth/register",
      {
        method: "POST",

        body: JSON.stringify(
          userData
        ),
      }
    );
  },


  getMe: async () => {
    return request(
      "/auth/me"
    );
  },

  getEmployees: async () => {
    return request(
      "/employees"
    );
  },


  getEmployee: async (
    employeeId
  ) => {
    return request(
      `/employees/${employeeId}`
    );
  },

  getMyProfile: async () => {
    return request(
      "/employees/me"
    );
  },

  createEmployee: async (
    employeeData
  ) => {
    return request(
      "/employees",
      {
        method: "POST",

        body: JSON.stringify(
          employeeData
        ),
      }
    );
  },


  deleteEmployee: async (
    employeeId
  ) => {
    return request(
      `/employees/${employeeId}`,
      {
        method: "DELETE",
      }
    );
  },

  // Employee Check In
  checkIn: async () => {
    return request(
      "/attendance/check-in",
      {
        method: "POST",
      }
    );
  },

  // Employee Check Out
  checkOut: async () => {
    return request(
      "/attendance/check-out",
      {
        method: "PUT",
      }
    );
  },

  // Employee Attendance
  getMyAttendance: async () => {
    return request(
      "/attendance/my"
    );
  },

  // Admin - All Attendance
  getAllAttendance: async () => {
    return request(
      "/attendance"
    );
  },
  
  // Admin Dashboard Stats
  getDashboardStats: async () => {
    return request(
      "/dashboard/stats"
    );
  },

  // Admin Monthly Attendance
  getMonthlyAttendance: async (
    year,
    month
  ) => {
    return request(
      `/dashboard/monthly?year=${year}&month=${month}`
    );
  },

  // Admin - All Leaves
  getAllLeaves: async () => {
    return request(
      "/leaves"
    );
  },

  // Employee - My Leaves
  getMyLeaves: async () => {
    return request(
      "/leaves/my"
    );
  },


  // Employee - Create Leave
  createLeave: async (
    leaveData
  ) => {
    return request(
      "/leaves",
      {
        method: "POST",

        body: JSON.stringify(
          leaveData
        ),
      }
    );
  },


  // Admin - Approve Leave
  approveLeave: async (
    leaveId
  ) => {
    return request(
      `/leaves/${leaveId}/approve`,
      {
        method: "PUT",
      }
    );
  },

  // Admin - Reject Leave
  rejectLeave: async (
    leaveId
  ) => {
    return request(
      `/leaves/${leaveId}/reject`,
      {
        method: "PUT",
      }
    );
  },
  // Get All Departments
  getDepartments: async () => {
    return request(
      "/departments"
    );
  },

  // Get Single Department
  getDepartment: async (
    departmentId
  ) => {
    return request(
      `/departments/${departmentId}`
    );
  },

  // Create Department
  createDepartment: async (
    departmentData
  ) => {
    return request(
      "/departments",
      {
        method: "POST",

        body: JSON.stringify(
          departmentData
        ),
      }
    );
  },

  // Update Department
  updateDepartment: async (
    departmentId,
    departmentData
  ) => {
    return request(
      `/departments/${departmentId}`,
      {
        method: "PUT",

        body: JSON.stringify(
          departmentData
        ),
      }
    );
  },

  // Delete Department
  deleteDepartment: async (
    departmentId
  ) => {
    return request(
      `/departments/${departmentId}`,
      {
        method: "DELETE",
      }
    );
  },

};
export default api;