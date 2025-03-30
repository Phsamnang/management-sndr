"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import type { CartItem } from "@/components/table-order-page"

interface TableCartProps {
  items: CartItem[]
  updateQuantity: (id: number, quantity: number) => void
  removeFromCart: (id: number) => void
  onCheckout: () => void
  tableNumber: string | null
}

export function TableCart({ items, updateQuantity, removeFromCart, onCheckout, tableNumber }: TableCartProps) {
  const subtotal = items.reduce((total, item) => {
    return total + item.priceValue * item.quantity
  }, 0)

  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Order</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">Your cart is empty</p>
          <p className="mt-2 text-center text-sm text-gray-500">Add items from the menu to start your order</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Order - Table {tableNumber}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start space-x-4">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-sm text-gray-500">{item.price} each</p>
              <div className="mt-1 flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-500 hover:text-red-600"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="text-right font-medium">${(item.priceValue * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="w-full space-y-1">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={onCheckout}>
          Review & Place Order
        </Button>
      </CardFooter>
    </Card>
  )
}

