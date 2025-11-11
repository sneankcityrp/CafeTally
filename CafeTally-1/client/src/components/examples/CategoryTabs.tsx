import CategoryTabs from '../CategoryTabs'
import { useState } from 'react'

export default function CategoryTabsExample() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  
  return (
    <div className="p-6">
      <CategoryTabs 
        categories={['Coffee', 'Tea', 'Food', 'Pastries', 'Drinks']}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
    </div>
  )
}
