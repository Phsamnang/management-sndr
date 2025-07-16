"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Timer,
  Home,
  Play,
  Utensils,
  User,
  Package,
} from "lucide-react";
import Link from "next/link";
import { io } from "socket.io-client";

// Sample completed orders from chef ready for table delivery
const initialTableDeliveryOrders = [
  {
    id: "table-delivery-1",
    orderNumber: "ORD-001",
    table: {
      number: "Table 5",
      section: "Main Dining",
      seats: 4,
      server: "Alice Johnson",
    },
    customer: {
      name: "John Smith",
      partySize: 2,
    },
    items: [
      {
        name: "Classic Burger",
        quantity: 2,
        notes: "One without onions",
        temperature: "Medium",
      },
      { name: "French Fries", quantity: 2, notes: "Extra crispy" },
      { name: "Coca Cola", quantity: 2, notes: "No ice" },
    ],
    completedTime: new Date(Date.now() - 5 * 60000).toISOString(),
    orderTime: new Date(Date.now() - 25 * 60000).toISOString(),
    total: 33.96,
    priority: "urgent",
    status: "ready_for_delivery",
    progress: 0,
    specialInstructions: "Customer has food allergy - nuts",
    estimatedDeliveryTime: 3, // minutes to deliver to table
  },
  {
    id: "table-delivery-2",
    orderNumber: "ORD-002",
    table: {
      number: "Table 12",
      section: "Patio",
      seats: 6,
      server: "Bob Wilson",
    },
    customer: {
      name: "Sarah Johnson",
      partySize: 4,
    },
    items: [
      {
        name: "Margherita Pizza",
        quantity: 1,
        notes: "Extra cheese",
        temperature: "Hot",
      },
      { name: "Garlic Bread", quantity: 1, notes: "Well toasted" },
      { name: "House Salad", quantity: 2, notes: "Dressing on side" },
    ],
    completedTime: new Date(Date.now() - 8 * 60000).toISOString(),
    orderTime: new Date(Date.now() - 35 * 60000).toISOString(),
    total: 27.97,
    priority: "high",
    status: "picked_up",
    progress: 45,
    specialInstructions: "Birthday celebration - bring candles",
    estimatedDeliveryTime: 2,
  },
  {
    id: "table-delivery-3",
    orderNumber: "ORD-003",
    table: {
      number: "Table 8",
      section: "VIP",
      seats: 2,
      server: "Carol Davis",
    },
    customer: {
      name: "Mike Wilson",
      partySize: 2,
    },
    items: [
      {
        name: "Grilled Salmon",
        quantity: 1,
        notes: "Medium well",
        temperature: "Hot",
      },
      { name: "Steamed Rice", quantity: 1, notes: "Extra portion" },
      { name: "Asparagus", quantity: 1, notes: "Light seasoning" },
    ],
    completedTime: new Date(Date.now() - 12 * 60000).toISOString(),
    orderTime: new Date(Date.now() - 45 * 60000).toISOString(),
    total: 29.96,
    priority: "normal",
    status: "out_for_delivery",
    progress: 80,
    specialInstructions: "",
    estimatedDeliveryTime: 1,
  },
  {
    id: "table-delivery-4",
    orderNumber: "ORD-004",
    table: {
      number: "Table 15",
      section: "Bar Area",
      seats: 4,
      server: "David Brown",
    },
    customer: {
      name: "Emily Davis",
      partySize: 3,
    },
    items: [
      {
        name: "Chicken Wings",
        quantity: 12,
        notes: "Extra spicy",
        temperature: "Hot",
      },
      { name: "Onion Rings", quantity: 1, notes: "Golden brown" },
      { name: "Blue Cheese Dip", quantity: 2, notes: "Extra portion" },
    ],
    completedTime: new Date(Date.now() - 3 * 60000).toISOString(),
    orderTime: new Date(Date.now() - 20 * 60000).toISOString(),
    total: 26.97,
    priority: "normal",
    status: "ready_for_delivery",
    progress: 0,
    specialInstructions: "Customer requested extra napkins",
    estimatedDeliveryTime: 2,
  },
  {
    id: "table-delivery-5",
    orderNumber: "ORD-005",
    table: {
      number: "Table 3",
      section: "Window Side",
      seats: 2,
      server: "Eva Martinez",
    },
    customer: {
      name: "David Brown",
      partySize: 2,
    },
    items: [
      {
        name: "Caesar Salad",
        quantity: 1,
        notes: "No croutons",
        temperature: "Cold",
      },
      {
        name: "Chocolate Cake",
        quantity: 1,
        notes: "Birthday cake - add candle",
        temperature: "Room temp",
      },
      { name: "Coffee", quantity: 2, notes: "One decaf" },
    ],
    completedTime: new Date(Date.now() - 6 * 60000).toISOString(),
    orderTime: new Date(Date.now() - 30 * 60000).toISOString(),
    total: 26.96,
    priority: "urgent",
    status: "ready_for_delivery",
    progress: 0,
    specialInstructions: "Anniversary dinner - handle with care",
    estimatedDeliveryTime: 2,
  },
  {
    id: "table-delivery-6",
    orderNumber: "ORD-006",
    table: {
      number: "Table 9",
      section: "Main Dining",
      seats: 8,
      server: "Frank Wilson",
    },
    customer: {
      name: "Lisa Wang",
      partySize: 6,
    },
    items: [
      {
        name: "Fish Tacos",
        quantity: 3,
        notes: "Extra lime",
        temperature: "Hot",
      },
      { name: "Guacamole", quantity: 2, notes: "Fresh made" },
      { name: "Tortilla Chips", quantity: 1, notes: "Warm" },
    ],
    completedTime: new Date(Date.now() - 1 * 60000).toISOString(),
    orderTime: new Date(Date.now() - 18 * 60000).toISOString(),
    total: 24.98,
    priority: "high",
    status: "picked_up",
    progress: 25,
    specialInstructions: "Large party - serve together",
    estimatedDeliveryTime: 3,
  },
];

type TableDeliveryOrder = {
  id: string;
  orderNumber: string;
  table: {
    number: string;
    section: string;
    seats: number;
    server: string;
  };
  customer: {
    name: string;
    partySize: number;
  };
  items: Array<{
    name: string;
    quantity: number;
    notes: string;
    temperature: string;
  }>;
  completedTime: string;
  orderTime: string;
  total: number;
  priority: "normal" | "high" | "urgent";
  status: "ready_for_delivery" | "picked_up" | "out_for_delivery" | "delivered";
  progress: number;
  specialInstructions: string;
  estimatedDeliveryTime: number;
};

export default function TableDeliveryPage() {
  const [deliveryOrders, setDeliveryOrders] = useState<TableDeliveryOrder[]>(
    initialTableDeliveryOrders
  );


     useEffect(() => {
       // Connect to backend WebSocket server
       const socket = io("http://localhost:8080"); // 🔁 Replace with your server URL

       socket.on("connect", () => {
         console.log("Connected to WebSocket server");
       });
       socket.on("foodDelivery", (data) => {
         alert(data.message);
       });
       return () => {
         socket.disconnect();
       };
     }, []);

  const startPickup = (orderId: string) => {
    setDeliveryOrders(
      deliveryOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "picked_up" as const,
              progress: 0,
            }
          : order
      )
    );
  };

  // Start delivery to table
  const startDelivery = (orderId: string) => {
    setDeliveryOrders(
      deliveryOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "out_for_delivery" as const,
              progress: 0,
            }
          : order
      )
    );
  };

  // Complete delivery to table
  const completeDelivery = (orderId: string) => {
    setDeliveryOrders(
      deliveryOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "delivered" as const,
              progress: 100,
            }
          : order
      )
    );
  };

  // Auto-progress delivery items
  useEffect(() => {
    const interval = setInterval(() => {
      setDeliveryOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.status === "picked_up" && order.progress < 99) {
            return {
              ...order,
              progress: Math.min(order.progress + 3, 99),
            };
          }
          if (order.status === "out_for_delivery" && order.progress < 99) {
            return {
              ...order,
              progress: Math.min(order.progress + 5, 99),
            };
          }
          return order;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Filter orders - only show non-delivered orders
  const filteredOrders = deliveryOrders.filter(
    (order) => order.status !== "delivered"
  );

  // Calculate wait time since completion
  const getWaitTime = (completedTime: string) => {
    const completedAt = new Date(completedTime).getTime();
    const currentTime = new Date().getTime();
    return Math.floor((currentTime - completedAt) / 60000);
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 font-bold";
      case "high":
        return "text-orange-600 font-semibold";
      default:
        return "text-gray-600";
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready_for_delivery":
        return "bg-blue-100 text-blue-800";
      case "picked_up":
        return "bg-yellow-100 text-yellow-800";
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get row background based on priority
  const getRowBackground = (priority: string, status: string) => {
    if (status === "delivered") return "bg-green-50";
    if (priority === "urgent") return "bg-red-50";
    if (priority === "high") return "bg-orange-50";
    return "bg-white hover:bg-gray-50";
  };

  // Get section color
  const getSectionColor = (section: string) => {
    switch (section) {
      case "VIP":
        return "bg-purple-100 text-purple-800";
      case "Patio":
        return "bg-green-100 text-green-800";
      case "Bar Area":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const readyCount = deliveryOrders.filter(
    (order) => order.status === "ready_for_delivery"
  ).length;
  const pickedUpCount = deliveryOrders.filter(
    (order) => order.status === "picked_up"
  ).length;
  const outForDeliveryCount = deliveryOrders.filter(
    (order) => order.status === "out_for_delivery"
  ).length;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-green-50 to-gray-100">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Back to Menu</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
              <Utensils className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                Table Service Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Deliver completed orders to customer tables
              </p>
            </div>
          </div>
          <div className="relative">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
      </header>

      {/* Main Content with Scrollable Table */}
      <div className="flex-1 container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden h-[calc(100vh-200px)]">
          {/* Fixed Table Header */}
          <div className="sticky top-0 z-10 bg-white border-b">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold w-48">
                    Order Details
                  </TableHead>
                  <TableHead className="font-semibold w-64">
                    Table & Customer
                  </TableHead>
                  <TableHead className="font-semibold w-48">
                    Food Items
                  </TableHead>
                  <TableHead className="font-semibold w-24">Priority</TableHead>
                  <TableHead className="font-semibold w-32">Status</TableHead>
                  <TableHead className="font-semibold w-32">Progress</TableHead>
                  <TableHead className="font-semibold w-32">Time</TableHead>
                  <TableHead className="font-semibold text-center w-40">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>

          {/* Scrollable Table Body */}
          <div className="overflow-auto h-[calc(100%-60px)]">
            <Table>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className={`transition-colors ${getRowBackground(
                      order.priority,
                      order.status
                    )}`}
                  >
                    {/* Order Details */}
                    <TableCell className="font-medium w-48">
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-900">
                          {order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-600">
                          Server: {order.table.server}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            ${order.total}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {order.estimatedDeliveryTime}min
                          </Badge>
                        </div>
                      </div>
                    </TableCell>

                    {/* Table & Customer */}
                    <TableCell className="w-64">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {order.table.number}
                        </div>
                        <Badge
                          className={`text-xs ${getSectionColor(
                            order.table.section
                          )}`}
                        >
                          {order.table.section}
                        </Badge>
                        <div className="text-sm text-gray-600 flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {order.customer.name}
                        </div>
                        <div className="text-xs text-gray-600 flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          Party of {order.customer.partySize} •{" "}
                          {order.table.seats} seats
                        </div>
                        {order.specialInstructions && (
                          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded border-l-2 border-blue-200">
                            <AlertTriangle className="h-3 w-3 inline mr-1" />
                            {order.specialInstructions}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Food Items */}
                    <TableCell className="w-48">
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm">
                            <div className="font-medium">
                              {item.quantity}x {item.name}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                              <span className="italic">{item.notes}</span>
                              <Badge variant="outline" className="text-xs">
                                {item.temperature}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TableCell>

                    {/* Priority */}
                    <TableCell className="w-24">
                      <div className={getPriorityColor(order.priority)}>
                        {order.priority.charAt(0).toUpperCase() +
                          order.priority.slice(1)}
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="w-32">
                      <Badge className={`${getStatusColor(order.status)}`}>
                        {order.status
                          .replace("_", " ")
                          .charAt(0)
                          .toUpperCase() +
                          order.status.replace("_", " ").slice(1)}
                      </Badge>
                    </TableCell>

                    {/* Progress */}
                    <TableCell className="w-32">
                      {order.status === "picked_up" ||
                      order.status === "out_for_delivery" ? (
                        <div className="space-y-1">
                          <Progress value={order.progress} className="h-2" />
                          <div className="text-xs text-center text-muted-foreground">
                            {Math.round(order.progress)}%
                          </div>
                        </div>
                      ) : order.status === "delivered" ? (
                        <div className="text-center">
                          <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                          <div className="text-xs text-green-600">Served</div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400">
                          <Package className="h-5 w-5 mx-auto" />
                          <div className="text-xs">Ready</div>
                        </div>
                      )}
                    </TableCell>

                    {/* Time */}
                    <TableCell className="w-32">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {getWaitTime(order.completedTime)}m ago
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <Timer className="h-3 w-3 inline mr-1" />
                          Kitchen done
                        </div>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-center w-40">
                      <div className="flex gap-1">
                        {order.status === "ready_for_delivery" && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => startPickup(order.id)}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Pickup
                          </Button>
                        )}

                        {order.status === "picked_up" && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => startDelivery(order.id)}
                          >
                            <Utensils className="h-3 w-3 mr-1" />
                            Serve
                          </Button>
                        )}

                        {order.status === "out_for_delivery" && (
                          <Button
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={() => completeDelivery(order.id)}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complete
                          </Button>
                        )}

                        {order.status === "delivered" && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Served
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredOrders.length === 0 && (
              <div className="flex h-32 items-center justify-center">
                <div className="text-center">
                  <Utensils className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-muted-foreground">
                    No orders ready for table service
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <footer className="sticky bottom-0 z-50 border-t bg-white/95 backdrop-blur-md p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span>Ready: {readyCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <span>Picked Up: {pickedUpCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-purple-500"></div>
              <span>Serving: {outForDeliveryCount}</span>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Active Table Service:</span>{" "}
            {filteredOrders.length}
          </div>
        </div>
      </footer>
    </div>
  );
}
