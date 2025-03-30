import { OrderItem } from "@/components/order-item"

interface MenuItem {
  id: number
  name: string
  price: string
  image: string
  description?: string
}

interface OrderCategoryProps {
  title: string
  items: MenuItem[]
  addToCart: (item: MenuItem) => void
}

export function OrderCategory({ title, items, addToCart }: OrderCategoryProps) {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900">{title}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <OrderItem key={item.id} item={item} addToCart={addToCart} />
        ))}
      </div>
    </div>
  )
}

