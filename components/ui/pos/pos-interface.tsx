"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Coffee,
  Utensils,
  UmbrellaIcon,
  HomeIcon as HouseIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import useGetAllTable from "@/hooks/get-all-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SaleService } from "@/service/sale-service";
import TableSelectionLoading from "./loading";

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
  const useClient = useQueryClient();

  const { tableInfo, isLoading } = useGetAllTable();

  const createSale = useMutation({
    mutationFn: (id: number) => SaleService.createSale(id),
    onSuccess: () => {
      router.push(`/dashboard/menu?table=${selectedTable}`);
      useClient.invalidateQueries({ queryKey: ["table"] });
    },
  });

  useEffect(() => {
    useClient.invalidateQueries({ queryKey: ["table"] });
  }, [selectedTable]);

  if (isLoading)
    return (
    <TableSelectionLoading/>
    );

  // Get unique categories from table data
  const categories = Array.from(
    new Set(tableInfo?.map((table: any) => table.category))
  );

  const handleTableSelect = (tableId: number) => {
    setSelectedTable(tableId);
    const table = tableInfo?.find((t: { id: number }) => t.id === tableId);
    if (table?.status === "occupied") {
      router.push(`/dashboard/menu?table=${tableId}`);
    }
  };

  const handleProceed = () => {
    createSale.mutate(selectedTable as number);
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
      case "indoor":
        return <Utensils className="h-3 w-3 sm:h-4 sm:w-4" />;
      case "vip":
        return <Users className="h-3 w-3 sm:h-4 sm:w-4" />;
      case "bar":
        return <Coffee className="h-3 w-3 sm:h-4 sm:w-4" />;
      case "outdoor":
        return <UmbrellaIcon className="h-3 w-3 sm:h-4 sm:w-4" />;
      default:
        return <HouseIcon className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-24 sm:pb-20">
        <div className="mx-auto max-w-6xl px-3 py-4 sm:p-4">
          <header className="mb-4 sm:mb-6">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                Select a Table
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Choose a table to place an order
              </p>
            </div>
          </header>

          <div className="space-y-4 sm:space-y-6">
            {/* Render tables by category */}
            {categories?.map((category: any) => (
              <section key={category}>
                <h2 className="mb-2 sm:mb-3 text-base sm:text-lg md:text-xl font-semibold flex items-center gap-2">
                  {getCategoryIcon(category)}
                  <span className="text-sm sm:text-base md:text-lg">
                    {category}
                  </span>
                </h2>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                  {tableInfo
                    .filter((table: any) => table.category === category)
                    .map((table: any) => (
                      <Card
                        key={table.id}
                        className={`border-2 transition-all cursor-pointer touch-manipulation ${
                          selectedTable === table.id
                            ? "ring-2 ring-green-500 ring-offset-1 sm:ring-offset-2"
                            : ""
                        } ${getTableStatusColor(table.status)}`}
                        onClick={() => handleTableSelect(table.id)}
                      >
                        <CardContent className="p-2 sm:p-3 text-center">
                          <div className="mb-1 text-sm sm:text-base md:text-lg font-bold">
                            Table {table.name}
                          </div>
                          <div className="text-xs sm:text-sm">
                            {table.seats} Seats
                          </div>
                          <div className="mt-1 text-xs capitalize">
                            {table.status}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Fixed Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 sm:p-4 safe-area-inset-bottom">
          <div className="mx-auto max-w-6xl">
            <Button
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold touch-manipulation min-h-[48px] sm:min-h-[56px]"
              disabled={!selectedTable}
              onClick={handleProceed}
            >
              {selectedTable ? (
                <span className="truncate">
                  Proceed to Menu - Table{" "}
                  {tableInfo?.find((t: any) => t.id === selectedTable)?.name}
                </span>
              ) : (
                "Select a Table to Continue"
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
