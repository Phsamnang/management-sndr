"use client"

import { useState } from "react"
import { TableSelection } from "@/components/table-selection"
import { OrderMenu } from "@/components/order-menu"
import { ArrowLeft } from "lucide-react"
import { TableCart } from "@/components/table-cart"
import { Button } from "./ui/button"

export interface CartItem {
  id: number
  name: string
  price: string
  image: string
  quantity: number
  priceValue: number
}

export function TableOrderPage() {
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  const addToCart = (item: {
    id: number
    name: string
    price: string
    image: string
    description?: string
  }) => {
    // Convert price string to number (remove $ and convert to number)
    const priceValue = Number.parseFloat(item.price.replace("$", ""))

    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex((cartItem) => cartItem.id === item.id)

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += 1
        return updatedItems
      } else {
        // Item doesn't exist, add new item
        return [...prevItems, { ...item, quantity: 1, priceValue }]
      }
    })
  }

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCartItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const handlePlaceOrder = () => {
    setIsCheckingOut(true)

    // Simulate order processing
    setTimeout(() => {
      setOrderComplete(true)
    }, 1500)
  }

  const resetOrder = () => {
    setCartItems([])
    setIsCheckingOut(false)
    setOrderComplete(false)
  }

  const changeTable = () => {
    setSelectedTable(null)
    resetOrder()
  }

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    return total + item.priceValue * item.quantity
  }, 0)

  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  // If no table is selected, show table selection
  if (!selectedTable) {
    return (
      <div className="min-h-screen bg-amber-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-8 text-center text-3xl font-bold text-gray-900 md:text-4xl">Select Your Table</h1>
          <div className="mx-auto max-w-md">
            <TableSelection
              onSelectTable={(table) => setSelectedTable(table)}
              selectedTable={selectedTable}
              onConfirm={(table) => setSelectedTable(table)}
            />
          </div>
        </div>
      </div>
    )
  }

  // If order is complete, show confirmation
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-amber-50 py-12">
        <div className="container mx-auto max-w-md px-4">
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <h1 className="mb-4 text-center text-2xl font-bold text-green-600">Order Complete!</h1>
            <div className="mb-6 text-center">
              <p className="mb-2 text-lg font-medium">Your order has been sent to the kitchen</p>
              <p className="text-gray-600">Table: {selectedTable}</p>
              <p className="mt-2 text-gray-600">Total: ${total.toFixed(2)}</p>
            </div>
            <div className="mt-8 flex justify-center">
              <Button onClick={resetOrder} className="bg-amber-500 hover:bg-amber-600">
                Place Another Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If checking out, show simplified checkout
  if (isCheckingOut) {
    return (
      <div className="min-h-screen bg-amber-50 py-12">
        <div className="container mx-auto max-w-md px-4">
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center">
              <Button variant="ghost" onClick={() => setIsCheckingOut(false)} className="mr-2 p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold">Confirm Your Order</h1>
            </div>

            <div className="mb-6 rounded-lg bg-amber-50 p-4">
              <p className="font-medium">Table: {selectedTable}</p>
            </div>

            <div className="mb-6 space-y-4">
              <h2 className="text-lg font-medium">Order Summary</h2>
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.quantity} x {item.name}
                  </span>
                  <span>${(item.priceValue * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <div className="mt-4 border-t pt-4">
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
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={handlePlaceOrder} className="bg-green-600 hover:bg-green-700">
                Place Order
              </Button>
              <Button variant="outline" onClick={() => setIsCheckingOut(false)}>
                Back to Menu
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main ordering interface
  return (
    <div className="min-h-screen bg-amber-50">
      <div className="sticky top-0 z-10 bg-amber-500 py-3 text-white shadow-md">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center">
            <span className="text-lg font-medium">Table: {selectedTable}</span>
          </div>
          <Button variant="outline" onClick={changeTable} className="border-white text-white hover:bg-amber-600">
            Change Table
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900 md:text-4xl">Order Your Food</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <OrderMenu menuData={menuData} addToCart={addToCart} />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TableCart
                items={cartItems}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                onCheckout={() => setIsCheckingOut(true)}
                tableNumber={selectedTable}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

