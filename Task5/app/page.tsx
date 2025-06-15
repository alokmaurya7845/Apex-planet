import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Calendar, DollarSign, CheckSquare, Users, BarChart } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Pharmacy Management Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Attendance Management Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Attendance Management
            </CardTitle>
            <CardDescription>Track employee attendance and leaves</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Present Today:</span>
                <span className="font-medium">12/15</span>
              </div>
              <div className="flex justify-between">
                <span>On Leave:</span>
                <span className="font-medium">2</span>
              </div>
              <div className="flex justify-between">
                <span>Pending Approvals:</span>
                <span className="font-medium text-amber-500">3</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/attendance" className="w-full">
              <Button className="w-full">Manage Attendance</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Payroll Management Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payroll Management
            </CardTitle>
            <CardDescription>Process and track employee salaries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Next Payroll:</span>
                <span className="font-medium">June 30, 2025</span>
              </div>
              <div className="flex justify-between">
                <span>Pending Approvals:</span>
                <span className="font-medium text-amber-500">2</span>
              </div>
              <div className="flex justify-between">
                <span>Last Month Total:</span>
                <span className="font-medium">₹125,000</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/payroll" className="w-full">
              <Button className="w-full">Manage Payroll</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Task Management Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Task Management
            </CardTitle>
            <CardDescription>Assign and track employee tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tasks Due Today:</span>
                <span className="font-medium text-red-500">5</span>
              </div>
              <div className="flex justify-between">
                <span>In Progress:</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span>Completed This Week:</span>
                <span className="font-medium text-green-500">12</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/tasks" className="w-full">
              <Button className="w-full">Manage Tasks</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
            <Users className="h-5 w-5" />
            <span>Manage Employees</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
            <Calendar className="h-5 w-5" />
            <span>Mark Attendance</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
            <CheckSquare className="h-5 w-5" />
            <span>Add New Task</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
            <BarChart className="h-5 w-5" />
            <span>View Reports</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
