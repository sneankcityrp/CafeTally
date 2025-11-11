import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  // Store connected kitchen displays
  const kitchenClients = new Set<WebSocket>();

  wss.on("connection", (ws) => {
    console.log("Kitchen display connected");
    kitchenClients.add(ws);

    ws.on("close", () => {
      console.log("Kitchen display disconnected");
      kitchenClients.delete(ws);
    });
  });

  // Broadcast order to all connected kitchen displays
  function broadcastToKitchen(order: any) {
    const message = JSON.stringify({ type: "new_order", order });
    kitchenClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Broadcast order status update to all connected clients
  function broadcastStatusUpdate(orderId: string, status: string) {
    const message = JSON.stringify({ type: "status_update", orderId, status });
    kitchenClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Create a new order
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      
      // Broadcast to kitchen displays
      broadcastToKitchen(order);
      
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: "Invalid order data" });
    }
  });

  // Get all orders
  app.get("/api/orders", async (req, res) => {
    const orders = await storage.getAllOrders();
    res.json(orders);
  });

  // Get a specific order
  app.get("/api/orders/:id", async (req, res) => {
    const order = await storage.getOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  });

  // Update order status
  app.patch("/api/orders/:id/status", async (req, res) => {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const order = await storage.updateOrderStatus(req.params.id, status);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Broadcast status update
    broadcastStatusUpdate(req.params.id, status);

    res.json(order);
  });

  return httpServer;
}
