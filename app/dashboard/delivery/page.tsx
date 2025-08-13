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
import { deliveryService } from "@/service/delivery-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

  if (isLoading) return <div>Loading...</div>;

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
                    Order Number
                  </TableHead>
                  <TableHead className="font-semibold w-64">Table</TableHead>
                  <TableHead className="font-semibold w-48">
                    Food Items
                  </TableHead>
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
                {filteredOrders.map((order: any) => (
                  <TableRow
                    key={order.id}
                    className={`transition-colors ${getRowBackground(
                      order.priority,
                      order.delivery_sts
                    )}`}
                  >
                    {/* Order Details */}
                    <TableCell className="font-medium w-48">
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-900">
                          {order.id}
                        </div>
                      </div>
                    </TableCell>

                    {/* Table & Customer */}
                    <TableCell className="w-64">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {order.table_name}
                        </div>
                      </div>
                      {/* <Badge
                          className={`text-xs ${getSectionColor(
                            order.table.section
                          )}`}
                        >
                          {order.table.section}
                        </Badge> */}
                      {/* <div className="text-sm text-gray-600 flex items-center">
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
                      </div> */}
                    </TableCell>

                    {/* Food Items */}
                    <TableCell className="w-48">
                      <div className="space-y-1">
                        <div key={order.id} className="text-sm">
                          <div className="font-medium">
                            {order.name} x {order.qty}
                          </div>
                          {/* <div className="text-xs text-gray-500 flex items-center gap-2">
                              <span className="italic">{item.notes}</span>
                              <Badge variant="outline" className="text-xs">
                           
                              </Badge>
                            </div> */}
                        </div>
                      </div>
                    </TableCell>

                    {/* Priority */}
                    <TableCell className="w-24">
                      <div className={getPriorityColor(order.priority)}></div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="w-32">
                      <Badge
                        className={`${getStatusColor(order.delivery_sts)}`}
                      ></Badge>
                    </TableCell>

                    {/* Progress */}
                    <TableCell className="w-32">
                      <div className="text-center text-gray-400">
                        <Package className="h-5 w-5 mx-auto" />
                        <div className="text-xs">Ready</div>
                      </div>
                    </TableCell>

                    {/* Time */}
                    <TableCell className="w-32">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {getWaitTime(order.start_time)}m ago
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
                        {order.delivery_sts === "shipped" && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() =>
                              updateDelivery.mutate({
                                id: order.id,
                                status: "delivered",
                              })
                            }
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Pickup
                          </Button>
                        )}

                        {/* {order.status === "picked_up" && (
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
                        )} */}
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
          {/* <div className="flex items-center gap-6 text-sm text-muted-foreground">
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
          </div> */}

          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Active Table Service:</span>{" "}
            {filteredOrders.length}
          </div>
        </div>
      </footer>
    </div>
  );
}
