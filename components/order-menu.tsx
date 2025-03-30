import { OrderCategory } from "@/components/order-category"

interface MenuItem {
  id: number
  name: string
  price: string
  image: string
  description?: string
}

interface MenuCategory {
  category: string
  items: MenuItem[]
}

interface OrderMenuProps {
  menuData: MenuCategory[]
  addToCart: (item: MenuItem) => void
}

export function OrderMenu({ menuData, addToCart }: OrderMenuProps) {
  return (
    <div className="space-y-10">
      {menuData.map((category) => (
        <OrderCategory key={category.category} title={category.category} items={category.items} addToCart={addToCart} />
      ))}
    </div>
  )
}

