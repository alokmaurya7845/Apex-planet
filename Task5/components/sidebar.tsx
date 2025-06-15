"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, CheckSquare, Users, Settings, Home, Menu, X } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const routes = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Attendance", path: "/attendance", icon: Clock },
    { name: "Payroll", path: "/payroll", icon: DollarSign },
    { name: "Tasks", path: "/tasks", icon: CheckSquare },
    { name: "Employees", path: "/employees", icon: Users },
    { name: "Settings", path: "/settings", icon: Settings },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Pharmacy Manager</h2>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {routes.map((route) => {
              const Icon = route.icon
              return (
                <Link key={route.path} href={route.path} onClick={() => setIsOpen(false)}>
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      pathname === route.path
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {route.name}
                  </div>
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                A
              </div>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@pharmacy.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
