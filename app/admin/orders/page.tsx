"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Eye, Printer, Calendar, Package, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SaleService } from "@/service/sale-service";
import { formatDate, formatRiels } from "@/lib/utils";
import Loading from "./loading";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { InvoicePrint } from "@/app/dashboard/menu/print";

export default function OrdersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const printRef = useRef<HTMLDivElement>(null);
  const [saleData, setSaleData] = useState<any>(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  }); 

  // Load from searchParams on first render
  useEffect(() => {
    const start =
      searchParams.get("startDate") ?? new Date().toISOString().split("T")[0];
    const end =
      searchParams.get("endDate") ?? new Date().toISOString().split("T")[0];

    setDateFilter({ startDate: start, endDate: end });
  }, [searchParams]);

  // Update URL when local state changes
  useEffect(() => {
    if (!dateFilter.startDate || !dateFilter.endDate) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("startDate", dateFilter.startDate);
    params.set("endDate", dateFilter.endDate);

    router.push(`${pathname}?${params.toString()}`);
  }, [dateFilter]);

  // Input change handler
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { mutate: refetchSaleData } = useMutation({
    mutationFn: (id:number) => SaleService.getPrintSale(id),
    onSuccess: (data) => {
      setSaleData(data);
    },
  });

  useEffect(() => {
    if (saleData) {
      handlePrint();
    }
  }, [saleData]);

  const saleList = useQuery({
    queryFn: () =>
      SaleService.getSaleByDate(dateFilter.startDate, dateFilter.endDate),
    queryKey: ["saleList", dateFilter],
  });

  // Print functionality
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    onAfterPrint() {
        setSaleData(null);
    },
  });


  // Handle print button click

  if (saleList.isLoading) return <Loading />;

  const getOrderStatus = (index: number) => {
    const statuses = [
      "completed",
      "pending",
      "processing",
      "completed",
      "completed",
    ];
    return statuses[index % statuses.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage and track all orders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Total Orders</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {saleList?.data?.totalSales}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {formatRiels(saleList?.data?.totalAmount)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">UNPAID</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {formatRiels(saleList?.data?.unPaidSales)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Total Amount</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {formatRiels(saleList?.data?.totalAmountSales)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="startDate" className="text-sm font-medium">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                name="startDate"
                value={dateFilter.startDate}
                onChange={(e) => handleDateChange(e)}
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="endDate" className="text-sm font-medium">
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                name="endDate"
                value={dateFilter.endDate}
                onChange={(e) => handleDateChange(e)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 text-sm font-medium">
                <div className="col-span-2">Sale ID</div>
                <div className="col-span-2">Table</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-2">Payment Type</div>
                <div className="col-span-2">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y">
                {saleList?.data?.sales.map((order: any, index: number) => {
                  const status = getOrderStatus(index);
                  return (
                    <div
                      key={order.id}
                      className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/50"
                    >
                      <div className="col-span-2">
                        <p className="font-medium">{order.referenceId}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="font-medium">{order.tableName}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm">{formatDate(order.saleDate)}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm">
                          {formatRiels(order.totalAmount)}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="font-medium">
                          {order.paymentMethod.toUpperCase()}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              refetchSaleData(order.id);
                            }}
                            className="flex items-center gap-1 text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <Printer className="h-3 w-3" />
                            <span className="hidden sm:inline">Print</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
                          >
                            <Eye className="h-3 w-3" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Responsive Cards */}
          <div className="block sm:hidden divide-y">
            {saleList?.data?.sales.map((order: any, index: number) => (
              <div key={order.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">
                      Sale ID: {order.referenceId}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Table: {order.tableName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">
                      {formatRiels(order.totalAmount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.paymentMethod.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    {formatDate(order.saleDate)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        refetchSaleData(order.id);
                      }}
                      className="flex items-center gap-1 text-green-600 border-green-600 hover:bg-green-50"
                    >
                      <Printer className="h-3 w-3" />
                      Print
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="">
        {saleData && <InvoicePrint ref={printRef} data={saleData} />}
      </div>
    </div>
  );
}
