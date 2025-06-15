// Employee Types
export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  joiningDate: string
  salary: number
  shiftStart: string
  shiftEnd: string
  isActive: boolean
}

// Attendance Types
export interface AttendanceRecord {
  id: string
  employeeId: string
  date: string
  checkIn: string | null
  checkOut: string | null
  status: "present" | "absent" | "half-day" | "leave"
  workHours: number | null
  isLate: boolean
  hasOvertime: boolean
  method: "manual" | "qr" | "biometric" | "gps"
  notes: string
}

export interface LeaveApplication {
  id: string
  employeeId: string
  startDate: string
  endDate: string
  reason: string
  status: "pending" | "approved" | "rejected"
  type: "casual" | "sick" | "annual" | "unpaid"
  appliedOn: string
  approvedBy?: string
  approvedOn?: string
}

// Payroll Types
export interface PayrollRecord {
  id: string
  employeeId: string
  month: number
  year: number
  baseSalary: number
  daysWorked: number
  overtime: number
  overtimeAmount: number
  bonus: number
  deductions: number
  tax: number
  providentFund: number
  netSalary: number
  status: "draft" | "processed" | "paid"
  paymentMethod?: string
  paymentReference?: string
  paymentDate?: string
}

// Task Types
export interface Task {
  id: string
  title: string
  description: string
  assignedTo: string | string[]
  createdBy: string
  createdAt: string
  dueDate: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "todo" | "in-progress" | "done"
  category: string
  completedAt?: string
  completedBy?: string
}
