"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Image from "next/image"

interface MenuItem {
  id: number
  name: string
  price: string
  image: string
  description?: string
}

interface OrderItemProps {
  item: MenuItem
  addToCart: (item: MenuItem) => void
}

export function OrderItem({ item, addToCart }: OrderItemProps) {
  return (
    <Card className="overflow-hidden border transition-all duration-300 hover:border-amber-200">
      <div className="relative h-40 w-full">
        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" priority />
      </div>
      <CardContent className="bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-lg font-bold text-amber-800">{item.price}</span>
        </div>
        {item.description && <p className="mb-3 text-sm text-gray-600">{item.description}</p>}
        <Button onClick={() => addToCart(item)} className="w-full bg-amber-500 text-white hover:bg-amber-600">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add to Order
        </Button>
      </CardContent>
    </Card>
  )
}

