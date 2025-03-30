"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { TableList } from "./table-list"
import { TableForm } from "./table-form"
import { TableLayout } from "./table-layout"

export interface TableData {
  id: string
  name: string
  section: string
  seats: number
  status: "available" | "occupied" | "reserved"
  x?: number
  y?: number
}

export function TableManagement() {
  const [tables, setTables] = useState<TableData[]>([])
  const [editingTable, setEditingTable] = useState<TableData | null>(null)

  // Load tables from localStorage on component mount
  useEffect(() => {
    const savedTables = localStorage.getItem("restaurantTables")
    if (savedTables) {
      try {
        setTables(JSON.parse(savedTables))
      } catch (e) {
        console.error("Error loading tables:", e)
      }
    }
  }, [])

  // Save tables to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("restaurantTables", JSON.stringify(tables))
  }, [tables])

  const handleAddTable = (table: Omit<TableData, "id">) => {
    const newTable: TableData = {
      ...table,
      id: Date.now().toString(),
    }

    setTables([...tables, newTable])
  }

  const handleUpdateTable = (updatedTable: TableData) => {
    setTables(tables.map((table) => (table.id === updatedTable.id ? updatedTable : table)))
    setEditingTable(null)
  }

  const handleDeleteTable = (id: string) => {
    setTables(tables.filter((table) => table.id !== id))
    if (editingTable?.id === id) {
      setEditingTable(null)
    }
  }

  const handleEditTable = (table: TableData) => {
    setEditingTable(table)
  }

  const handleCancelEdit = () => {
    setEditingTable(null)
  }

  const handleUpdateLayout = (updatedTables: TableData[]) => {
    setTables(updatedTables)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-amber-500 py-4 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-white hover:text-amber-100">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Main Menu
            </Link>
            <h1 className="ml-4 text-xl font-bold">Table Management</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="list">Table List</TabsTrigger>
            <TabsTrigger value="add">Add Table</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <TableList tables={tables} onEdit={handleEditTable} onDelete={handleDeleteTable} />
          </TabsContent>

          <TabsContent value="add" className="mt-6">
            <div className="mx-auto max-w-md">
              <h2 className="mb-4 text-xl font-bold">{editingTable ? "Edit Table" : "Add New Table"}</h2>
              <TableForm
                onSubmit={editingTable ? handleUpdateTable : handleAddTable}
                initialData={editingTable}
                onCancel={handleCancelEdit}
              />
            </div>
          </TabsContent>

          <TabsContent value="layout" className="mt-6">
            <TableLayout tables={tables} onUpdateLayout={handleUpdateLayout} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

