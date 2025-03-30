"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { TableSelection } from "@/components/table-selection"

interface CheckoutFormProps {
  total: string
  onCancel: () => void
}

export function CheckoutForm({ total, onCancel }: CheckoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [orderType, setOrderType] = useState<"delivery" | "dine-in">("delivery")
  const [selectedTable, setSelectedTable] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsComplete(true)
    }, 1500)
  }

  if (isComplete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="mb-4 text-green-600">Your order has been placed successfully.</p>
            <p className="text-gray-600">Order total: ${total}</p>
            {orderType === "dine-in" && selectedTable && <p className="mt-2 text-gray-600">Table: {selectedTable}</p>}
            <p className="mt-4 text-sm text-gray-500">
              {orderType === "delivery"
                ? "Your order will be delivered soon."
                : "Your order will be served to your table shortly."}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onCancel} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Checkout</CardTitle>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" placeholder="(123) 456-7890" required />
          </div>

          <div className="space-y-3">
            <Label>Order Type</Label>
            <RadioGroup
              defaultValue="delivery"
              className="flex space-x-4"
              onValueChange={(value) => setOrderType(value as "delivery" | "dine-in")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="delivery" id="delivery" />
                <Label htmlFor="delivery" className="cursor-pointer">
                  Delivery
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dine-in" id="dine-in" />
                <Label htmlFor="dine-in" className="cursor-pointer">
                  Dine-in
                </Label>
              </div>
            </RadioGroup>
          </div>

          {orderType === "delivery" ? (
            <div className="space-y-2">
              <Label htmlFor="address">Delivery Address</Label>
              <Input id="address" placeholder="123 Main St" required={orderType === "delivery"} />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Select Your Table</Label>
              <TableSelection onSelectTable={setSelectedTable} selectedTable={selectedTable} />
            </div>
          )}

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex justify-between font-bold">
              <span>Total Amount:</span>
              <span>${total}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isSubmitting || (orderType === "dine-in" && !selectedTable)}
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

