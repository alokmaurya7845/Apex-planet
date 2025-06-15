"use client"

import { useState } from "react"
import { Download, FileText, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Employee, PayrollRecord } from "@/lib/types"

interface PayslipGeneratorProps {
  employees: Employee[]
  payrollRecords: PayrollRecord[]
  selectedMonth: number
  selectedYear: number
}

export function PayslipGenerator({ employees, payrollRecords, selectedMonth, selectedYear }: PayslipGeneratorProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<string>("")

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const selectedPayroll = payrollRecords.find((record) => record.employeeId === selectedEmployee)
  const employee = employees.find((emp) => emp.id === selectedEmployee)

  const handleDownloadPayslip = () => {
    if (!selectedPayroll || !employee) return

    // Create a printable payslip
    const payslipContent = `
      <html>
        <head>
          <title>Payslip - ${employee.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: bold; }
            .payslip-title { font-size: 18px; margin-top: 10px; }
            .employee-info { margin-bottom: 20px; }
            .salary-table { width: 100%; border-collapse: collapse; }
            .salary-table th, .salary-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .salary-table th { background-color: #f2f2f2; }
            .total-row { font-weight: bold; background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Pharmacy Management System</div>
            <div class="payslip-title">Salary Slip for ${months[selectedMonth - 1]} ${selectedYear}</div>
          </div>
          
          <div class="employee-info">
            <p><strong>Employee Name:</strong> ${employee.name}</p>
            <p><strong>Employee ID:</strong> ${employee.id}</p>
            <p><strong>Department:</strong> ${employee.department}</p>
            <p><strong>Position:</strong> ${employee.position}</p>
            <p><strong>Days Worked:</strong> ${selectedPayroll.daysWorked}</p>
          </div>

          <table class="salary-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Basic Salary</td>
                <td>${selectedPayroll.baseSalary.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Overtime (${selectedPayroll.overtime} hours)</td>
                <td>${selectedPayroll.overtimeAmount.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Bonus</td>
                <td>${selectedPayroll.bonus.toLocaleString()}</td>
              </tr>
              <tr class="total-row">
                <td>Gross Salary</td>
                <td>${(selectedPayroll.baseSalary + selectedPayroll.overtimeAmount + selectedPayroll.bonus).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Tax Deduction</td>
                <td>-${selectedPayroll.tax.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Provident Fund</td>
                <td>-${selectedPayroll.providentFund.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Other Deductions</td>
                <td>-${selectedPayroll.deductions.toLocaleString()}</td>
              </tr>
              <tr class="total-row">
                <td><strong>Net Salary</strong></td>
                <td><strong>${selectedPayroll.netSalary.toLocaleString()}</strong></td>
              </tr>
            </tbody>
          </table>
          
          <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
            Generated on ${new Date().toLocaleDateString()}
          </div>
        </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(payslipContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Generate Payslip</CardTitle>
          <CardDescription>Select an employee to generate their payslip</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Employee</label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name} - {emp.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPayroll && employee && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <h4 className="font-medium">Employee Details</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">Name:</span> {employee.name}
                  </p>
                  <p>
                    <span className="font-medium">Department:</span> {employee.department}
                  </p>
                  <p>
                    <span className="font-medium">Position:</span> {employee.position}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Salary Summary</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">Gross:</span> ₹
                    {(
                      selectedPayroll.baseSalary +
                      selectedPayroll.overtimeAmount +
                      selectedPayroll.bonus
                    ).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Deductions:</span> ₹
                    {(
                      selectedPayroll.tax +
                      selectedPayroll.providentFund +
                      selectedPayroll.deductions
                    ).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium text-green-600">Net Salary:</span> ₹
                    {selectedPayroll.netSalary.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleDownloadPayslip} className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" onClick={handleDownloadPayslip}>
                  <Printer className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Payslip History</CardTitle>
          <CardDescription>View and download previous payslips</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Month/Year</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollRecords.map((record) => {
                const emp = employees.find((e) => e.id === record.employeeId)
                return (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{emp?.name}</TableCell>
                    <TableCell>
                      {months[record.month - 1]} {record.year}
                    </TableCell>
                    <TableCell>₹{record.netSalary.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          record.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : record.status === "processed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                        }
                      >
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
