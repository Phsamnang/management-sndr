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
import { ChefService } from "@/service/chef-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {io} from "socket.io-client";


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

const queryClient=useQueryClient()

  const foods=useQuery({
    queryKey:["chef-foods"],
    queryFn:()=>ChefService.getFoods()
  })


  const updateFoodStatus=useMutation({
    mutationFn:(data:any)=>ChefService.updateFoodStatus(data),
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["chef-foods"]})
    }
  })


   useEffect(() => {
     // Connect to backend WebSocket server
     const socket = io("http://18.139.2.70:8080"); // 🔁 Replace with your server URL

     socket.on("connect", () => {
       console.log("Connected to WebSocket server");
     });

     // Listen for the 'new-order' event
     socket.on("foodOrdered", (data) => {
       queryClient.invalidateQueries({queryKey:["chef-foods"]})
     });

     // Clean up on component unmount
     return () => {
       socket.disconnect();
     };
   }, []);

  if(foods?.isLoading){
    return <div>Loading...</div>
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

  // Get category icon

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
      case"processing":
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

      <div className="flex-1 container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden h-[calc(100vh-200px)]">
          {/* Fixed Table Header */}
          <div className="sticky top-0 z-10 bg-white border-b">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold w-64">
                    Menu Item
                  </TableHead>
                  <TableHead className="font-semibold w-48">
                    Table & Customer
                  </TableHead>
                  <TableHead className="font-semibold w-24">Priority</TableHead>
                  <TableHead className="font-semibold w-24">Status</TableHead>
                  <TableHead className="font-semibold w-32">Progress</TableHead>
                  <TableHead className="font-semibold w-32">Time</TableHead>
                  <TableHead className="font-semibold text-center w-32">
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
                {filteredItems.map((item: any) => (
                  <TableRow
                    key={item.id}
                    className={`transition-colors ${getRowBackground(
                      item.priority,
                      item.status
                    )}`}
                  >
                    {/* Menu Item */}
                    <TableCell className="font-medium w-64">
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-900">
                          {item.food_name}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            x{item.qty}
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
                    <TableCell className="w-48">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">
                          {item.table_name}
                        </div>
                      </div>
                    </TableCell>

                    {/* Priority */}
                    <TableCell className="w-24">
                      <div className={getPriorityColor(item.priority)}></div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="w-24">
                      <Badge
                        className={`${getStatusColor(item.delivery_sts)}`}
                      ></Badge>
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
                    <TableCell className="w-32">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {getWaitTime(item.start_time)}m ago
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <Timer className="h-3 w-3 inline mr-1" />
                          {item.start_time}min cook
                        </div>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-center w-32">
                      {item.delivery_sts === "pending" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() =>
                            updateFoodStatus.mutate({
                              orderId: item.id,
                              status: "processing",
                            })
                          }
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Start
                        </Button>
                      )}

                      {item.delivery_sts === "processing" && (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() =>
                            updateFoodStatus.mutate({
                              orderId: item.id,
                              status: "shipped",
                            })
                          }
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
      </div>

      {/* Footer */}
      <footer className="border-t bg-white/90 backdrop-blur-md p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-orange-500"></div>
              <span>
                Pending:
                {
                  foods?.data?.filter(
                    (item: any) => item.delivery_sts === "pending"
                  ).length
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span>
                Cooking:
                {
                  foods?.data?.filter(
                    (item: any) => item.delivery_sts === "processing"
                  ).length
                }
              </span>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Active Items:</span>{" "}
          </div>
        </div>
      </footer>
    </div>
  );
}
