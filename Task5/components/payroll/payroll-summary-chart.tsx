"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { PayrollRecord, Employee } from "@/lib/types"

interface PayrollSummaryChartProps {
  payrollRecords: PayrollRecord[]
  employees: Employee[]
}

export function PayrollSummaryChart({ payrollRecords, employees }: PayrollSummaryChartProps) {
  // Calculate totals
  const totalBaseSalary = payrollRecords.reduce((sum, record) => sum + record.baseSalary, 0)
  const totalOvertime = payrollRecords.reduce((sum, record) => sum + record.overtimeAmount, 0)
  const totalBonus = payrollRecords.reduce((sum, record) => sum + record.bonus, 0)
  const totalTax = payrollRecords.reduce((sum, record) => sum + record.tax, 0)
  const totalPF = payrollRecords.reduce((sum, record) => sum + record.providentFund, 0)
  const totalNet = payrollRecords.reduce((sum, record) => sum + record.netSalary, 0)

  const totalGross = totalBaseSalary + totalOvertime + totalBonus
  const totalDeductions = totalTax + totalPF

  // Department-wise breakdown
  const departmentBreakdown = employees.reduce(
    (acc, employee) => {
      const payroll = payrollRecords.find((record) => record.employeeId === employee.id)
      if (payroll) {
        if (!acc[employee.department]) {
          acc[employee.department] = { count: 0, total: 0 }
        }
        acc[employee.department].count += 1
        acc[employee.department].total += payroll.netSalary
      }
      return acc
    },
    {} as Record<string, { count: number; total: number }>,
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Salary Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Salary Breakdown</CardTitle>
          <CardDescription>Visual breakdown of salary components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Base Salary</span>
              <span>₹{totalBaseSalary.toLocaleString()}</span>
            </div>
            <Progress value={(totalBaseSalary / totalGross) * 100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overtime</span>
              <span>₹{totalOvertime.toLocaleString()}</span>
            </div>
            <Progress value={(totalOvertime / totalGross) * 100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Bonus</span>
              <span>₹{totalBonus.toLocaleString()}</span>
            </div>
            <Progress value={(totalBonus / totalGross) * 100} className="h-2" />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between font-medium">
              <span>Gross Total</span>
              <span>₹{totalGross.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-red-600">
              <span>Tax Deduction</span>
              <span>-₹{totalTax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-red-600">
              <span>Provident Fund</span>
              <span>-₹{totalPF.toLocaleString()}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Net Payroll</span>
              <span className="text-green-600">₹{totalNet.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Department-wise Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Department-wise Breakdown</CardTitle>
          <CardDescription>Payroll distribution by department</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(departmentBreakdown).map(([department, data]) => (
            <div key={department} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{department}</span>
                <span>{data.count} employees</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Payroll</span>
                <span className="font-medium">₹{data.total.toLocaleString()}</span>
              </div>
              <Progress value={(data.total / totalNet) * 100} className="h-2" />
            </div>
          ))}

          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{payrollRecords.length}</div>
                <div className="text-sm text-muted-foreground">Total Employees</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  ₹{Math.round(totalNet / payrollRecords.length).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Average Salary</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
