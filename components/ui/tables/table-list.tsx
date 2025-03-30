"use client"


import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { TableData } from "./table-management"

interface TableListProps {
  tables: TableData[]
  onEdit: (table: TableData) => void
  onDelete: (id: string) => void
}

export function TableList({ tables, onEdit, onDelete }: TableListProps) {
  const [tableToDelete, setTableToDelete] = useState<string | null>(null)

  const handleDelete = () => {
    if (tableToDelete) {
      onDelete(tableToDelete)
      setTableToDelete(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500">Available</Badge>
      case "occupied":
        return <Badge className="bg-red-500">Occupied</Badge>
      case "reserved":
        return <Badge className="bg-blue-500">Reserved</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (tables.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">No tables have been created yet.</p>
        <p className="mt-2 text-sm text-gray-500">Use the "Add Table" tab to create your first table.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Seats</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tables.map((table) => (
            <TableRow key={table.id}>
              <TableCell className="font-medium">{table.name}</TableCell>
              <TableCell>{table.section}</TableCell>
              <TableCell>{table.seats}</TableCell>
              <TableCell>{getStatusBadge(table.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(table)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog
                    open={tableToDelete === table.id}
                    onOpenChange={(open) => !open && setTableToDelete(null)}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => setTableToDelete(table.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Table</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {table.name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

