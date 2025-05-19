"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Grid,
  Users,
  Coffee,
  Utensils,
  UmbrellaIcon,
  HouseIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useGetAllTable from "@/hooks/get-all-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SaleService } from "@/service/sale-service";

// Table type definition
type TableStatus = "available" | "occupied" | "reserved" | "maintenance";

type Table = {
  id: number;
  number: number;
  seats: number;
  status: TableStatus;
  category: string;
};

export default function TableSelection() {
  const router = useRouter();
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const useClient=useQueryClient()

  const { tableInfo, isLoading } = useGetAllTable();


    const createSale = useMutation({
      mutationFn: (id: number) => SaleService.createSale(id),
      onSuccess: () => {
        router.push(`/dashboard/menu?table=${selectedTable}`);
        useClient.invalidateQueries(['table'])
      },
    });

  // Initial table data with dynamic categories
  const [tableData, setTableData] = useState<Table[]>([
    // Main Dining
    {
      id: 1,
      number: 1,
      seats: 2,
      status: "available",
      category: "Main Dining",
    },
    {
      id: 2,
      number: 2,
      seats: 2,
      status: "available",
      category: "Main Dining",
    },
    {
      id: 3,
      number: 3,
      seats: 4,
      status: "available",
      category: "Main Dining",
    },
    { id: 4, number: 4, seats: 4, status: "occupied", category: "Main Dining" },
    {
      id: 5,
      number: 5,
      seats: 6,
      status: "available",
      category: "Main Dining",
    },
    { id: 6, number: 6, seats: 6, status: "reserved", category: "Main Dining" },

    // VIP Section
    {
      id: 7,
      number: 7,
      seats: 8,
      status: "available",
      category: "VIP Section",
    },
    {
      id: 8,
      number: 8,
      seats: 8,
      status: "available",
      category: "VIP Section",
    },

    // Bar Area
    { id: 9, number: 9, seats: 2, status: "available", category: "Bar Area" },
    { id: 10, number: 10, seats: 2, status: "occupied", category: "Bar Area" },
    { id: 11, number: 11, seats: 2, status: "available", category: "Bar Area" },
    { id: 12, number: 12, seats: 2, status: "available", category: "Bar Area" },

    // Outdoor Patio
    {
      id: 13,
      number: 13,
      seats: 4,
      status: "available",
      category: "Outdoor Patio",
    },
    {
      id: 14,
      number: 14,
      seats: 4,
      status: "available",
      category: "Outdoor Patio",
    },
    {
      id: 15,
      number: 15,
      seats: 4,
      status: "reserved",
      category: "Outdoor Patio",
    },

    // Private Room
    {
      id: 16,
      number: 16,
      seats: 10,
      status: "available",
      category: "Private Room",
    },
    {
      id: 17,
      number: 17,
      seats: 12,
      status: "maintenance",
      category: "Private Room",
    },
  ]);

  if (isLoading) return <>Loading...</>;

  // Get unique categories from table data
  const categories = Array.from(
    new Set(tableInfo?.map((table) => table.category))
  );

  const handleTableSelect = (tableId: number) => {
    setSelectedTable(tableId);
    const table=tableInfo?.find((t:{id:number})=>t.id===tableId);
    if(table?.status==='occupied'){
      router.push(`/dashboard/menu?table=${tableId}`);
    }
  };



  const handleProceed = () => {
    // if (selectedTable) {
    //   // Navigate to menu page with selected table
    // }
    createSale.mutate(selectedTable as number)
  };

  const getTableStatusColor = (status: TableStatus) => {
    switch (status) {
      case "available":
        return "bg-green-100 border-green-500 hover:bg-green-200";
      case "occupied":
        return "bg-red-100 border-red-500 text-red-700 opacity-60";
      case "reserved":
        return "bg-amber-100 border-amber-500 text-amber-700 opacity-60 cursor-not-allowed";
      case "maintenance":
        return "bg-gray-100 border-gray-500 text-gray-700 opacity-60 cursor-not-allowed";
      default:
        return "bg-gray-100";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "main dining":
        return <Utensils className="h-5 w-5" />;
      case "vip section":
        return <Users className="h-5 w-5" />;
      case "bar area":
        return <Coffee className="h-5 w-5" />;
      case "outdoor patio":
        return <UmbrellaIcon className="h-5 w-5" />;
      default:
        return <HouseIcon className="h-5 w-5" />;
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      // Add a new table with the new category
      const newId = Math.max(...tableData.map((t) => t.id)) + 1;
      const newTableNumber = Math.max(...tableData.map((t) => t.number)) + 1;

      setTableData([
        ...tableData,
        {
          id: newId,
          number: newTableNumber,
          seats: 4,
          status: "available",
          category: newCategory.trim(),
        },
      ]);

      setNewCategory("");
      setShowAddCategory(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Select a Table</h1>
            <p className="text-muted-foreground">
              Choose a table to place an order
            </p>
          </div>
        </header>
        <div className="space-y-8">
          {/* Render tables by category */}
          {categories?.map((category) => (
            <section key={category}>
              <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
                {getCategoryIcon(category)} {category}
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {tableInfo
                  .filter((table) => table.category === category)
                  .map((table) => (
                    <Card
                      key={table.id}
                      className={`border-2 transition-all ${
                        selectedTable === table.id
                          ? "ring-2 ring-green-500 ring-offset-2"
                          : ""
                      } ${getTableStatusColor(table.status)}`}
                      onClick={() =>
                        handleTableSelect(table.id)
                      }
                    >
                      <CardContent className="p-4 text-center">
                        <div className="mb-1 text-2xl font-bold">
                          Table {table.name}
                        </div>
                        <div className="text-sm">{table.seats} Seats</div>
                        <div className="mt-2 text-xs capitalize">
                          {table.status}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8"
            disabled={!selectedTable}
            onClick={handleProceed}
          >
            Proceed to Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
