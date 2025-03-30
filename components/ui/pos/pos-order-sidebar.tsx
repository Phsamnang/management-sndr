"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, Minus, Plus, Trash2, Receipt } from "lucide-react"
import type { POSOrderItem } from "@/components/pos/pos-interface"
import type { TableData } from "@/components/admin/table-management"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface POSOrderSidebarProps {
  orderItems: POSOrderItem[]
  updateQuantity: (id: number, quantity: number) => void
  clearOrder: () => void
  selectedTable: string | null
  onTableSelect: (table: string | null) => void
}

export function POSOrderSidebar({
  orderItems,
  updateQuantity,
  clearOrder,
  selectedTable,
  onTableSelect,
}: POSOrderSidebarProps) {
  const [tables, setTables] = useState<TableData[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [discount, setDiscount] = useState(0)

  // Load tables from localStorage
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

  // Calculate order totals
  const subtotal = orderItems.reduce((total, item) => {
    return total + item.priceValue * item.quantity
  }, 0)

  const discountAmount = (subtotal * discount) / 100
  const taxRate = 0.12 // 12%
  const taxAmount = (subtotal - discountAmount) * taxRate
  const total = subtotal - discountAmount + taxAmount

  const handlePayNow = () => {
    if (!selectedTable) {
      alert("Please select a table first")
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      clearOrder()
      alert(`Order for Table ${selectedTable} has been processed!`)
    }, 1500)
  }

  const handleOpenBill = () => {
    if (!selectedTable) {
      alert("Please select a table first")
      return
    }

    alert(`Bill opened for Table ${selectedTable}`)
  }

  return (
    <div className="flex w-[320px] flex-col border-l border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-4">
        <h2 className="text-lg font-semibold text-slate-800">Order Details</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {orderItems.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center text-center">
            <Receipt className="mb-3 h-10 w-10 text-slate-200" />
            <p className="font-medium text-slate-600">No items in order</p>
            <p className="mt-1 text-sm text-slate-500">Add items from the menu</p>
          </div>
        ) : (
          <div className="space-y-5">
            {orderItems.map((item) => (
              <div key={item.id} className="border-b border-slate-100 pb-4 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">{item.name}</span>
                  <span className="font-semibold text-slate-900">${(item.priceValue * item.quantity).toFixed(2)}</span>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <button
                    className="rounded-full border border-slate-200 p-1 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center font-medium text-slate-700">{item.quantity}</span>
                  <button
                    className="rounded-full border border-slate-200 p-1 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <button
                    className="ml-2 rounded-full p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                    onClick={() => updateQuantity(item.id, 0)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 bg-slate-50 p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Sub Total</span>
            <span className="font-medium text-slate-800">${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Discount</span>
            <span className="font-medium text-slate-800">${discountAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Tax 12%</span>
            <span className="font-medium text-slate-800">${taxAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between pt-2 text-base font-bold">
            <span className="text-slate-800">Total Payment</span>
            <span className="text-slate-900">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-4">
          <Button
            variant="outline"
            className="flex w-full justify-between border-slate-200 text-slate-700 hover:bg-slate-100"
            onClick={() => setDiscount(discount === 0 ? 10 : 0)}
          >
            <span>Add Discount</span>
            <ChevronRight className="h-4 w-4 text-slate-500" />
          </Button>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-700">Select Table</span>
            <Select value={selectedTable || ""} onValueChange={(value) => onTableSelect(value || null)}>
              <SelectTrigger className="w-[180px] border-slate-200 bg-white">
                <SelectValue placeholder="Select table" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_table">No table</SelectItem>
                {tables.map((table) => (
                  <SelectItem
                    key={table.id}
                    value={table.name}
                    disabled={table.status === "occupied" && table.name !== selectedTable}
                  >
                    {table.name} ({table.section})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            className="border border-amber-200 bg-amber-50 font-medium text-amber-800 hover:bg-amber-100"
            disabled={orderItems.length === 0 || !selectedTable || isProcessing}
            onClick={handleOpenBill}
            variant="outline"
          >
            Open Bill
          </Button>
          <Button
            className="bg-amber-500 font-medium text-white hover:bg-amber-600"
            disabled={orderItems.length === 0 || !selectedTable || isProcessing}
            onClick={handlePayNow}
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </Button>
        </div>
      </div>
    </div>
  )
}

