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
  Bell,
  CheckCircle,
  ChefHat,
  Clock,
  Home,
  Play,
  Timer,
  Utensils,
  Flame,
  Users,
  Star,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

// Sample menu items with cooking data
const initialMenuItems = [
  {
    id: "menu-1",
    name: "Classic Burger",
    table: "Table 5",
    customer: "John Smith",
    quantity: 2,
    notes: "One without onions",
    cookingTime: 12,
    difficulty: "medium",
    category: "grill",
    priority: "normal",
    status: "pending",
    progress: 0,
    startTime: null,
    orderTime: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: "menu-2",
    name: "Margherita Pizza",
    table: "Table 12",
    customer: "Sarah Johnson",
    quantity: 1,
    notes: "Extra cheese",
    cookingTime: 18,
    difficulty: "medium",
    category: "oven",
    priority: "high",
    status: "cooking",
    progress: 45,
    startTime: new Date(Date.now() - 8 * 60000).toISOString(),
    orderTime: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: "menu-3",
    name: "French Fries",
    table: "Table 5",
    customer: "John Smith",
    quantity: 2,
    notes: "",
    cookingTime: 8,
    difficulty: "easy",
    category: "fryer",
    priority: "normal",
    status: "pending",
    progress: 0,
    startTime: null,
    orderTime: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: "menu-4",
    name: "Grilled Salmon",
    table: "Table 8",
    customer: "Mike Wilson",
    quantity: 1,
    notes: "Medium well",
    cookingTime: 20,
    difficulty: "hard",
    category: "grill",
    priority: "normal",
    status: "completed",
    progress: 100,
    startTime: new Date(Date.now() - 25 * 60000).toISOString(),
    orderTime: new Date(Date.now() - 25 * 60000).toISOString(),
  },
  {
    id: "menu-5",
    name: "Chicken Wings",
    table: "Table 12",
    customer: "Sarah Johnson",
    quantity: 1,
    notes: "Extra spicy",
    cookingTime: 15,
    difficulty: "medium",
    category: "fryer",
    priority: "high",
    status: "pending",
    progress: 0,
    startTime: null,
    orderTime: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: "menu-6",
    name: "Caesar Salad",
    table: "Table 3",
    customer: "Emma Davis",
    quantity: 1,
    notes: "No croutons",
    cookingTime: 5,
    difficulty: "easy",
    category: "cold",
    priority: "urgent",
    status: "cooking",
    progress: 75,
    startTime: new Date(Date.now() - 4 * 60000).toISOString(),
    orderTime: new Date(Date.now() - 8 * 60000).toISOString(),
  },
  {
    id: "menu-7",
    name: "Garlic Bread",
    table: "Table 12",
    customer: "Sarah Johnson",
    quantity: 1,
    notes: "",
    cookingTime: 10,
    difficulty: "easy",
    category: "oven",
    priority: "high",
    status: "pending",
    progress: 0,
    startTime: null,
    orderTime: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: "menu-8",
    name: "Chocolate Cake",
    table: "Table 15",
    customer: "Robert Brown",
    quantity: 1,
    notes: "Birthday cake - add candle",
    cookingTime: 3,
    difficulty: "easy",
    category: "dessert",
    priority: "normal",
    status: "cooking",
    progress: 90,
    startTime: new Date(Date.now() - 3 * 60000).toISOString(),
    orderTime: new Date(Date.now() - 15 * 60000).toISOString(),
  },
];

type MenuItem = {
  id: string;
  name: string;
  table: string;
  customer: string;
  quantity: number;
  notes: string;
  cookingTime: number;
  difficulty: string;
  category: string;
  priority: "normal" | "high" | "urgent";
  status: "pending" | "cooking" | "completed";
  progress: number;
  startTime: string | null;
  orderTime: string;
};

export default function ChefTablePage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

  // Start cooking a menu item
  const startCooking = (itemId: string) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: "cooking" as const,
              progress: 0,
              startTime: new Date().toISOString(),
            }
          : item
      )
    );
  };

  // Complete cooking a menu item
  const completeCooking = (itemId: string) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: "completed" as const,
              progress: 100,
            }
          : item
      )
    );
  };

  // Auto-progress cooking items
  useEffect(() => {
    const interval = setInterval(() => {
      setMenuItems((prevItems) =>
        prevItems.map((item) => {
          if (item.status === "cooking" && item.startTime) {
            const elapsedTime =
              (Date.now() - new Date(item.startTime).getTime()) / 1000 / 60; // minutes
            const expectedTime = item.cookingTime;
            const progress = Math.min((elapsedTime / expectedTime) * 100, 99); // Cap at 99% until manually completed

            return {
              ...item,
              progress: progress,
            };
          }
          return item;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Filter menu items - only show pending and cooking items
  const filteredItems = menuItems.filter(
    (item) => item.status === "pending" || item.status === "cooking"
  );

  // Calculate wait time in minutes
  const getWaitTime = (orderTime: string) => {
    const receivedTime = new Date(orderTime).getTime();
    const currentTime = new Date().getTime();
    return Math.floor((currentTime - receivedTime) / 60000);
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "grill":
        return <Flame className="h-4 w-4" />;
      case "fryer":
        return <Utensils className="h-4 w-4" />;
      case "oven":
        return <Timer className="h-4 w-4" />;
      case "cold":
        return <Star className="h-4 w-4" />;
      case "dessert":
        return <Users className="h-4 w-4" />;
      default:
        return <ChefHat className="h-4 w-4" />;
    }
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
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "cooking":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get row background based on priority
  const getRowBackground = (priority: string, status: string) => {
    if (status === "completed") return "bg-green-50";
    if (priority === "urgent") return "bg-red-50";
    if (priority === "high") return "bg-orange-50";
    return "bg-white hover:bg-gray-50";
  };

  const pendingCount = menuItems.filter(
    (item) => item.status === "pending"
  ).length;
  const cookingCount = menuItems.filter(
    (item) => item.status === "cooking"
  ).length;
  const completedCount = menuItems.filter(
    (item) => item.status === "completed"
  ).length;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="border-b bg-white/90 backdrop-blur-md p-4 shadow-sm">
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
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                Chef Kitchen Table
              </h1>
              <p className="text-sm text-gray-500">
                Menu Items Cooking Progress
              </p>
            </div>
          </div>
          <div className="relative">
            <Bell className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
      </header>

      <div className="container mx-auto flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Menu Item</TableHead>
                <TableHead className="font-semibold">
                  Table & Customer
                </TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Priority</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Progress</TableHead>
                <TableHead className="font-semibold">Time</TableHead>
                <TableHead className="font-semibold text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow
                  key={item.id}
                  className={`transition-colors ${getRowBackground(
                    item.priority,
                    item.status
                  )}`}
                >
                  {/* Menu Item */}
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-900">
                        {item.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          x{item.quantity}
                        </Badge>
                        <Badge
                          className={`text-xs ${getDifficultyColor(
                            item.difficulty
                          )}`}
                        >
                          {item.difficulty}
                        </Badge>
                      </div>
                      {item.notes && (
                        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded border-l-2 border-blue-200">
                          <AlertTriangle className="h-3 w-3 inline mr-1" />
                          {item.notes}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Table & Customer */}
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900">
                        {item.table}
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.customer}
                      </div>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(item.category)}
                      <span className="capitalize text-sm">
                        {item.category}
                      </span>
                    </div>
                  </TableCell>

                  {/* Priority */}
                  <TableCell>
                    <div className={getPriorityColor(item.priority)}>
                      {item.priority.charAt(0).toUpperCase() +
                        item.priority.slice(1)}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge className={`${getStatusColor(item.status)}`}>
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </Badge>
                  </TableCell>

                  {/* Progress */}
                  <TableCell className="w-32">
                    {item.status === "cooking" ? (
                      <div className="space-y-1">
                        <Progress value={item.progress} className="h-2" />
                        <div className="text-xs text-center text-muted-foreground">
                          {Math.round(item.progress)}%
                        </div>
                      </div>
                    ) : item.status === "completed" ? (
                      <div className="text-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                        <div className="text-xs text-green-600">Done</div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        <Clock className="h-5 w-5 mx-auto" />
                        <div className="text-xs">Waiting</div>
                      </div>
                    )}
                  </TableCell>

                  {/* Time */}
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {getWaitTime(item.orderTime)}m ago
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <Timer className="h-3 w-3 inline mr-1" />
                        {item.cookingTime}min cook
                      </div>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-center">
                    {item.status === "pending" && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => startCooking(item.id)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                    )}

                    {item.status === "cooking" && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => completeCooking(item.id)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Button>
                    )}

                    {item.status === "completed" && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Done
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredItems.length === 0 && (
            <div className="flex h-32 items-center justify-center">
              <div className="text-center">
                <ChefHat className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-muted-foreground">No items found</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white/90 backdrop-blur-md p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-orange-500"></div>
              <span>Pending: {pendingCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span>Cooking: {cookingCount}</span>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Active Items:</span>{" "}
            {pendingCount + cookingCount}
          </div>
        </div>
      </footer>
    </div>
  );
}
