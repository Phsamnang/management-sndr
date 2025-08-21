"use client";

import { useEffect } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import {
  Bell,
  CheckCircle,
  ChefHat,
  Clock,
  Home,
  Play,
  Timer,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { ChefService } from "@/service/chef-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";

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
  const queryClient = useQueryClient();

  const foods = useQuery({
    queryKey: ["chef-foods"],
    queryFn: () => ChefService.getFoods(),
  });

  const updateFoodStatus = useMutation({
    mutationFn: (data: any) => ChefService.updateFoodStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chef-foods"] });
    },
  });

  const baseUrlAPI = process.env.NEXT_PUBLIC_POS_API;

  useEffect(() => {
    // Connect to backend WebSocket server
    const socket = io(baseUrlAPI); // 🔁 Replace with your server URL

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    // Listen for the 'new-order' event
    socket.on("foodOrdered", (data) => {
      queryClient.invalidateQueries({ queryKey: ["chef-foods"] });
    });
    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  if (foods?.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Filter menu items - only show pending and cooking items
  const filteredItems = foods?.data?.filter(
    (item: any) =>
      item.delivery_sts === "pending" || item.delivery_sts === "processing"
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
      case "processing":
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

  // Mobile Card Component - Made Smaller
  const MobileOrderCard = ({ item }: { item: any }) => (
    <Card className="mb-2 shadow-sm border">
      <CardContent className="p-2">
        <div className="space-y-2">
          {/* Header with name and quantity */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-xs truncate">
                {item.food_name}
              </h3>
              <p className="text-xs text-gray-600">{item.table_name}</p>
            </div>
            <Badge variant="outline" className="text-xs ml-1 px-1 py-0">
              x{item.qty}
            </Badge>
          </div>

          {/* Status and Priority */}
          <div className="flex items-center gap-1 flex-wrap">
            <Badge
              className={`text-xs px-1 py-0 ${getStatusColor(
                item.delivery_sts
              )}`}
            >
              {item.delivery_sts}
            </Badge>
            {item.difficulty && (
              <Badge
                className={`text-xs px-1 py-0 ${getDifficultyColor(
                  item.difficulty
                )}`}
              >
                {item.difficulty}
              </Badge>
            )}
          </div>

          {/* Notes */}
          {item.notes && (
            <div className="text-xs text-blue-600 bg-blue-50 px-1 py-1 rounded border-l-2 border-blue-200">
              <AlertTriangle className="h-2 w-2 inline mr-1" />
              {item.notes}
            </div>
          )}

          {/* Progress */}
          <div className="space-y-1">
            {item.status === "cooking" ? (
              <div className="space-y-1">
                <Progress value={item.progress} className="h-1" />
                <div className="text-xs text-center text-muted-foreground">
                  {Math.round(item.progress)}%
                </div>
              </div>
            ) : item.status === "completed" ? (
              <div className="flex items-center justify-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">Done</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1">
                <Clock className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-400">Waiting</span>
              </div>
            )}
          </div>

          {/* Time and Actions */}
          <div className="flex items-center justify-between pt-1 border-t">
            <div className="text-xs text-muted-foreground">
              <Clock className="h-2 w-2 inline mr-1" />
              {getWaitTime(item.start_time)}m ago
            </div>

            <div className="flex gap-1">
              {item.delivery_sts === "pending" && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 h-6"
                  onClick={() =>
                    updateFoodStatus.mutate({
                      orderId: item.id,
                      status: "processing",
                    })
                  }
                >
                  <Play className="h-2 w-2 mr-1" />
                  Start
                </Button>
              )}

              {item.delivery_sts === "processing" && (
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 h-6"
                  onClick={() =>
                    updateFoodStatus.mutate({
                      orderId: item.id,
                      status: "shipped",
                    })
                  }
                >
                  <CheckCircle className="h-2 w-2 mr-1" />
                  Complete
                </Button>
              )}

              {item.status === "completed" && (
                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs px-1 py-0">
                  <CheckCircle className="h-2 w-2 mr-1" />
                  Done
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Compact Header */}
      <header className="border-b bg-white/90 backdrop-blur-md p-2 sm:p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors"
            >
              <Home className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="font-medium text-xs sm:text-sm">Back</span>
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-center">
            <div className="p-1 sm:p-1.5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-md sm:rounded-lg shadow-lg">
              <ChefHat className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                Chef Kitchen
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Cooking Progress
              </p>
            </div>
          </div>

          <div className="relative">
            <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-2 sm:p-3">
        {/* Desktop Table View - Compact */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden h-[calc(100vh-140px)]">
            {/* Fixed Table Header - Smaller */}
            <div className="sticky top-0 z-10 bg-white border-b">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 h-8">
                    <TableHead className="font-semibold text-xs py-1 px-2 w-48">
                      Menu Item
                    </TableHead>
                    <TableHead className="font-semibold text-xs py-1 px-2 w-32">
                      Table
                    </TableHead>
                    <TableHead className="font-semibold text-xs py-1 px-2 w-20">
                      Priority
                    </TableHead>
                    <TableHead className="font-semibold text-xs py-1 px-2 w-20">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-xs py-1 px-2 w-24">
                      Progress
                    </TableHead>
                    <TableHead className="font-semibold text-xs py-1 px-2 w-20">
                      Time
                    </TableHead>
                    <TableHead className="font-semibold text-xs py-1 px-2 text-center w-24">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>

            {/* Scrollable Table Body - Compact Rows */}
            <div className="overflow-auto h-[calc(100%-32px)]">
              <Table>
                <TableBody>
                  {filteredItems?.map((item: any) => (
                    <TableRow
                      key={item.id}
                      className={`transition-colors h-12 ${getRowBackground(
                        item.priority,
                        item.status
                      )}`}
                    >
                      {/* Menu Item - Compact */}
                      <TableCell className="font-medium py-1 px-2 w-48">
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900 text-xs truncate">
                            {item.food_name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge
                              variant="outline"
                              className="text-xs px-1 py-0"
                            >
                              x{item.qty}
                            </Badge>
                            <Badge
                              className={`text-xs px-1 py-0 ${getDifficultyColor(
                                item.difficulty
                              )}`}
                            >
                              {item.difficulty}
                            </Badge>
                          </div>
                          {item.notes && (
                            <div className="text-xs text-blue-600 bg-blue-50 px-1 py-0 rounded border-l-2 border-blue-200">
                              <AlertTriangle className="h-2 w-2 inline mr-1" />
                              {item.notes}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Table - Compact */}
                      <TableCell className="py-1 px-2 w-32">
                        <div className="font-medium text-gray-900 text-xs truncate">
                          {item.table_name}
                        </div>
                      </TableCell>

                      {/* Priority - Compact */}
                      <TableCell className="py-1 px-2 w-20">
                        <div
                          className={`${getPriorityColor(
                            item.priority
                          )} text-xs`}
                        ></div>
                      </TableCell>

                      {/* Status - Compact */}
                      <TableCell className="py-1 px-2 w-20">
                        <Badge
                          className={`${getStatusColor(
                            item.delivery_sts
                          )} text-xs px-1 py-0`}
                        >
                          {item.delivery_sts}
                        </Badge>
                      </TableCell>

                      {/* Progress - Compact */}
                      <TableCell className="py-1 px-2 w-24">
                        {item.status === "cooking" ? (
                          <div className="space-y-1">
                            <Progress value={item.progress} className="h-1" />
                            <div className="text-xs text-center text-muted-foreground">
                              {Math.round(item.progress)}%
                            </div>
                          </div>
                        ) : item.status === "completed" ? (
                          <div className="text-center">
                            <CheckCircle className="h-3 w-3 text-green-600 mx-auto" />
                            <div className="text-xs text-green-600">Done</div>
                          </div>
                        ) : (
                          <div className="text-center text-gray-400">
                            <Clock className="h-3 w-3 mx-auto" />
                            <div className="text-xs">Waiting</div>
                          </div>
                        )}
                      </TableCell>

                      {/* Time - Compact */}
                      <TableCell className="py-1 px-2 w-20">
                        <div className="space-y-1">
                          <div className="text-xs font-medium">
                            <Clock className="h-2 w-2 inline mr-1" />
                            {getWaitTime(item.start_time)}m
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <Timer className="h-2 w-2 inline mr-1" />
                            {item.start_time}min
                          </div>
                        </div>
                      </TableCell>

                      {/* Actions - Compact */}
                      <TableCell className="text-center py-1 px-2 w-24">
                        {item.delivery_sts === "pending" && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 h-6"
                            onClick={() =>
                              updateFoodStatus.mutate({
                                orderId: item.id,
                                status: "processing",
                              })
                            }
                          >
                            <Play className="h-2 w-2 mr-1" />
                            Start
                          </Button>
                        )}

                        {item.delivery_sts === "processing" && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 h-6"
                            onClick={() =>
                              updateFoodStatus.mutate({
                                orderId: item.id,
                                status: "shipped",
                              })
                            }
                          >
                            <CheckCircle className="h-2 w-2 mr-1" />
                            Complete
                          </Button>
                        )}

                        {item.status === "completed" && (
                          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs px-1 py-0">
                            <CheckCircle className="h-2 w-2 mr-1" />
                            Done
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredItems?.length === 0 && (
                <div className="flex h-20 items-center justify-center">
                  <div className="text-center">
                    <ChefHat className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                    <p className="text-muted-foreground text-xs">
                      No items found
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Card View - Compact */}
        <div className="lg:hidden">
          <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
            {filteredItems?.length === 0 ? (
              <div className="flex h-20 items-center justify-center">
                <div className="text-center">
                  <ChefHat className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                  <p className="text-muted-foreground text-xs">
                    No items found
                  </p>
                </div>
              </div>
            ) : (
              filteredItems?.map((item: any) => (
                <MobileOrderCard key={item.id} item={item} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Compact Footer */}
      <footer className="border-t bg-white/90 backdrop-blur-md p-2 sm:p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-orange-500"></div>
              <span>
                Pending:{" "}
                {foods?.data?.filter(
                  (item: any) => item.delivery_sts === "pending"
                ).length || 0}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span>
                Cooking:{" "}
                {foods?.data?.filter(
                  (item: any) => item.delivery_sts === "processing"
                ).length || 0}
              </span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            <span className="font-medium">
              Active: {filteredItems?.length || 0}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
