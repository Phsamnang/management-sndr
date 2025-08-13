"use client";

import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingCart,
  CreditCard,
  Banknote,
  Wallet,
  ArrowLeft,
  X,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import useGetAllTable from "@/hooks/get-all-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { menuService } from "@/service/menu-service";
import { SaleService } from "@/service/sale-service";
import { InvoicePrint } from "./print";
import { useReactToPrint } from "react-to-print";
import { formatCurrencyPrice } from "@/lib/utils";

// Menu item type definition
type MenuItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  img: string;
};

type CartItem = MenuItem & {
  quantity: number;
};

type PaymentType = "cash" | "credit" | "digital" | null;

export default function RestaurantPOS() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentType, setPaymentType] = useState<PaymentType>(null);
  const [tableId, setTableId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const { tableInfo } = useGetAllTable();
  const [qty, setQty] = useState(0);
  const [saleId, setSaleId] = useState(0);
  const [showMobileCart, setShowMobileCart] = useState(false);

  const useClient = useQueryClient();
  const tableParam = searchParams.get("table");

  useEffect(() => {
    // Get table number from URL
    if (tableParam) {
      setTableId(Number.parseInt(tableParam, 10));
    } else {
      // Redirect back to table selection if no table is selected
      router.push("/");
    }
  }, []);

  const { data, isLoading } = useQuery({
    queryFn: () => menuService.getAllMenus(Number(tableParam)),
    queryKey: ["menus", tableParam],
  });


  console.log(data,"data")

  const sales = useQuery({
    queryFn: () => SaleService.getSale(Number(tableParam)),
    queryKey: ["sale", tableParam],
  });

  const orderFood = useMutation({
    mutationFn: (data) => SaleService.orderFood(data),
    onSuccess: () => {
      useClient.invalidateQueries({ queryKey: ["saleItems"] });
    },
  });

  const removeItem = useMutation({
    mutationFn: (id: number) => SaleService.removeItem(id),
    onSuccess: () => {
      useClient.invalidateQueries({ queryKey: ["saleItems"] });
    },
  });

  const payment = useMutation({
    mutationFn: (data: any) => SaleService.salePayment(data),
    onSuccess: () => {
      router.push("/");
    },
  });

  useEffect(() => {
    setSaleId(sales?.data?.id);
  }, [sales?.data]);

  const getItem = useQuery({
    queryFn: () => SaleService.getSaleById(saleId),
    queryKey: ["saleItems", tableParam],
  });


  // Get unique categories from menu items
  const categories = Array.from(
    new Set(data?.map((item: MenuItem) => item.category))
  ).sort();

  useEffect(() => {
    // Set default active category
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0] as string);
    }
  }, [categories, activeCategory]);

  const addToCart = (menusId: number, qty: number) => {
    const data = {
      menusId: menusId,
      saleId: sales?.data?.id,
      qty: qty,
      tableId: tableId,
    };

    orderFood.mutate(data as any);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const renderMenuItem = (item: MenuItem) => {
    const cartItem = cart?.find((cartItem) => cartItem.id === item.id);
    return (
      <Card key={item.id} className="mb-3">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <img
              src={item?.img || "/placeholder.svg"}
              alt={item?.name}
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-md object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <h3 className="font-medium text-sm sm:text-base truncate">
                  {item.name}
                </h3>
                <p className="font-semibold text-sm sm:text-base">
                  {formatCurrencyPrice(item.price,'KHR')}
                </p>
              </div>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-16">
                    <Input
                      type="number"
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value);
                        setQty(value);
                      }}
                      className="h-8 text-center text-sm"
                    />
                  </div>
                  {!cartItem && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addToCart(item?.id, qty)}
                      className="bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 border-green-300 text-xs sm:text-sm"
                    >
                      Add
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const getTableInfo = () => {
    if (!tableId) return null;
    return tableInfo?.find((t: { id: number }) => t.id === tableId);
  };

  const table = getTableInfo();
  const printRef = useRef<HTMLDivElement>(null);

  // Fixed useReactToPrint import and usage
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* Menu Section */}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col">
          <header className="border-b bg-white p-3 sm:p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 bg-transparent"
                onClick={() => router.push("/")}
              >
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold truncate">
                  Restaurant Menu
                </h1>
                {table && (
                  <p className="text-xs sm:text-sm text-green-600 font-medium truncate">
                    Order for Table {table.name} ({table.category})
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              className="lg:hidden flex items-center gap-2 ml-2 bg-transparent"
              onClick={() => setShowMobileCart(!showMobileCart)}
            >
              <ShoppingCart className="h-4 w-4" />
              <Badge variant="secondary" className="text-xs">
                {getItem?.data?.saleItemResponse?.length || 0}
              </Badge>
            </Button>
          </header>

          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="flex-1"
          >
            <div className="border-b bg-white">
              <ScrollArea className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent p-0 h-auto">
                  {categories.map((category: any) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="rounded-none border-b-2 border-transparent px-3 py-2 sm:px-4 text-xs sm:text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </div>

            <div className="flex-1 overflow-auto p-3 sm:p-4">
              {categories.map((category: any) => (
                <TabsContent key={category} value={category} className="mt-0">
                  {data
                    ?.filter((item: any) => item.category === category)
                    .map((item: any) => renderMenuItem(item))}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </div>

      {/* Order Summary Section */}
      <div
        className={`
        ${showMobileCart ? "fixed inset-0 z-50 bg-white" : "hidden"} 
        lg:relative lg:block lg:w-96 lg:border-l lg:bg-white
      `}
      >
        <div className="flex h-full flex-col">
          <header className="border-b p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold">
                    Current Order
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden h-8 w-8"
                    onClick={() => setShowMobileCart(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {table && (
                  <p className="text-xs sm:text-sm text-green-600 truncate">
                    Table {table.number} ({table.category})
                  </p>
                )}
              </div>
              <Badge variant="outline" className="flex items-center gap-1 ml-2">
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">{getCartItemCount()}</span>
              </Badge>
            </div>
          </header>

          <ScrollArea className="flex-1 p-3 sm:p-4">
            {getItem?.data?.saleItemResponse?.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-muted-foreground text-sm">
                Your order is empty
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {getItem?.data?.saleItemResponse?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <div
                      className={`flex-1 min-w-0 ${
                        item.quantity <= 0 ? "bg-red-600" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm sm:text-base truncate">
                          {item.name}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-sm sm:text-base">
                          
                            {formatCurrencyPrice(
                              item.priceAtSale * item.quantity,
                              "KHR"
                            )}
                          </span>
                          <Button
                            onClick={() => removeItem.mutate(item?.id)}
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 sm:h-7 sm:w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <span>
                          {formatCurrencyPrice(item.priceAtSale,'KHR')} × {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="border-t p-3 sm:p-4">
            <div className="space-y-2">
              <Separator />
              <div className="flex justify-between font-bold text-sm sm:text-base">
                <span>Total</span>
                <span>
                  {formatCurrencyPrice(getItem?.data?.totalAmount, "KHR")}
                </span>
              </div>
            </div>

            {/* Payment Type Selection */}
            <div className="mt-4">
              <p className="mb-2 font-medium text-sm sm:text-base">
                Payment Method:
              </p>
              <div className="grid grid-cols-3 gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  className={`flex flex-col items-center gap-1 py-2 sm:py-3 text-xs ${
                    paymentType === "cash"
                      ? "bg-green-100 text-green-700 border-green-500"
                      : "hover:bg-green-50 hover:text-green-600"
                  }`}
                  onClick={() => setPaymentType("cash")}
                  disabled={getItem?.data?.saleItemResponse?.length === 0}
                >
                  <Banknote className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Cash</span>
                </Button>
                <Button
                  variant="outline"
                  className={`flex flex-col items-center gap-1 py-2 sm:py-3 text-xs ${
                    paymentType === "credit"
                      ? "bg-green-100 text-green-700 border-green-500"
                      : "hover:bg-green-50 hover:text-green-600"
                  }`}
                  onClick={() => setPaymentType("credit")}
                  disabled={getItem?.data?.saleItemResponse?.length === 0}
                >
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Credit</span>
                </Button>
                <Button
                  variant="outline"
                  className={`flex flex-col items-center gap-1 py-2 sm:py-3 text-xs ${
                    paymentType === "digital"
                      ? "bg-green-100 text-green-700 border-green-500"
                      : "hover:bg-green-50 hover:text-green-600"
                  }`}
                  onClick={() => setPaymentType("digital")}
                  disabled={getItem?.data?.saleItemResponse?.length === 0}
                >
                  <Wallet className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Digital</span>
                </Button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                className="bg-white text-green-600 border-green-600 hover:bg-green-50 text-sm sm:text-base"
                size="lg"
                disabled={getItem?.data?.saleItemResponse?.length === 0}
                onClick={handlePrint}
              >
                Print Receipt
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base"
                size="lg"
                disabled={
                  getItem?.data?.saleItemResponse?.length === 0 || !paymentType
                }
                onClick={() => {
                  payment.mutate({
                    saleId: saleId,
                    paymentMethod: paymentType,
                  });
                }}
              >
                Checkout
              </Button>
            </div>
            <div className="hidden">
              {getItem?.data?.saleItemResponse?.length > 0 && (
                <InvoicePrint
                  ref={printRef}
                  invoice={getItem.data.saleItemResponse}
                  totalAmount={getItem?.data?.totalAmount}
                  invoiceNo={getItem?.data?.invoice}
                  saleDate={getItem?.data?.saleDate}
                  tableName={table?.name}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
