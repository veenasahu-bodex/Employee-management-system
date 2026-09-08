import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stats: {
    employees: 120,
    present: 98,
    absent: 12,
    onLeave: 7,
    late: 3,
  },

  monthlyAttendance: [
    { month: "Jan", present: 95, absent: 10 },
    { month: "Feb", present: 102, absent: 8 },
    { month: "Mar", present: 98, absent: 12 },
    { month: "Apr", present: 105, absent: 7 },
    { month: "May", present: 110, absent: 5 },
    { month: "Jun", present: 108, absent: 9 },
    { month: "Jul", present: 115, absent: 6 },
    { month: "Aug", present: 112, absent: 8 },
    { month: "Sep", present: 98, absent: 12 },
  ],

  recentAttendance: [
    {
      id: 1,
      name: "Rahul Sharma",
      employeeId: "EMP001",
      department: "Development",
      checkIn: "08:52 AM",
      checkOut: "06:02 PM",
      status: "Present",
    },
    {
      id: 2,
      name: "Priya Verma",
      employeeId: "EMP002",
      department: "HR",
      checkIn: "09:18 AM",
      checkOut: "06:10 PM",
      status: "Late",
    },
    {
      id: 3,
      name: "Amit Kumar",
      employeeId: "EMP003",
      department: "Development",
      checkIn: "08:55 AM",
      checkOut: "05:58 PM",
      status: "Present",
    },
    {
      id: 4,
      name: "Neha Singh",
      employeeId: "EMP004",
      department: "Marketing",
      checkIn: "-",
      checkOut: "-",
      status: "Absent",
    },
    {
      id: 5,
      name: "Rohit Patel",
      employeeId: "EMP005",
      department: "Finance",
      checkIn: "08:48 AM",
      checkOut: "06:05 PM",
      status: "Present",
    },
  ],
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
});

export default dashboardSlice.reducer;