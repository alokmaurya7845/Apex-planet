"use client"

import { useState } from "react"
import { CalendarIcon, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function LeaveApplications() {
  const [date, setDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  // Mock leave applications
  const leaveApplications = [
    {
      id: "leave001",
      employeeName: "Neha Singh",
      startDate: "2025-06-03",
      endDate: "2025-06-03",
      reason: "Feeling unwell",
      status: "approved",
      type: "sick",
    },
    {
      id: "leave002",
      employeeName: "Rahul Sharma",
      startDate: "2025-06-10",
      endDate: "2025-06-12",
      reason: "Family function",
      status: "pending",
      type: "casual",
    },
    {
      id: "leave003",
      employeeName: "Priya Patel",
      startDate: "2025-06-15",
      endDate: "2025-06-15",
      reason: "Personal work",
      status: "pending",
      type: "casual",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Apply for Leave</CardTitle>
          <CardDescription>Submit a new leave application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Leave Type</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">Casual Leave</SelectItem>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="annual">Annual Leave</SelectItem>
                <SelectItem value="unpaid">Unpaid Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Reason</label>
            <Textarea placeholder="Please provide a reason for your leave" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Submit Application</Button>
        </CardFooter>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Leave Applications</CardTitle>
          <CardDescription>Manage and track leave requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveApplications.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell className="font-medium">{leave.employeeName}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        leave.type === "sick"
                          ? "bg-red-100 text-red-800"
                          : leave.type === "casual"
                            ? "bg-blue-100 text-blue-800"
                            : leave.type === "annual"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800",
                      )}
                    >
                      {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {leave.startDate === leave.endDate ? leave.startDate : `${leave.startDate} to ${leave.endDate}`}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        leave.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : leave.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800",
                      )}
                    >
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {leave.status === "pending" && (
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
