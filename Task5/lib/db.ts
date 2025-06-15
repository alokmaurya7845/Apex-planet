import type { Employee, AttendanceRecord, LeaveApplication, PayrollRecord, Task } from "./types"

// Mock data for employees
const employees: Employee[] = [
  {
    id: "emp001",
    name: "Rahul Sharma",
    email: "rahul@pharmacy.com",
    phone: "9876543210",
    position: "Pharmacist",
    department: "Pharmacy",
    joiningDate: "2023-01-15",
    salary: 45000,
    shiftStart: "09:00",
    shiftEnd: "17:00",
    isActive: true,
  },
  {
    id: "emp002",
    name: "Priya Patel",
    email: "priya@pharmacy.com",
    phone: "9876543211",
    position: "Cashier",
    department: "Sales",
    joiningDate: "2023-02-10",
    salary: 25000,
    shiftStart: "10:00",
    shiftEnd: "18:00",
    isActive: true,
  },
  {
    id: "emp003",
    name: "Amit Kumar",
    email: "amit@pharmacy.com",
    phone: "9876543212",
    position: "Store Manager",
    department: "Management",
    joiningDate: "2022-11-05",
    salary: 60000,
    shiftStart: "09:00",
    shiftEnd: "17:00",
    isActive: true,
  },
  {
    id: "emp004",
    name: "Neha Singh",
    email: "neha@pharmacy.com",
    phone: "9876543213",
    position: "Assistant",
    department: "Pharmacy",
    joiningDate: "2023-03-20",
    salary: 30000,
    shiftStart: "12:00",
    shiftEnd: "20:00",
    isActive: true,
  },
  {
    id: "emp005",
    name: "Vikram Mehta",
    email: "vikram@pharmacy.com",
    phone: "9876543214",
    position: "Delivery Person",
    department: "Logistics",
    joiningDate: "2023-04-05",
    salary: 22000,
    shiftStart: "10:00",
    shiftEnd: "18:00",
    isActive: true,
  },
]

// Generate today's date in YYYY-MM-DD format
const today = new Date().toISOString().split("T")[0]

// Mock data for attendance
const attendanceRecords: AttendanceRecord[] = [
  {
    id: "att001",
    employeeId: "emp001",
    date: today,
    checkIn: "09:05",
    checkOut: null,
    status: "present",
    workHours: null,
    isLate: true,
    hasOvertime: false,
    method: "manual",
    notes: "",
  },
  {
    id: "att002",
    employeeId: "emp002",
    date: today,
    checkIn: "10:00",
    checkOut: null,
    status: "present",
    workHours: null,
    isLate: false,
    hasOvertime: false,
    method: "manual",
    notes: "",
  },
  {
    id: "att003",
    employeeId: "emp003",
    date: today,
    checkIn: "08:55",
    checkOut: null,
    status: "present",
    workHours: null,
    isLate: false,
    hasOvertime: false,
    method: "manual",
    notes: "",
  },
  {
    id: "att004",
    employeeId: "emp004",
    date: today,
    checkIn: null,
    checkOut: null,
    status: "leave",
    workHours: null,
    isLate: false,
    hasOvertime: false,
    method: "manual",
    notes: "Sick leave",
  },
  {
    id: "att005",
    employeeId: "emp005",
    date: today,
    checkIn: "10:10",
    checkOut: null,
    status: "present",
    workHours: null,
    isLate: true,
    hasOvertime: false,
    method: "manual",
    notes: "Traffic delay",
  },
]

// Mock data for leave applications
const leaveApplications: LeaveApplication[] = [
  {
    id: "leave001",
    employeeId: "emp004",
    startDate: today,
    endDate: today,
    reason: "Feeling unwell",
    status: "approved",
    type: "sick",
    appliedOn: "2025-06-02",
    approvedBy: "emp003",
    approvedOn: "2025-06-02",
  },
  {
    id: "leave002",
    employeeId: "emp001",
    startDate: "2025-06-10",
    endDate: "2025-06-12",
    reason: "Family function",
    status: "pending",
    type: "casual",
    appliedOn: "2025-06-01",
  },
  {
    id: "leave003",
    employeeId: "emp002",
    startDate: "2025-06-15",
    endDate: "2025-06-15",
    reason: "Personal work",
    status: "pending",
    type: "casual",
    appliedOn: "2025-06-02",
  },
]

// Mock data for payroll
const payrollRecords: PayrollRecord[] = [
  {
    id: "pay001",
    employeeId: "emp001",
    month: 5, // May
    year: 2025,
    baseSalary: 45000,
    daysWorked: 22,
    overtime: 5,
    overtimeAmount: 1500,
    bonus: 0,
    deductions: 0,
    tax: 2500,
    providentFund: 1800,
    netSalary: 42200,
    status: "paid",
    paymentMethod: "bank transfer",
    paymentReference: "TXN123456",
    paymentDate: "2025-05-31",
  },
  {
    id: "pay002",
    employeeId: "emp002",
    month: 5,
    year: 2025,
    baseSalary: 25000,
    daysWorked: 21,
    overtime: 0,
    overtimeAmount: 0,
    bonus: 1000,
    deductions: 500,
    tax: 1200,
    providentFund: 1000,
    netSalary: 23300,
    status: "paid",
    paymentMethod: "bank transfer",
    paymentReference: "TXN123457",
    paymentDate: "2025-05-31",
  },
  {
    id: "pay003",
    employeeId: "emp003",
    month: 5,
    year: 2025,
    baseSalary: 60000,
    daysWorked: 22,
    overtime: 0,
    overtimeAmount: 0,
    bonus: 5000,
    deductions: 0,
    tax: 3500,
    providentFund: 2400,
    netSalary: 59100,
    status: "paid",
    paymentMethod: "bank transfer",
    paymentReference: "TXN123458",
    paymentDate: "2025-05-31",
  },
]

// Mock data for tasks
const tasks: Task[] = [
  {
    id: "task001",
    title: "Inventory check for antibiotics",
    description: "Count and verify all antibiotic medications in stock",
    assignedTo: "emp001",
    createdBy: "emp003",
    createdAt: "2025-06-01",
    dueDate: "2025-06-03",
    priority: "high",
    status: "in-progress",
    category: "inventory",
  },
  {
    id: "task002",
    title: "Clean display shelves",
    description: "Clean and organize all front display shelves",
    assignedTo: "emp002",
    createdBy: "emp003",
    createdAt: "2025-06-01",
    dueDate: "2025-06-03",
    priority: "medium",
    status: "todo",
    category: "maintenance",
  },
  {
    id: "task003",
    title: "Update price labels",
    description: "Update price labels for newly arrived products",
    assignedTo: "emp005",
    createdBy: "emp003",
    createdAt: "2025-06-02",
    dueDate: "2025-06-03",
    priority: "medium",
    status: "todo",
    category: "inventory",
  },
  {
    id: "task004",
    title: "Call suppliers for pending orders",
    description: "Follow up with suppliers regarding pending orders",
    assignedTo: "emp003",
    createdBy: "emp003",
    createdAt: "2025-06-01",
    dueDate: "2025-06-03",
    priority: "high",
    status: "todo",
    category: "procurement",
  },
  {
    id: "task005",
    title: "Prepare monthly sales report",
    description: "Compile and analyze sales data for May 2025",
    assignedTo: "emp003",
    createdBy: "emp003",
    createdAt: "2025-06-01",
    dueDate: "2025-06-05",
    priority: "medium",
    status: "in-progress",
    category: "reporting",
  },
]

// Mock database service
class MockDatabase {
  // Employee methods
  async getEmployees(): Promise<Employee[]> {
    return [...employees]
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    return employees.find((emp) => emp.id === id)
  }

  async addEmployee(employee: Omit<Employee, "id">): Promise<Employee> {
    const newEmployee = {
      ...employee,
      id: `emp${String(employees.length + 1).padStart(3, "0")}`,
    }
    employees.push(newEmployee)
    return newEmployee
  }

  async updateEmployee(id: string, data: Partial<Employee>): Promise<Employee | undefined> {
    const index = employees.findIndex((emp) => emp.id === id)
    if (index !== -1) {
      employees[index] = { ...employees[index], ...data }
      return employees[index]
    }
    return undefined
  }

  // Attendance methods
  async getAttendanceRecords(date?: string): Promise<AttendanceRecord[]> {
    if (date) {
      return attendanceRecords.filter((record) => record.date === date)
    }
    return [...attendanceRecords]
  }

  async getEmployeeAttendance(employeeId: string, date?: string): Promise<AttendanceRecord[]> {
    if (date) {
      return attendanceRecords.filter((record) => record.employeeId === employeeId && record.date === date)
    }
    return attendanceRecords.filter((record) => record.employeeId === employeeId)
  }

  async markAttendance(record: Omit<AttendanceRecord, "id">): Promise<AttendanceRecord> {
    const newRecord = {
      ...record,
      id: `att${String(attendanceRecords.length + 1).padStart(3, "0")}`,
    }
    attendanceRecords.push(newRecord)
    return newRecord
  }

  async updateAttendance(id: string, data: Partial<AttendanceRecord>): Promise<AttendanceRecord | undefined> {
    const index = attendanceRecords.findIndex((record) => record.id === id)
    if (index !== -1) {
      attendanceRecords[index] = { ...attendanceRecords[index], ...data }
      return attendanceRecords[index]
    }
    return undefined
  }

  // Leave application methods
  async getLeaveApplications(status?: string): Promise<LeaveApplication[]> {
    if (status) {
      return leaveApplications.filter((leave) => leave.status === status)
    }
    return [...leaveApplications]
  }

  async getEmployeeLeaves(employeeId: string): Promise<LeaveApplication[]> {
    return leaveApplications.filter((leave) => leave.employeeId === employeeId)
  }

  async applyLeave(application: Omit<LeaveApplication, "id">): Promise<LeaveApplication> {
    const newApplication = {
      ...application,
      id: `leave${String(leaveApplications.length + 1).padStart(3, "0")}`,
    }
    leaveApplications.push(newApplication)
    return newApplication
  }

  async updateLeaveStatus(
    id: string,
    status: "approved" | "rejected",
    approvedBy: string,
  ): Promise<LeaveApplication | undefined> {
    const index = leaveApplications.findIndex((leave) => leave.id === id)
    if (index !== -1) {
      leaveApplications[index] = {
        ...leaveApplications[index],
        status,
        approvedBy,
        approvedOn: new Date().toISOString().split("T")[0],
      }
      return leaveApplications[index]
    }
    return undefined
  }

  // Payroll methods
  async getPayrollRecords(month?: number, year?: number): Promise<PayrollRecord[]> {
    if (month && year) {
      return payrollRecords.filter((record) => record.month === month && record.year === year)
    }
    return [...payrollRecords]
  }

  async getEmployeePayroll(employeeId: string): Promise<PayrollRecord[]> {
    return payrollRecords.filter((record) => record.employeeId === employeeId)
  }

  async createPayroll(record: Omit<PayrollRecord, "id">): Promise<PayrollRecord> {
    const newRecord = {
      ...record,
      id: `pay${String(payrollRecords.length + 1).padStart(3, "0")}`,
    }
    payrollRecords.push(newRecord)
    return newRecord
  }

  async updatePayrollStatus(
    id: string,
    status: "draft" | "processed" | "paid",
    paymentDetails?: { method: string; reference: string },
  ): Promise<PayrollRecord | undefined> {
    const index = payrollRecords.findIndex((record) => record.id === id)
    if (index !== -1) {
      payrollRecords[index] = {
        ...payrollRecords[index],
        status,
        ...(paymentDetails && {
          paymentMethod: paymentDetails.method,
          paymentReference: paymentDetails.reference,
          paymentDate: new Date().toISOString().split("T")[0],
        }),
      }
      return payrollRecords[index]
    }
    return undefined
  }

  // Task methods
  async getTasks(status?: string): Promise<Task[]> {
    if (status) {
      return tasks.filter((task) => task.status === status)
    }
    return [...tasks]
  }

  async getEmployeeTasks(employeeId: string): Promise<Task[]> {
    return tasks.filter(
      (task) =>
        task.assignedTo === employeeId || (Array.isArray(task.assignedTo) && task.assignedTo.includes(employeeId)),
    )
  }

  async createTask(task: Omit<Task, "id">): Promise<Task> {
    const newTask = {
      ...task,
      id: `task${String(tasks.length + 1).padStart(3, "0")}`,
    }
    tasks.push(newTask)
    return newTask
  }

  async updateTaskStatus(
    id: string,
    status: "todo" | "in-progress" | "done",
    completedBy?: string,
  ): Promise<Task | undefined> {
    const index = tasks.findIndex((task) => task.id === id)
    if (index !== -1) {
      tasks[index] = {
        ...tasks[index],
        status,
        ...(status === "done" && {
          completedAt: new Date().toISOString(),
          completedBy,
        }),
      }
      return tasks[index]
    }
    return undefined
  }

  async updateTask(id: string, data: Partial<Task>): Promise<Task | undefined> {
    const index = tasks.findIndex((task) => task.id === id)
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...data }
      return tasks[index]
    }
    return undefined
  }
}

// Export database instance
export const db = new MockDatabase()
