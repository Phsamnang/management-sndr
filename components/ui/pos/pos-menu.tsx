"use client"

import { useState } from "react"
import { Search, Maximize2, Plus } from "lucide-react"
import Image from "next/image"
import type { POSCategory, POSMenuItem } from "@/components/pos/pos-interface"

interface POSMenuProps {
  categories: POSCategory[]
  activeCategory: string
  setActiveCategory: (category: string) => void
  addToOrder: (item: POSMenuItem) => void
}

export function POSMenu({ categories, activeCategory, setActiveCategory, addToOrder }: POSMenuProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Get active category items
  const activeItems = categories.find((c) => c.name === activeCategory)?.items || []

  // Filter items by search query if present
  const displayedItems = searchQuery
    ? activeItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : activeItems

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="flex items-center justify-between border-b bg-white p-4">
        <div className="flex items-center">
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 19H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h2 className="text-xl font-semibold text-slate-800">Menu</h2>
        </div>

        <div className="relative">
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search"
            className="rounded-full bg-transparent pr-10 text-sm focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="border-b bg-white px-4 py-2">
        <div className="flex space-x-2 overflow-x-auto py-1">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`flex items-center whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === category.name
                  ? "bg-amber-100 text-amber-900"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              onClick={() => setActiveCategory(category.name)}
            >
              {category.name}
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                  activeCategory === category.name ? "bg-amber-200 text-amber-900" : "bg-slate-200 text-slate-700"
                }`}
              >
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {displayedItems.map((item) => (
            <MenuItemCard key={item.id} item={item} addToOrder={addToOrder} />
          ))}
        </div>
      </div>
    </div>
  )
}

interface MenuItemCardProps {
  item: POSMenuItem
  addToOrder: (item: POSMenuItem) => void
}

function MenuItemCard({ item, addToOrder }: MenuItemCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-white">
      <div className="relative h-44 w-full bg-slate-100">
        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" priority />
        <button className="absolute right-2 top-2 rounded bg-white/90 p-1" aria-label="Expand view">
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      <div className="p-2">
        <h3 className="font-medium text-slate-800">{item.name}</h3>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-lg font-semibold text-slate-900">${item.priceValue.toFixed(2)}</span>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-white"
            onClick={() => addToOrder(item)}
            aria-label="Add to order"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

