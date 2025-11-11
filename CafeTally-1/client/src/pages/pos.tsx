import { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import MenuItemCard from "@/components/MenuItemCard";
import OrderSummary from "@/components/OrderSummary";
import CategoryTabs from "@/components/CategoryTabs";
import { OrderItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const menuData = [
  // Hot Drinks
  { id: '1', name: 'Latte', price: 2.75, category: 'Hot Drinks' },
  { id: '2', name: 'Cappuccino', price: 2.75, category: 'Hot Drinks' },
  { id: '3', name: 'Flat White', price: 2.75, category: 'Hot Drinks' },
  { id: '4', name: 'Americano', price: 2.75, category: 'Hot Drinks' },
  { id: '5', name: 'Hot Chocolate', price: 2.75, category: 'Hot Drinks' },
  { id: '6', name: 'Luxury Hot Chocolate', price: 4.00, category: 'Hot Drinks' },
  { id: '7', name: 'Tea', price: 2.25, category: 'Hot Drinks' },
  { id: '8', name: 'Pot of Tea for Two', price: 3.00, category: 'Hot Drinks' },
  
  // Cold Drinks
  { id: '9', name: 'Iced Latte', price: 3.25, category: 'Cold Drinks' },
  { id: '10', name: 'Cans', price: 1.30, category: 'Cold Drinks' },
  { id: '11', name: 'Bottled Water', price: 1.50, category: 'Cold Drinks' },
  { id: '12', name: 'Bottled Soda', price: 2.00, category: 'Cold Drinks' },
  { id: '13', name: 'Slush', price: 3.00, category: 'Cold Drinks' },
  
  // Milkshakes
  { id: '14', name: 'Chocolate Milkshake', price: 4.00, category: 'Milkshakes' },
  { id: '15', name: 'Strawberry Milkshake', price: 4.00, category: 'Milkshakes' },
  { id: '16', name: 'Banana Milkshake', price: 4.00, category: 'Milkshakes' },
  { id: '17', name: 'Biscoff Milkshake', price: 4.00, category: 'Milkshakes' },
  
  // Food - Toasties & Sandwiches
  { id: '18', name: 'Toastie', price: 3.50, category: 'Food' },
  { id: '19', name: 'Cob/Sandwich', price: 3.75, category: 'Food' },
  { id: '20', name: 'Toast/Teacake', price: 2.25, category: 'Food' },
  { id: '21', name: 'Homemade Scone', price: 4.25, category: 'Food' },
  
  // Waffles
  { id: '22', name: 'Waffles - Strawberries & Chocolate', price: 5.50, category: 'Waffles' },
  { id: '23', name: 'Waffles - Biscoff Sauce & Crumb', price: 5.50, category: 'Waffles' },
  { id: '24', name: 'Waffles - Dubai Style Strawberries', price: 6.25, category: 'Waffles' },
  
  // Ice Cream
  { id: '25', name: 'Small Ice Cream', price: 3.00, category: 'Ice Cream' },
  { id: '26', name: 'Large Ice Cream', price: 4.00, category: 'Ice Cream' },
  
  // Cakes
  { id: '27', name: 'Cake Slice', price: 3.50, category: 'Cakes' },
  { id: '28', name: 'Brownie', price: 3.00, category: 'Cakes' },
  { id: '29', name: 'Blondie', price: 3.00, category: 'Cakes' },
  { id: '30', name: 'Cookie', price: 2.50, category: 'Cakes' },
  { id: '31', name: 'Traybake', price: 3.00, category: 'Cakes' },
  { id: '32', name: 'Cupcake', price: 2.50, category: 'Cakes' },
];

export default function POSPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const { toast } = useToast();

  const categories = useMemo(() => {
    return Array.from(new Set(menuData.map(item => item.category)));
  }, []);

  const filteredMenu = useMemo(() => {
    if (activeCategory === null) return menuData;
    return menuData.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const handleAddItem = (id: string, name: string, price: number) => {
    setOrderItems(prev => {
      const existingItem = prev.find(item => item.id === id);
      if (existingItem) {
        return prev.map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id, name, price, quantity: 1 }];
    });

    toast({
      title: "Item added",
      description: `${name} added to order`,
      duration: 1500,
    });
  };

  const handleRemoveItem = (id: string) => {
    setOrderItems(prev => {
      const item = prev.find(i => i.id === id);
      if (!item) return prev;

      if (item.quantity > 1) {
        return prev.map(i =>
          i.id === id
            ? { ...i, quantity: i.quantity - 1 }
            : i
        );
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const handleClearAll = () => {
    setShowClearDialog(true);
  };

  const confirmClearAll = () => {
    setOrderItems([]);
    setShowClearDialog(false);
    toast({
      title: "Order cleared",
      description: "All items removed from order",
    });
  };

  const handleCheckout = () => {
    setShowCheckoutDialog(true);
  };

  // Mutation to create order
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: { items: OrderItem[]; total: string; status: string }) => {
      const res = await apiRequest("POST", "/api/orders", orderData);
      return await res.json();
    },
    onSuccess: (data: any) => {
      const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      toast({
        title: "Order sent to kitchen!",
        description: `Order #${data.id.slice(0, 8)} - Total: £${total.toFixed(2)}`,
      });
      setOrderItems([]);
      setShowCheckoutDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send order to kitchen. Please try again.",
        variant: "destructive",
      });
    },
  });

  const confirmCheckout = () => {
    const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    createOrderMutation.mutate({
      items: orderItems,
      total: total.toFixed(2),
      status: "pending",
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent" data-testid="text-apptitle">The Curious Cafe</h1>
          <p className="text-muted-foreground mt-1 font-medium" data-testid="text-appsubtitle">✨ 301 Main Street, Bulwell ✨</p>
        </header>

        <div className="p-6 border-b">
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="container-menugrid">
            {filteredMenu.map((item) => (
              <MenuItemCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                category={item.category}
                onAdd={handleAddItem}
              />
            ))}
          </div>
        </div>
      </div>

      <aside className="lg:w-[400px] border-t lg:border-t-0 lg:border-l bg-background" data-testid="container-ordersummary">
        <div className="h-full">
          <OrderSummary
            items={orderItems}
            onRemoveItem={handleRemoveItem}
            onClearAll={handleClearAll}
            onCheckout={handleCheckout}
          />
        </div>
      </aside>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all items?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all items from the current order. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-clear">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearAll} data-testid="button-confirm-clear">
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete order?</AlertDialogTitle>
            <AlertDialogDescription>
              Process this order for £{orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-checkout">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCheckout} data-testid="button-confirm-checkout">
              Complete Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
