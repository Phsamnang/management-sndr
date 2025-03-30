"use client"

import { useState } from "react"
import { OrderMenu } from "@/components/order-menu"
import { Cart } from "@/components/cart"
import { menuData } from "@/data/menu-data"

export interface CartItem {
  id: number
  name: string
  price: string
  image: string
  quantity: number
  priceValue: number
}

export function OrderPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

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

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900 md:text-4xl">Order Online</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <OrderMenu menuData={menuData} addToCart={addToCart} />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Cart items={cartItems} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

