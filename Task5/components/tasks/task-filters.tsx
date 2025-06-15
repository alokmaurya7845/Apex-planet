"use client"

import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Employee } from "@/lib/types"

interface TaskFiltersProps {
  selectedPriority: string
  selectedAssignee: string
  selectedCategory: string
  onPriorityChange: (priority: string) => void
  onAssigneeChange: (assignee: string) => void
  onCategoryChange: (category: string) => void
  employees: Employee[]
}

export function TaskFilters({
  selectedPriority,
  selectedAssignee,
  selectedCategory,
  onPriorityChange,
  onAssigneeChange,
  onCategoryChange,
  employees,
}: TaskFiltersProps) {
  const priorities = ["all", "low", "medium", "high", "urgent"]
  const categories = ["all", "inventory", "maintenance", "procurement", "reporting", "customer-service", "general"]

  return (
    <div className="flex flex-wrap gap-2">
      <Select value={selectedPriority} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          {priorities.map((priority) => (
            <SelectItem key={priority} value={priority}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedAssignee} onValueChange={onAssigneeChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Assignee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Employees</SelectItem>
          {employees.map((employee) => (
            <SelectItem key={employee.id} value={employee.id}>
              {employee.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" size="sm">
        <Filter className="mr-2 h-4 w-4" />
        More Filters
      </Button>
    </div>
  )
}
