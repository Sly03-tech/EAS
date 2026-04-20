"use client"

import { User } from "lucide-react"

interface HeaderProps {
  title?: string
  subtitle?: string
}

export function Header({ title = "EAS Portal", subtitle = "Delivery Tracking System" }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-[#e2e8f0]">
      <div>
        <h1 className="text-lg font-semibold text-[#0a1628]">{title}</h1>
        <p className="text-sm text-[#64748b]">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-[#64748b]">Welcome</span>
        <div className="w-8 h-8 bg-[#0a1628] rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-white" />
        </div>
      </div>
    </header>
  )
}
