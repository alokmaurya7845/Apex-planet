"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function AttendanceCalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // This would be fetched from the database based on the selected date
  const selectedDateAttendance = [
    {
      id: "emp001",
      name: "Rahul Sharma",
      status: "present",
      checkIn: "09:05",
      checkOut: "17:10",
      workHours: 8.08,
      isLate: true,
    },
    {
      id: "emp002",
      name: "Priya Patel",
      status: "present",
      checkIn: "10:00",
      checkOut: "18:00",
      workHours: 8,
      isLate: false,
    },
    {
      id: "emp003",
      name: "Amit Kumar",
      status: "present",
      checkIn: "08:55",
      checkOut: "17:05",
      workHours: 8.17,
      isLate: false,
    },
    { id: "emp004", name: "Neha Singh", status: "leave", checkIn: null, checkOut: null, workHours: 0, isLate: false },
    {
      id: "emp005",
      name: "Vikram Mehta",
      status: "present",
      checkIn: "10:10",
      checkOut: "18:30",
      workHours: 8.33,
      isLate: true,
    },
  ]

  // Format the selected date for display
  const formattedDate = date
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date)
    : ""

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
          <CardDescription>View attendance for a specific date</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Attendance for {formattedDate}</CardTitle>
          <CardDescription>Showing attendance records for all employees</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedDateAttendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.name}</TableCell>
                  <TableCell>
                    {record.status === "present" ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Present</Badge>
                    ) : record.status === "absent" ? (
                      <Badge variant="destructive">Absent</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        On Leave
                      </Badge>
                    )}
                    {record.isLate && (
                      <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100">
                        Late
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{record.checkIn || "-"}</TableCell>
                  <TableCell>{record.checkOut || "-"}</TableCell>
                  <TableCell>{record.workHours > 0 ? record.workHours.toFixed(2) : "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
