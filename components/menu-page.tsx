import { MenuSection } from "@/components/menu-section"

export function MenuPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-stone-900 md:text-5xl">Bistro Elegance</h1>
          <p className="mt-2 text-stone-500">Fine Dining Experience</p>
        </div>

        <div className="mx-auto max-w-3xl space-y-12">
          <MenuSection
            title="Appetizers"
            items={[
              {
                name: "Bruschetta",
                description: "Toasted bread topped with tomatoes, garlic, and fresh basil",
                price: "$8",
              },
              { name: "Calamari Fritti", description: "Crispy fried calamari served with lemon aioli", price: "$12" },
              {
                name: "Caprese Salad",
                description: "Fresh mozzarella, tomatoes, and basil drizzled with balsamic glaze",
                price: "$10",
              },
              {
                name: "Mushroom Arancini",
                description: "Crispy risotto balls filled with mushrooms and mozzarella",
                price: "$9",
              },
            ]}
          />

          <MenuSection
            title="Main Courses"
            items={[
              {
                name: "Filet Mignon",
                description: "8oz prime beef tenderloin with red wine reduction and roasted vegetables",
                price: "$32",
              },
              {
                name: "Herb Roasted Chicken",
                description: "Free-range chicken with rosemary potatoes and seasonal vegetables",
                price: "$24",
              },
              {
                name: "Grilled Salmon",
                description: "Atlantic salmon with lemon butter sauce and asparagus",
                price: "$28",
              },
              {
                name: "Mushroom Risotto",
                description: "Creamy arborio rice with wild mushrooms and parmesan",
                price: "$22",
              },
              {
                name: "Eggplant Parmesan",
                description: "Layers of eggplant, marinara sauce, and melted mozzarella",
                price: "$20",
              },
            ]}
          />

          <MenuSection
            title="Pasta"
            items={[
              {
                name: "Spaghetti Carbonara",
                description: "Classic carbonara with pancetta, egg, and parmesan",
                price: "$18",
              },
              { name: "Fettuccine Alfredo", description: "Fettuccine in a rich, creamy parmesan sauce", price: "$16" },
              {
                name: "Lobster Ravioli",
                description: "Handmade ravioli filled with lobster in a saffron cream sauce",
                price: "$26",
              },
              {
                name: "Penne Arrabbiata",
                description: "Penne pasta in a spicy tomato sauce with garlic and chili",
                price: "$15",
              },
            ]}
          />

          <MenuSection
            title="Desserts"
            items={[
              {
                name: "Tiramisu",
                description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone",
                price: "$9",
              },
              {
                name: "Crème Brûlée",
                description: "Rich custard topped with a layer of caramelized sugar",
                price: "$8",
              },
              {
                name: "Chocolate Lava Cake",
                description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
                price: "$10",
              },
              { name: "Panna Cotta", description: "Silky vanilla cream with seasonal berry compote", price: "$8" },
            ]}
          />

          <MenuSection
            title="Beverages"
            items={[
              { name: "Espresso", description: "Single shot of our house blend", price: "$3" },
              { name: "Cappuccino", description: "Espresso with steamed milk and foam", price: "$4.50" },
              { name: "House Wine", description: "Red or white, glass", price: "$8" },
              { name: "Craft Cocktails", description: "Ask your server for our seasonal selections", price: "$12" },
              { name: "Sparkling Water", description: "750ml bottle", price: "$5" },
            ]}
          />
        </div>

        <div className="mt-16 text-center text-sm text-stone-500">
          <p>Please inform your server of any allergies or dietary restrictions.</p>
          <p className="mt-1">18% gratuity added to parties of 6 or more.</p>
        </div>
      </div>
    </div>
  )
}

