interface MenuItem {
  name: string
  description: string
  price: string
}

interface MenuSectionProps {
  title: string
  items: MenuItem[]
}

export function MenuSection({ title, items }: MenuSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-semibold text-stone-800">{title}</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-medium text-stone-900">{item.name}</h3>
              <p className="text-sm text-stone-600">{item.description}</p>
            </div>
            <div className="flex-shrink-0 font-medium text-stone-900">{item.price}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

