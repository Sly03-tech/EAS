"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileUp,
  ClipboardList,
  CheckCircle,
  History,
  Users,
  Settings,
  LogOut,
  FileBarChart,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Reports", href: "/dashboard/reports", icon: FileBarChart },
  { name: "File Import", href: "/dashboard/file-import", icon: FileUp },
  { name: "Delivery Assignment", href: "/dashboard/task-assignment", icon: ClipboardList },
  { name: "Delivery Verification", href: "/dashboard/verification", icon: CheckCircle },
  { name: "Delivery History", href: "/dashboard/account-history", icon: History },
  { name: "User Management", href: "/dashboard/users", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col bg-[#0a1628] text-white min-h-screen transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center gap-2 p-4 border-b border-[#1e3a5f]">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-[#1e3a5f]"
        >
          <Menu className="h-5 w-5" />
        </Button>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-sm text-white">
              EAS
            </div>
            <span className="font-semibold text-white">EAS</span>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                isActive
                  ? "bg-[#1e3a5f] border-l-4 border-red-500 text-white"
                  : "text-gray-300 hover:bg-[#1e3a5f] hover:text-white border-l-4 border-transparent"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-[#1e3a5f] p-4">
        <Link
          href="/"
          className="flex items-center gap-3 text-gray-300 hover:text-white text-sm"
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </aside>
  )
}
