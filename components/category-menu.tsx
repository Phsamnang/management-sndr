import { FoodCategory } from "@/components/food-category"

// Food items organized by category
const menuData = [
  {
    category: "Appetizers",
    items: [
      {
        id: 1,
        name: "Bruschetta",
        price: "$8.99",
        image: "/placeholder.svg?height=300&width=400",
        description: "Toasted bread topped with tomatoes, garlic, and fresh basil",
      },
      {
        id: 2,
        name: "Calamari",
        price: "$12.99",
        image: "/placeholder.svg?height=300&width=400",
        description: "Crispy fried calamari served with lemon aioli",
      },
      {
        id: 3,
        name: "Caesar Salad",
        price: "$9.99",
        image: "/placeholder.svg?height=300&width=400",
        description: "Romaine lettuce, croutons, parmesan, and Caesar dressing",
      },
    ],
  },
  {
    category: "Main Courses",
    items: [
      {
        id: 4,
        name: "Classic Cheeseburger",
        price: "$14.99",
        image: "/placeholder.svg?height=300&width=400",
        description: "Beef patty with cheese, lettuce, tomato, and special sauce",
      },
      {
        id: 5,
        name: "Grilled Salmon",
        price: "$18.99",
        image: "/placeholder.svg?height=300&width=400",
        description: "Atlantic salmon with lemon butter and fresh herbs",
      },
      {
        id: 6,
        name: "Pasta Carbonara",
        price: "$15.99",
        image: "/placeholder.svg?height=300&width=400",
        description: "Spaghetti with pancetta, egg, and parmesan cheese",
      },
      {
        id: 7,
        name: "Chicken Tikka Masala",
        price: "$16.99",
        image: "/placeholder.svg?height=300&width=400",
        description: "Tender chicken in a creamy tomato curry sauce",
      },
    ],
  },
  {
    category: "Pizza",
    items: [
      {
        id: 8,
        name: "Margherita Pizza",
        price: "$14.99",
        image: "/placeholder.svg?height=300&width=400",
        description: "Fresh mozzarella, tomatoes, and basil on thin crust",
      },
      {
        id: 9,
        name: "Pepperoni Pizza",
        price: "$15.99",
        image: "/placeholder.svg?height=300&width=400",
        description: "Classic pepperoni with mozzarella cheese",
      },
      {
        id: 10,
        name: "Vegetable Pizza",
        price: "$16.99",
        image: "/placeholder.svg?height=300&width=400",
        description: "Bell peppers, onions, mushrooms, and olives",
      },
    ],
  },
  {
    category: "Desserts",
    items: [
      {
        id: 11,
        name: "Chocolate Cake",
        price: "$7.99",
        image: "/placeholder.svg?height=300&width=400",
        description: "Rich chocolate cake with ganache frosting",
      },
      {
        id: 12,
        name: "Tiramisu",
        price: "$8.99",
        image: "/placeholder.svg?height=300&width=400",
        description: "Classic Italian dessert with coffee-soaked ladyfingers",
      },
      {
        id: 13,
        name: "Cheesecake",
        price: "$8.99",
        image: "/placeholder.svg?height=300&width=400",
        description: "New York style cheesecake with berry compote",
      },
    ],
  },
  {
    category: "Beverages",
    items: [
      {
        id: 14,
        name: "Fresh Lemonade",
        price: "$4.99",
        image: "/placeholder.svg?height=300&width=400",
        description: "Freshly squeezed lemons with a hint of mint",
      },
      {
        id: 15,
        name: "Iced Tea",
        price: "$3.99",
        image: "/placeholder.svg?height=300&width=400",
        description: "House-brewed black tea served over ice",
      },
      {
        id: 16,
        name: "Espresso",
        price: "$3.99",
        image: "/placeholder.svg?height=300&width=400",
        description: "Double shot of our signature espresso blend",
      },
    ],
  },
]

export function CategoryMenu() {
  return (
    <div className="space-y-12">
      {menuData.map((category) => (
        <FoodCategory key={category.category} title={category.category} items={category.items} />
      ))}
    </div>
  )
}

