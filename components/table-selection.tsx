"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface TableSelectionProps {
  onSelectTable: (tableNumber: string | null) => void
  selectedTable: string | null
  onConfirm?: (tableNumber: string) => void
}

export function TableSelection({ onSelectTable, selectedTable, onConfirm }: TableSelectionProps) {
  // Tables layout configuration
  const tables = {
    window: ["1", "2", "3", "4", "5"],
    center: ["6", "7", "8", "9", "10"],
    bar: ["11", "12", "13", "14"],
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 text-sm font-medium text-gray-500">Window Tables</div>
        <div className="flex flex-wrap gap-2">
          {tables.window.map((table) => (
            <TableButton
              key={table}
              number={table}
              isSelected={selectedTable === table}
              onClick={() => onSelectTable(table)}
            />
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 text-sm font-medium text-gray-500">Center Tables</div>
        <div className="flex flex-wrap gap-2">
          {tables.center.map((table) => (
            <TableButton
              key={table}
              number={table}
              isSelected={selectedTable === table}
              onClick={() => onSelectTable(table)}
            />
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 text-sm font-medium text-gray-500">Bar Seating</div>
        <div className="flex flex-wrap gap-2">
          {tables.bar.map((table) => (
            <TableButton
              key={table}
              number={table}
              isSelected={selectedTable === table}
              onClick={() => onSelectTable(table)}
            />
          ))}
        </div>
      </div>

      {onConfirm && selectedTable && (
        <Button onClick={() => onConfirm(selectedTable)} className="mt-4 w-full bg-amber-500 hover:bg-amber-600">
          Confirm Table {selectedTable}
        </Button>
      )}
    </div>
  )
}

interface TableButtonProps {
  number: string
  isSelected: boolean
  onClick: () => void
}

function TableButton({ number, isSelected, onClick }: TableButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-md border text-sm font-medium transition-colors",
        isSelected
          ? "border-amber-500 bg-amber-50 text-amber-700"
          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
      )}
      onClick={onClick}
    >
      {number}
    </button>
  )
}

