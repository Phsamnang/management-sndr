"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TableData } from "./table-management"

interface TableFormProps {
  onSubmit: (table: TableData| Omit<TableData, "id">) => void
  initialData?: TableData | null
  onCancel?: () => void
}

export function TableForm({ onSubmit, initialData, onCancel }: TableFormProps) {
  const [name, setName] = useState("")
  const [section, setSection] = useState("")
  const [seats, setSeats] = useState(4)
  const [status, setStatus] = useState<"available" | "occupied" | "reserved">("available")

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setSection(initialData.section)
      setSeats(initialData.seats)
      setStatus(initialData.status)
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const tableData = {
      ...(initialData ? { id: initialData.id } : {}),
      name,
      section,
      seats,
      status,
      ...(initialData?.x !== undefined && initialData?.y !== undefined ? { x: initialData.x, y: initialData.y } : {}),
    } as TableData

    onSubmit(tableData)

    // Reset form if not editing
    if (!initialData) {
      setName("")
      setSection("")
      setSeats(4)
      setStatus("available")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="name">Table Name/Number</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Table 1, Booth A, etc."
          required
        />
      </div>

      {/* <div className="space-y-2">
        <Label htmlFor="section">Section</Label>
        <Input
          id="section"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          placeholder="e.g., Window, Bar, Patio, etc."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="seats">Number of Seats</Label>
        <Input
          id="seats"
          type="number"
          min={1}
          max={20}
          value={seats}
          onChange={(e) => setSeats(Number.parseInt(e.target.value))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value) => setStatus(value as "available" | "occupied" | "reserved")}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="reserved">Reserved</SelectItem>
          </SelectContent>
        </Select>
      </div> */}

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600">
          {initialData ? "Update Table" : "Add Table"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

