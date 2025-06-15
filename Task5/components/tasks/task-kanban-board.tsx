"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Task, Employee } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TaskKanbanBoardProps {
  tasks: Task[]
  employees: Employee[]
  onTaskStatusChange: (taskId: string, newStatus: "todo" | "in-progress" | "done") => void
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void
}

export function TaskKanbanBoard({ tasks, employees, onTaskStatusChange, onTaskUpdate }: TaskKanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null)

  const todoTasks = tasks.filter((task) => task.status === "todo")
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress")
  const doneTasks = tasks.filter((task) => task.status === "done")

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, newStatus: "todo" | "in-progress" | "done") => {
    e.preventDefault()
    if (draggedTask) {
      onTaskStatusChange(draggedTask, newStatus)
      setDraggedTask(null)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const isOverdue = (dueDate: string, status: string) => {
    if (status === "done") return false
    const due = new Date(dueDate)
    const today = new Date()
    return due < today
  }

  const TaskCard = ({ task }: { task: Task }) => {
    const assignedEmployee = employees.find((emp) => emp.id === task.assignedTo)
    const overdue = isOverdue(task.dueDate, task.status)

    return (
      <Card
        className={cn("mb-3 cursor-move hover:shadow-md transition-shadow", overdue && "border-red-200 bg-red-50")}
        draggable
        onDragStart={() => handleDragStart(task.id)}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Task</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>

          <div className="flex items-center justify-between mb-3">
            <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {task.category}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span className={overdue ? "text-red-600 font-medium" : ""}>
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
              {overdue && <span className="ml-1 text-red-600">(Overdue)</span>}
            </div>

            {assignedEmployee && (
              <div className="flex items-center">
                <Avatar className="h-5 w-5 mr-1">
                  <AvatarFallback className="text-xs">
                    {assignedEmployee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs">{assignedEmployee.name.split(" ")[0]}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const KanbanColumn = ({
    title,
    tasks,
    status,
    color,
  }: {
    title: string
    tasks: Task[]
    status: "todo" | "in-progress" | "done"
    color: string
  }) => (
    <div className="flex-1">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={cn("w-3 h-3 rounded-full mr-2", color)} />
              {title}
            </div>
            <Badge variant="secondary" className="ml-2">
              {tasks.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[500px] p-4" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, status)}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {tasks.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-8">No tasks in this column</div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KanbanColumn title="To Do" tasks={todoTasks} status="todo" color="bg-blue-500" />
      <KanbanColumn title="In Progress" tasks={inProgressTasks} status="in-progress" color="bg-amber-500" />
      <KanbanColumn title="Done" tasks={doneTasks} status="done" color="bg-green-500" />
    </div>
  )
}
