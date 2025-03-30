import { FoodCard } from "@/components/food-card"

interface FoodItem {
  id: number
  name: string
  price: string
  image: string
  description?: string
}

interface FoodCategoryProps {
  title: string
  items: FoodItem[]
}

export function FoodCategory({ title, items }: FoodCategoryProps) {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">{title}</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <FoodCard
            key={item.id}
            name={item.name}
            price={item.price}
            image={item.image}
            description={item.description}
          />
        ))}
      </div>
    </div>
  )
}

