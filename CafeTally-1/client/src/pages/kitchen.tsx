import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, UtensilsCrossed } from "lucide-react";
import { Order } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function KitchenPage() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const { toast } = useToast();

  // Fetch initial orders
  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  // Connect to WebSocket for real-time updates
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log("Connected to kitchen display");
    };

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === "new_order") {
        // Invalidate and refetch orders
        queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
        
        toast({
          title: "New Order!",
          description: `Order #${message.order.id.slice(0, 8)} received`,
          duration: 3000,
        });
      } else if (message.type === "status_update") {
        // Update order status in cache
        queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      }
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    websocket.onclose = () => {
      console.log("Disconnected from kitchen display");
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [toast]);

  // Mutation to update order status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const res = await apiRequest("PATCH", `/api/orders/${orderId}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
  });

  const handleCompleteOrder = (orderId: string) => {
    updateStatusMutation.mutate({ orderId, status: "completed" });
  };

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };

  const getTimeSince = (date: Date | string) => {
    const now = new Date();
    const orderTime = new Date(date);
    const diffMs = now.getTime() - orderTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins === 1) return "1 min ago";
    return `${diffMins} mins ago`;
  };

  const pendingOrders = orders.filter(o => o.status === "pending");
  const completedOrders = orders.filter(o => o.status === "completed");

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <UtensilsCrossed className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent" data-testid="text-kitchentitle">
            Kitchen Display
          </h1>
        </div>
        <p className="text-muted-foreground font-medium" data-testid="text-kitchensubtitle">
          The Curious Cafe
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Orders */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold">Pending Orders</h2>
            <Badge variant="default" className="ml-2">{pendingOrders.length}</Badge>
          </div>
          
          {pendingOrders.length === 0 ? (
            <Card className="p-8 text-center" data-testid="text-nopending">
              <p className="text-muted-foreground">No pending orders</p>
              <p className="text-sm text-muted-foreground mt-2">New orders will appear here</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <Card 
                  key={order.id} 
                  className="p-6 border-l-4 border-l-primary"
                  data-testid={`order-pending-${order.id}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold" data-testid={`text-orderid-${order.id}`}>
                          Order #{order.id.slice(0, 8)}
                        </h3>
                        <Badge variant="secondary" data-testid={`badge-time-${order.id}`}>
                          {getTimeSince(order.createdAt)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1" data-testid={`text-ordertime-${order.id}`}>
                        {formatTime(order.createdAt)}
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleCompleteOrder(order.id)}
                      size="lg"
                      data-testid={`button-complete-${order.id}`}
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Complete
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div 
                        key={`${order.id}-${item.id}-${index}`}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                        data-testid={`orderitem-${order.id}-${index}`}
                      >
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-primary" data-testid={`text-qty-${order.id}-${index}`}>
                            {item.quantity}×
                          </span>
                          <span className="text-lg" data-testid={`text-itemname-${order.id}-${index}`}>
                            {item.name}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground" data-testid={`text-itemprice-${order.id}-${index}`}>
                          £{item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold" data-testid={`text-total-${order.id}`}>
                      £{Number(order.total).toFixed(2)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Completed Orders */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h2 className="text-2xl font-bold">Completed</h2>
            <Badge variant="secondary" className="ml-2">{completedOrders.length}</Badge>
          </div>
          
          {completedOrders.length === 0 ? (
            <Card className="p-8 text-center" data-testid="text-nocompleted">
              <p className="text-muted-foreground">No completed orders</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {completedOrders.slice(0, 5).map((order) => (
                <Card 
                  key={order.id} 
                  className="p-4 opacity-60"
                  data-testid={`order-completed-${order.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold" data-testid={`text-completedid-${order.id}`}>
                        Order #{order.id.slice(0, 8)}
                      </h3>
                      <p className="text-sm text-muted-foreground" data-testid={`text-completedtime-${order.id}`}>
                        {formatTime(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        ✓ Done
                      </Badge>
                      <p className="text-sm font-semibold mt-1" data-testid={`text-completedtotal-${order.id}`}>
                        £{Number(order.total).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
