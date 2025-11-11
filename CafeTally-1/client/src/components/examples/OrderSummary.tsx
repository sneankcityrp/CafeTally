import OrderSummary from '../OrderSummary'
import { OrderItem } from '@shared/schema'

export default function OrderSummaryExample() {
  const mockItems: OrderItem[] = [
    { id: '1', name: 'Cappuccino', price: 3.50, quantity: 2 },
    { id: '2', name: 'Croissant', price: 2.50, quantity: 1 },
    { id: '3', name: 'Latte', price: 3.80, quantity: 1 },
  ]

  return (
    <div className="h-screen p-6">
      <OrderSummary 
        items={mockItems}
        onRemoveItem={(id) => console.log(`Remove item ${id}`)}
        onClearAll={() => console.log('Clear all')}
        onCheckout={() => console.log('Checkout')}
      />
    </div>
  )
}
