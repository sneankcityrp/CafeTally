import MenuItemCard from '../MenuItemCard'

export default function MenuItemCardExample() {
  return (
    <div className="p-6 max-w-sm">
      <MenuItemCard 
        id="1"
        name="Cappuccino"
        price={3.50}
        category="Coffee"
        onAdd={(id, name, price) => console.log(`Added ${name} (£${price})`)}
      />
    </div>
  )
}
