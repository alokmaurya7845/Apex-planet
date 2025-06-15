"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Calendar, User, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { db } from "@/lib/db"
import type { Task, Employee } from "@/lib/types"
import { TaskKanbanBoard } from "@/components/tasks/task-kanban-board"
import { AddTaskDialog } from "@/components/tasks/add-task-dialog"
import { TaskFilters } from "@/components/tasks/task-filters"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [selectedAssignee, setSelectedAssignee] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    const loadData = async () => {
      try {
        const taskData = await db.getTasks()
        const employeeData = await db.getEmployees()
        setTasks(taskData)
        setEmployees(employeeData)
      } catch (error) {
        console.error("Failed to load task data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority
    const matchesAssignee = selectedAssignee === "all" || task.assignedTo === selectedAssignee
    const matchesCategory = selectedCategory === "all" || task.category === selectedCategory

    return matchesSearch && matchesPriority && matchesAssignee && matchesCategory
  })

  // Calculate task statistics
  const todoTasks = filteredTasks.filter((task) => task.status === "todo")
  const inProgressTasks = filteredTasks.filter((task) => task.status === "in-progress")
  const doneTasks = filteredTasks.filter((task) => task.status === "done")
  const overdueTasks = filteredTasks.filter((task) => {
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    return task.status !== "done" && dueDate < today
  })

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      await db.updateTask(taskId, updates)
      const updatedTasks = await db.getTasks()
      setTasks(updatedTasks)
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  const handleTaskStatusChange = async (taskId: string, newStatus: "todo" | "in-progress" | "done") => {
    try {
      await db.updateTaskStatus(taskId, newStatus, "current-user") // In real app, use actual user ID
      const updatedTasks = await db.getTasks()
      setTasks(updatedTasks)
    } catch (error) {
      console.error("Failed to update task status:", error)
    }
  }

  const handleAddTask = async (taskData: Omit<Task, "id" | "createdAt">) => {
    try {
      await db.createTask({
        ...taskData,
        createdAt: new Date().toISOString(),
      })
      const updatedTasks = await db.getTasks()
      setTasks(updatedTasks)
      setShowAddDialog(false)
    } catch (error) {
      console.error("Failed to create task:", error)
    }
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Task Management</h1>
          <p className="text-muted-foreground">Assign and track employee tasks</p>
        </div>

        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Task
        </Button>
      </div>

      {/* Task Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-500" />
              To Do
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todoTasks.length}</div>
            <p className="text-muted-foreground text-sm">pending tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <User className="mr-2 h-5 w-5 text-amber-500" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{inProgressTasks.length}</div>
            <p className="text-muted-foreground text-sm">active tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-green-500" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{doneTasks.length}</div>
            <p className="text-muted-foreground text-sm">finished tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overdueTasks.length}</div>
            <p className="text-muted-foreground text-sm">past due date</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <TaskFilters
          selectedPriority={selectedPriority}
          selectedAssignee={selectedAssignee}
          selectedCategory={selectedCategory}
          onPriorityChange={setSelectedPriority}
          onAssigneeChange={setSelectedAssignee}
          onCategoryChange={setSelectedCategory}
          employees={employees}
        />
      </div>

      {/* Kanban Board */}
      <TaskKanbanBoard
        tasks={filteredTasks}
        employees={employees}
        onTaskStatusChange={handleTaskStatusChange}
        onTaskUpdate={handleTaskUpdate}
      />

      {/* Add Task Dialog */}
      <AddTaskDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        employees={employees}
        onAddTask={handleAddTask}
      />
    </div>
  )
}
