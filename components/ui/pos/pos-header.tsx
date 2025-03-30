"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Wifi, Bell, User, ChevronDown, Menu } from "lucide-react"
import Link from "next/link"

interface POSHeaderProps {
  selectedTable: string | null
}

export function POSHeader({ selectedTable }: POSHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [userName, setUserName] = useState("Bizer Alex")

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-amber-600">Bistro</span>
          <span className="text-lg font-semibold text-slate-800">American Coffee</span>
        </div>

        <div className="ml-4 flex items-center space-x-1">
          <Button variant="outline" size="sm" className="h-8 border-slate-200 bg-slate-50 font-medium text-slate-700">
            Open <ChevronDown className="ml-1 h-4 w-4 text-slate-500" />
          </Button>
        </div>

        <div className="ml-2 flex items-center space-x-1">
          <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:bg-slate-100 hover:text-slate-900">
            <Link href="/admin/tables">
              <span className="flex items-center">Dashboard</span>
            </Link>
          </Button>

          <Button variant="ghost" size="sm" className="flex items-center bg-slate-100 text-slate-900">
            <Menu className="mr-1 h-4 w-4" />
            Menu
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="text-sm font-medium text-slate-600">
          {formattedDate} · {formattedTime}
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:bg-slate-100 hover:text-slate-900">
          <RefreshCw className="h-4 w-4" />
        </Button>

        <div className="flex items-center space-x-3">
          <Wifi className="h-4 w-4 text-green-500" />
          <Bell className="h-4 w-4 text-slate-400" />
        </div>

        <div className="flex items-center space-x-2 rounded-full bg-slate-50 px-3 py-1.5">
          <User className="h-4 w-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">{userName}</span>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </div>
      </div>
    </header>
  )
}

