"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, MapPin, Clock, Home, Play, Utensils } from "lucide-react";
import Link from "next/link";
import { io } from "socket.io-client";
import { deliveryService } from "@/service/delivery-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DeliveryLoading from "./loading";

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
  const { data: deliveryFoods, isLoading } = useQuery({
    queryKey: ["deliveryFoods"],
    queryFn: deliveryService.getDeliveryFoods,
  });

  const queryClient = useQueryClient();
  const baseUrlAPI = process.env.NEXT_PUBLIC_POS_API;

  useEffect(() => {
    // Connect to backend WebSocket server
    const socket = io(baseUrlAPI); // 🔁 Replace with your server URL

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });
    socket.on("foodDelivery", (data) => {
      queryClient.invalidateQueries({ queryKey: ["deliveryFoods"] });
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const updateDelivery = useMutation({
    mutationFn: (data: any) => deliveryService.updateDelivery(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveryFoods"] });
    },
  });

  if (isLoading) return <DeliveryLoading />;

  // Filter orders - only show non-delivered orders
  const filteredOrders = deliveryFoods?.filter(
    (order: any) => order.status !== "shiped"
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

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-green-50 to-gray-100">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md p-2 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <Home className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-medium text-sm sm:text-base">Back</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1 sm:p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
              <Utensils className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                <span className="sm:hidden">Delivery</span>
                <span className="hidden sm:inline">
                  Table Service Dashboard
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Deliver completed orders to customer tables
              </p>
            </div>
          </div>
          <div className="relative">
            <Users className="h-4 w-4 sm:h-6 sm:w-6 text-muted-foreground" />
          </div>
        </div>
      </header>

      {/* Desktop Table Layout */}
      <div className="hidden lg:block flex-1 container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden h-[calc(100vh-200px)]">
          {/* Fixed Table Header */}
          <div className="sticky top-0 z-10 bg-white border-b">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 h-10">
                  <TableHead className="font-semibold text-xs py-1 px-2 w-32">
                    Order #
                  </TableHead>
                  <TableHead className="font-semibold text-xs py-1 px-2 w-40">
                    Table
                  </TableHead>
                  <TableHead className="font-semibold text-xs py-1 px-2 w-64">
                    Food Items
                  </TableHead>
                  <TableHead className="font-semibold text-xs py-1 px-2 w-24">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-xs py-1 px-2 w-24">
                    Time
                  </TableHead>
                  <TableHead className="font-semibold text-xs py-1 px-2 text-center w-24">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>

          {/* Scrollable Table Body */}
          <div className="overflow-auto h-[calc(100%-40px)]">
            <Table>
              <TableBody>
                {filteredOrders?.map((order: any) => (
                  <TableRow
                    key={order.id}
                    className={`transition-colors h-16 ${getRowBackground(
                      order.priority,
                      order.delivery_sts
                    )}`}
                  >
                    {/* Order Details */}
                    <TableCell className="font-medium text-xs py-1 px-2 w-32">
                      <div className="font-semibold text-gray-900 truncate">
                        #{order.id}
                      </div>
                    </TableCell>

                    {/* Table */}
                    <TableCell className="text-xs py-1 px-2 w-40">
                      <div className="font-medium text-gray-900 flex items-center">
                        <MapPin className="h-2 w-2 mr-1" />
                        <span className="truncate">{order.table_name}</span>
                      </div>
                    </TableCell>

                    {/* Food Items with Bigger Image */}
                    <TableCell className="text-xs py-1 px-2 w-64">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            order.image ||
                            "/placeholder.svg?height=40&width=40&text=Food"
                          }
                          alt={order.name}
                          className="h-10 w-10 rounded-md object-cover flex-shrink-0 border"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/placeholder.svg?height=40&width=40&text=Food";
                          }}
                        />
                        <div className="font-medium truncate">
                          {order.name} x {order.qty}
                        </div>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-xs py-1 px-2 w-24">
                      <Badge
                        className={`text-xs px-1 py-0 ${getStatusColor(
                          order.delivery_sts
                        )}`}
                      >
                        Ready
                      </Badge>
                    </TableCell>

                    {/* Time */}
                    <TableCell className="text-xs py-1 px-2 w-24">
                      <div className="flex items-center">
                        <Clock className="h-2 w-2 mr-1" />
                        <span>{getWaitTime(order.start_time)}m</span>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-center text-xs py-1 px-2 w-24">
                      {order.delivery_sts === "shipped" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white h-6 px-2 text-xs"
                          onClick={() =>
                            updateDelivery.mutate({
                              id: order.id,
                              status: "delivered",
                            })
                          }
                        >
                          <Play className="h-2 w-2 mr-1" />
                          Pickup
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredOrders?.length === 0 && (
              <div className="flex h-32 items-center justify-center">
                <div className="text-center">
                  <Utensils className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-muted-foreground text-sm">
                    No orders ready for table service
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="lg:hidden flex-1 p-3">
        <div className="space-y-2 h-[calc(100vh-140px)] overflow-auto">
          {filteredOrders?.map((order: any) => (
            <div
              key={order.id}
              className="bg-white rounded-lg border p-3 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm text-gray-900">
                      #{order.id}
                    </span>
                    <Badge
                      className={`text-xs px-1 py-0 ${getStatusColor(
                        order.delivery_sts
                      )}`}
                    >
                      Ready
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
                    <MapPin className="h-3 w-3" />
                    <span>{order.table_name}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={
                        order.image ||
                        "https://ik.imagekit.io/4paezevxw/menus/meal_11881092.png"
                      }
                      alt={order.name}
                      className="h-12 w-12 rounded-md object-cover flex-shrink-0 border"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://ik.imagekit.io/4paezevxw/menus/meal_11881092.png";
                      }}
                    />
                    <div className="text-sm font-medium text-gray-900">
                      {order.name} x {order.qty}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{getWaitTime(order.start_time)}m ago</span>
                  </div>
                </div>
              </div>

              {order.delivery_sts === "shipped" && (
                <Button
                  size="sm"
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-8"
                  onClick={() =>
                    updateDelivery.mutate({
                      id: order.id,
                      status: "delivered",
                    })
                  }
                >
                  <Play className="h-3 w-3 mr-1" />
                  Pickup Order
                </Button>
              )}
            </div>
          ))}

          {filteredOrders?.length === 0 && (
            <div className="flex h-32 items-center justify-center">
              <div className="text-center">
                <Utensils className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-muted-foreground text-sm">
                  No orders ready for delivery
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Footer */}
      <footer className="sticky bottom-0 z-50 border-t bg-white/95 backdrop-blur-md p-2 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-blue-500"></div>
              <span>Ready: {filteredOrders?.length || 0}</span>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-muted-foreground">
            <span className="font-medium">Active Orders:</span>{" "}
            {filteredOrders?.length || 0}
          </div>
        </div>
      </footer>
    </div>
  );
}
