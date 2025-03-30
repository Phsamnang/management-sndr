"use client"

import { useState, useEffect } from "react"
import { POSHeader } from "./pos-header"
import { POSMenu } from "./pos-menu"
import { POSOrderSidebar } from "./pos-order-sidebar"

export interface POSMenuItem {
  id: number
  name: string
  price: string
  priceValue: number
  image: string
  description?: string
  category: string
}

export interface POSOrderItem extends POSMenuItem {
  quantity: number
}

export interface POSCategory {
  name: string
  count: number
  items: POSMenuItem[]
}

export function POSInterface() {
  const [categories, setCategories] = useState<POSCategory[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [orderItems, setOrderItems] = useState<POSOrderItem[]>([])
  const [selectedTable, setSelectedTable] = useState<string | null>(null)

  // Process menu data into categories and items
  // useEffect(() => {
  //   const allItems: POSMenuItem[] = []
  //   const categoryMap: Record<string, POSMenuItem[]> = {}

  //   // Process all menu items
  //   menuData.forEach((category) => {
  //     category.items.forEach((item) => {
  //       const priceValue = Number.parseFloat(item.price.replace("$", ""))
  //       const menuItem: POSMenuItem = {
  //         ...item,
  //         priceValue,
  //         category: category.category,
  //       }

  //       allItems.push(menuItem)

  //       // Group by category
  //       if (!categoryMap[category.category]) {
  //         categoryMap[category.category] = []
  //       }
  //       categoryMap[category.category].push(menuItem)
  //     })
  //   })

    // Create categories array
  //   const categoriesArray: POSCategory[] = [{ name: "All", count: allItems.length, items: allItems }]

  //   Object.entries(categoryMap).forEach(([name, items]) => {
  //     categoriesArray.push({
  //       name,
  //       count: items.length,
  //       items,
  //     })
  //   })

  //   setCategories(categoriesArray)
  // }, [])

  const addToOrder = (item: POSMenuItem) => {
    setOrderItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id)

      if (existingItem) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      } else {
        return [...prev, { ...item, quantity: 1 }]
      }
    })
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setOrderItems((prev) => prev.filter((item) => item.id !== id))
      return
    }

    setOrderItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearOrder = () => {
    setOrderItems([])
  }

  const handleTableSelect = (table: string | null) => {
    setSelectedTable(table)
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      {/* <POSHeader selectedTable={selectedTable} /> */}

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <POSMenu
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            addToOrder={addToOrder}
          />
        </div>

        <POSOrderSidebar
          orderItems={orderItems}
          updateQuantity={updateQuantity}
          clearOrder={clearOrder}
          selectedTable={selectedTable}
          onTableSelect={handleTableSelect}
        />
      </div>
    </div>
  )
}

