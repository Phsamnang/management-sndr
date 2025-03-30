import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface FoodCardProps {
  name: string
  price: string
  image: string
  description?: string
}

export function FoodCard({ name, price, image, description }: FoodCardProps) {
  return (
    <Card className="overflow-hidden border transition-all duration-300 hover:border-amber-200">
      <div className="relative h-48 w-full">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" priority />
      </div>
      <CardContent className="bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{name}</h3>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-lg font-bold text-amber-800">{price}</span>
        </div>
        {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
      </CardContent>
    </Card>
  )
}

