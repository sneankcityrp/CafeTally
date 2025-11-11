import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Trash2 } from "lucide-react";
import { OrderItem } from "@shared/schema";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  items: OrderItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onCheckout?: () => void;
}

export default function OrderSummary({ items, onRemoveItem, onClearAll, onCheckout }: OrderSummaryProps) {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold" data-testid="text-ordertitle">Current Order</h2>
          {items.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearAll}
              data-testid="button-clearall"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center" data-testid="text-emptystate">
            <p className="text-muted-foreground">No items added yet</p>
            <p className="text-sm text-muted-foreground mt-2">Tap items to add to order</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between gap-3 p-3 rounded-md bg-muted/50"
                data-testid={`orderitem-${item.id}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium" data-testid={`text-quantity-${item.id}`}>{item.quantity}×</span>
                    <span className="truncate" data-testid={`text-name-${item.id}`}>{item.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold whitespace-nowrap" data-testid={`text-itemprice-${item.id}`}>
                    £{(item.price * item.quantity).toFixed(2)}
                  </span>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => onRemoveItem(item.id)}
                    className="h-8 w-8 shrink-0"
                    data-testid={`button-remove-${item.id}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span data-testid="text-itemcount">Items ({itemCount})</span>
              <span data-testid="text-subtotal">£{total.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-baseline">
              <span className="text-xl font-bold">Total</span>
              <span className="text-4xl font-bold" data-testid="text-total">£{total.toFixed(2)}</span>
            </div>
          </div>
          <Button 
            className="w-full" 
            size="lg"
            onClick={onCheckout}
            data-testid="button-checkout"
          >
            Complete Order
          </Button>
        </div>
      )}
    </Card>
  );
}
