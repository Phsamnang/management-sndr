"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { TableData } from "@/components/admin/table-management"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

interface TableLayoutProps {
  tables: TableData[]
  onUpdateLayout: (tables: TableData[]) => void
}

export function TableLayout({ tables, onUpdateLayout }: TableLayoutProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [layoutTables, setLayoutTables] = useState<TableData[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize layout tables with position data
  useEffect(() => {
    // Add default x,y coordinates for tables that don't have them
    const tablesWithPositions = tables.map((table) => {
      if (table.x === undefined || table.y === undefined) {
        // Assign random positions within the container
        return {
          ...table,
          x: Math.random() * 600,
          y: Math.random() * 400,
        }
      }
      return table
    })

    setLayoutTables(tablesWithPositions)
  }, [tables])

  const handleDragStart = (id: string) => {
    setDraggingId(id)
  }

  const handleDragMove = (e: React.MouseEvent, id: string) => {
    if (draggingId !== id || !containerRef.current) return

    const container = containerRef.current.getBoundingClientRect()
    const x = e.clientX - container.left
    const y = e.clientY - container.top

    // Update the position of the dragged table
    setLayoutTables((prevTables) => prevTables.map((table) => (table.id === id ? { ...table, x, y } : table)))
  }

  const handleDragEnd = () => {
    setDraggingId(null)
  }

  const handleSaveLayout = () => {
    onUpdateLayout(layoutTables)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 border-green-500"
      case "occupied":
        return "bg-red-100 border-red-500"
      case "reserved":
        return "bg-blue-100 border-blue-500"
      default:
        return "bg-gray-100 border-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Restaurant Layout</h2>
        <Button onClick={handleSaveLayout} className="bg-amber-500 hover:bg-amber-600">
          <Save className="mr-2 h-4 w-4" />
          Save Layout
        </Button>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-red-500"></div>
            <span className="text-sm">Occupied</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-blue-500"></div>
            <span className="text-sm">Reserved</span>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative h-[500px] w-full overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50"
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          {layoutTables.map((table) => (
            <div
              key={table.id}
              className={`absolute cursor-move select-none rounded-md border-2 p-2 shadow-sm ${getStatusColor(table.status)}`}
              style={{
                left: `${table.x}px`,
                top: `${table.y}px`,
                width: `${Math.max(80, table.seats * 15)}px`,
                height: `${Math.max(60, table.seats * 10)}px`,
                zIndex: draggingId === table.id ? 10 : 1,
              }}
              onMouseDown={() => handleDragStart(table.id)}
              onMouseMove={(e) => handleDragMove(e, table.id)}
            >
              <div className="text-center text-sm font-medium">{table.name}</div>
              <div className="text-center text-xs">{table.seats} seats</div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm text-gray-500">Drag tables to arrange them according to your restaurant layout.</p>
      </div>
    </div>
  )
}

