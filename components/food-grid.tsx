import { FoodCard } from "@/components/food-card"

const foodItems = [
  {
    id: 1,
    name: "Classic Cheeseburger",
    price: "$12.99",
    image: "/placeholder.svg?height=300&width=400",
    description: "Beef patty with cheese, lettuce, tomato, and special sauce",
  },
  {
    id: 2,
    name: "Margherita Pizza",
    price: "$14.99",
    image: "/placeholder.svg?height=300&width=400",
    description: "Fresh mozzarella, tomatoes, and basil on thin crust",
  },
  {
    id: 3,
    name: "Caesar Salad",
    price: "$9.99",
    image: "/placeholder.svg?height=300&width=400",
    description: "Romaine lettuce, croutons, parmesan, and Caesar dressing",
  },
  {
    id: 4,
    name: "Grilled Salmon",
    price: "$18.99",
    image: "/placeholder.svg?height=300&width=400",
    description: "Atlantic salmon with lemon butter and fresh herbs",
  },
  {
    id: 5,
    name: "Pasta Carbonara",
    price: "$15.99",
    image: "/placeholder.svg?height=300&width=400",
    description: "Spaghetti with pancetta, egg, and parmesan cheese",
  },
  {
    id: 6,
    name: "Chocolate Cake",
    price: "$7.99",
    image: "/placeholder.svg?height=300&width=400",
    description: "Rich chocolate cake with ganache frosting",
  },
  {
    id: 7,
    name: "Chicken Tikka Masala",
    price: "$16.99",
    image: "/placeholder.svg?height=300&width=400",
    description: "Tender chicken in a creamy tomato curry sauce",
  },
  {
    id: 8,
    name: "Vegetable Stir Fry",
    price: "$13.99",
    image: "/placeholder.svg?height=300&width=400",
    description: "Fresh vegetables in a savory sauce with steamed rice",
  },
]

export function FoodGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {foodItems.map((item) => (
        <FoodCard key={item.id} name={item.name} price={item.price} image={item.image} description={item.description} />
      ))}
    </div>
  )
}

