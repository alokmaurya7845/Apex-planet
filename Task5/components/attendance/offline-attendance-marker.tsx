"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import type { AttendanceRecord, Employee } from "@/lib/types"
import { syncService } from "@/lib/sync-service"

interface OfflineAttendanceMarkerProps {
  employees: Employee[]
  todayAttendance: AttendanceRecord[]
}

export function OfflineAttendanceMarker({ employees, todayAttendance }: OfflineAttendanceMarkerProps) {
  const { toast } = useToast()
  const [attendance, setAttendance] = useState<Record<string, boolean>>(() => {
    // Initialize from today's attendance
    const initialState: Record<string, boolean> = {}
    employees.forEach((emp) => {
      const record = todayAttendance.find((rec) => rec.employeeId === emp.id)
      initialState[emp.id] = record ? record.status === "present" : false
    })
    return initialState
  })

  const handleToggleAttendance = (employeeId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [employeeId]: !prev[employeeId],
    }))
  }

  const handleSaveAttendance = () => {
    // In a real app, this would save to the database or queue for sync
    if (syncService) {
      Object.entries(attendance).forEach(([employeeId, isPresent]) => {
        const existingRecord = todayAttendance.find((rec) => rec.employeeId === employeeId)

        const today = new Date().toISOString().split("T")[0]
        const currentTime = new Date().toTimeString().split(" ")[0].substring(0, 5) // HH:MM format

        const attendanceData: Partial<AttendanceRecord> = {
          employeeId,
          date: today,
          status: isPresent ? "present" : "absent",
          checkIn: isPresent ? currentTime : null,
          checkOut: null,
          workHours: null,
          isLate: false, // This would be calculated based on shift times
          hasOvertime: false,
          method: "manual",
          notes: "Marked via offline attendance system",
        }

        syncService.storeAttendance(attendanceData, existingRecord ? "update" : "create")
      })
    }

    toast({
      title: "Attendance Saved",
      description: "The attendance has been saved and will sync when online.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Offline Attendance Marker</CardTitle>
        <CardDescription>Manually mark employees as present or absent</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Attendance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => {
              const isPresent = attendance[employee.id] || false
              return (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    {employee.shiftStart} - {employee.shiftEnd}
                  </TableCell>
                  <TableCell className="text-center">
                    {isPresent ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" /> Present
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <X className="h-3 w-3 mr-1" /> Absent
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch checked={isPresent} onCheckedChange={() => handleToggleAttendance(employee.id)} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSaveAttendance}>Save Attendance</Button>
        </div>
      </CardContent>
    </Card>
  )
}
