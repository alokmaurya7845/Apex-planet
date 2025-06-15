"use client"

import { useState, useEffect } from "react"
import { DollarSign, Download, FileText, Users, Calendar, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { db } from "@/lib/db"
import type { Employee, PayrollRecord } from "@/lib/types"
import { PayrollSummaryChart } from "@/components/payroll/payroll-summary-chart"
import { PayslipGenerator } from "@/components/payroll/payslip-generator"
import { useToast } from "@/components/ui/use-toast"

export default function PayrollPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadData = async () => {
      try {
        const employeeData = await db.getEmployees()
        const payrollData = await db.getPayrollRecords(selectedMonth, selectedYear)
        setEmployees(employeeData)
        setPayrollRecords(payrollData)
      } catch (error) {
        console.error("Failed to load payroll data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [selectedMonth, selectedYear])

  // Calculate payroll summary
  const totalPayroll = payrollRecords.reduce((sum, record) => sum + record.netSalary, 0)
  const processedCount = payrollRecords.filter(
    (record) => record.status === "processed" || record.status === "paid",
  ).length
  const paidCount = payrollRecords.filter((record) => record.status === "paid").length
  const pendingCount = employees.length - processedCount

  const handleGeneratePayroll = async () => {
    try {
      // Generate payroll for all employees based on attendance
      for (const employee of employees) {
        const existingRecord = payrollRecords.find((record) => record.employeeId === employee.id)
        if (!existingRecord) {
          // Get attendance data for the selected month
          const attendanceRecords = await db.getEmployeeAttendance(employee.id)
          const monthAttendance = attendanceRecords.filter((record) => {
            const recordDate = new Date(record.date)
            return recordDate.getMonth() + 1 === selectedMonth && recordDate.getFullYear() === selectedYear
          })

          const daysWorked = monthAttendance.filter((record) => record.status === "present").length
          const overtimeHours = monthAttendance.reduce((sum, record) => sum + (record.hasOvertime ? 2 : 0), 0)

          // Calculate salary components
          const baseSalary = employee.salary
          const overtimeAmount = overtimeHours * (baseSalary / 160) // Assuming 160 working hours per month
          const bonus = daysWorked >= 22 ? baseSalary * 0.1 : 0 // 10% bonus for full attendance
          const tax = (baseSalary + overtimeAmount + bonus) * 0.1 // 10% tax
          const providentFund = baseSalary * 0.12 // 12% PF
          const netSalary = baseSalary + overtimeAmount + bonus - tax - providentFund

          await db.createPayroll({
            employeeId: employee.id,
            month: selectedMonth,
            year: selectedYear,
            baseSalary,
            daysWorked,
            overtime: overtimeHours,
            overtimeAmount,
            bonus,
            deductions: 0,
            tax,
            providentFund,
            netSalary,
            status: "draft",
          })
        }
      }

      // Reload data
      const updatedPayroll = await db.getPayrollRecords(selectedMonth, selectedYear)
      setPayrollRecords(updatedPayroll)

      toast({
        title: "Payroll Generated",
        description: "Payroll has been generated for all employees based on attendance data.",
      })
    } catch (error) {
      console.error("Failed to generate payroll:", error)
      toast({
        title: "Error",
        description: "Failed to generate payroll. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleProcessPayroll = async (recordId: string) => {
    try {
      await db.updatePayrollStatus(recordId, "processed")
      const updatedPayroll = await db.getPayrollRecords(selectedMonth, selectedYear)
      setPayrollRecords(updatedPayroll)

      toast({
        title: "Payroll Processed",
        description: "Payroll record has been processed successfully.",
      })
    } catch (error) {
      console.error("Failed to process payroll:", error)
    }
  }

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

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground">Process and track employee salaries</p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(Number.parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={(index + 1).toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number.parseInt(value))}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleGeneratePayroll}>
            <Calculator className="mr-2 h-4 w-4" />
            Generate Payroll
          </Button>
        </div>
      </div>

      {/* Payroll Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-green-500" />
              Total Payroll
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{totalPayroll.toLocaleString()}</div>
            <p className="text-muted-foreground text-sm">
              for {months[selectedMonth - 1]} {selectedYear}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-5 w-5 text-blue-500" />
              Processed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{processedCount}</div>
            <p className="text-muted-foreground text-sm">out of {employees.length} employees</p>
            <Progress value={(processedCount / employees.length) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5 text-purple-500" />
              Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{paidCount}</div>
            <p className="text-muted-foreground text-sm">payments completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-amber-500" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingCount}</div>
            <p className="text-muted-foreground text-sm">awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payslips">Payslips</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Records</CardTitle>
              <CardDescription>
                Showing payroll for {months[selectedMonth - 1]} {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Base Salary</TableHead>
                    <TableHead>Days Worked</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Bonus</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollRecords.map((record) => {
                    const employee = employees.find((emp) => emp.id === record.employeeId)
                    return (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{employee?.name}</TableCell>
                        <TableCell>₹{record.baseSalary.toLocaleString()}</TableCell>
                        <TableCell>{record.daysWorked}</TableCell>
                        <TableCell>₹{record.overtimeAmount.toLocaleString()}</TableCell>
                        <TableCell>₹{record.bonus.toLocaleString()}</TableCell>
                        <TableCell>₹{(record.tax + record.providentFund).toLocaleString()}</TableCell>
                        <TableCell className="font-medium">₹{record.netSalary.toLocaleString()}</TableCell>
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
                          <div className="flex space-x-2">
                            {record.status === "draft" && (
                              <Button size="sm" variant="outline" onClick={() => handleProcessPayroll(record.id)}>
                                Process
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payslips" className="mt-0">
          <PayslipGenerator
            employees={employees}
            payrollRecords={payrollRecords}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        </TabsContent>

        <TabsContent value="analytics" className="mt-0">
          <PayrollSummaryChart payrollRecords={payrollRecords} employees={employees} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
