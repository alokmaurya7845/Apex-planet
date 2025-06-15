"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Download, Filter, Search, UserCheck, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import type { AttendanceRecord, Employee } from "@/lib/types"
import { OfflineAttendanceMarker } from "@/components/attendance/offline-attendance-marker"
import { AttendanceCalendarView } from "@/components/attendance/attendance-calendar-view"
import { LeaveApplications } from "@/components/attendance/leave-applications"

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("daily")
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if we're offline
        if (typeof window !== "undefined") {
          setIsOffline(!navigator.onLine)
        }

        // Load employees and today's attendance
        const employeeData = await db.getEmployees()
        setEmployees(employeeData)

        const today = new Date().toISOString().split("T")[0]
        const attendanceData = await db.getAttendanceRecords(today)
        setTodayAttendance(attendanceData)
      } catch (error) {
        console.error("Failed to load attendance data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    // Set up online/offline listeners
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline)
      window.addEventListener("offline", handleOffline)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
      }
    }
  }, [])

  // Calculate attendance summary
  const presentCount = todayAttendance.filter((record) => record.status === "present").length
  const absentCount = todayAttendance.filter((record) => record.status === "absent").length
  const leaveCount = todayAttendance.filter((record) => record.status === "leave").length
  const lateCount = todayAttendance.filter((record) => record.isLate).length

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Attendance Management</h1>
          <p className="text-muted-foreground">Track and manage employee attendance</p>
        </div>

        <div className="flex items-center gap-2">
          {isOffline && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
              Offline Mode
            </Badge>
          )}
          <Button>
            <Clock className="mr-2 h-4 w-4" /> Check-In/Out
          </Button>
        </div>
      </div>

      {/* Attendance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <UserCheck className="mr-2 h-5 w-5 text-green-500" />
              Present
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{presentCount}</div>
            <p className="text-muted-foreground text-sm">out of {employees.length} employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <UserX className="mr-2 h-5 w-5 text-red-500" />
              Absent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{absentCount}</div>
            <p className="text-muted-foreground text-sm">out of {employees.length} employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-500" />
              On Leave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{leaveCount}</div>
            <p className="text-muted-foreground text-sm">approved leaves today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5 text-amber-500" />
              Late Arrivals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{lateCount}</div>
            <p className="text-muted-foreground text-sm">employees arrived late</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search employees..." className="pl-8" />
        </div>
        <Button variant="outline" className="sm:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline" className="sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="daily" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="daily">Daily View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-0">
          <OfflineAttendanceMarker employees={employees} todayAttendance={todayAttendance} />
        </TabsContent>

        <TabsContent value="calendar" className="mt-0">
          <AttendanceCalendarView />
        </TabsContent>

        <TabsContent value="leaves" className="mt-0">
          <LeaveApplications />
        </TabsContent>
      </Tabs>
    </div>
  )
}
