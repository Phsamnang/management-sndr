"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Minus,
  Plus,
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
import { log } from "console";
// Menu item type definition
type MenuItem = {
  id: number;
  name: string;
  price: number;
  category: string;
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
  const [qty,setQty]=useState(0)
  const [saleId,setSaleId]=useState(0)
  
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
  }, [searchParams, router]);


  const { data,isLoading } = useQuery({
    queryFn: () => menuService.getAllMenus(Number(tableParam)),
    queryKey: ["menus", tableParam],
  });

    const sales = useQuery({
      queryFn: () => SaleService.getSale(Number(tableParam)),
      queryKey: ["sale", tableParam],
    });

  const orderFood=useMutation({
    mutationFn:(data)=>SaleService.orderFood(data),
    onSuccess:()=>{
      useClient.invalidateQueries({ queryKey: ["saleItems"] });
    }
  })  

    const removeItem = useMutation({
      mutationFn: (id:number) => SaleService.removeItem(id),
      onSuccess: () => {
        useClient.invalidateQueries({ queryKey: ["saleItems"] });
      },
    });  

    const payment=useMutation({
      mutationFn:(data:any)=>SaleService.salePayment(data),
      onSuccess:()=>{
        router.push("/")
      }
    });

  useEffect(()=>{
    setSaleId(sales?.data?.id)
  },[sales?.data])


    const getItem = useQuery({
      queryFn: () => SaleService.getSaleById(saleId),
      queryKey: ["saleItems",tableParam],
    });

  // Get unique categories from menu items
  const categories = Array.from(
    new Set(data?.map((item:MenuItem) => item.category))
  ).sort();

  useEffect(() => {
    // Set default active category
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0] as string);
    }
  }, [categories, activeCategory]);

  const addToCart = (menusId:number,qty:number) => {
       const data={
        menusId:menusId,
        saleId:sales?.data?.id,
        qty:qty,
        tableId:tableId
       }

       orderFood.mutate(data as any);
  };

  const removeFromCart = (itemId: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === itemId);

      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prevCart.filter((item) => item.id !== itemId);
      }
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
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
              className="h-20 w-20 rounded-md object-cover"
            />
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-medium">{item.name}</h3>
                <p className="font-semibold">${item.price}</p>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2"></p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-16">
                    <Input
                      type="number"
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value);

                        setQty(value);
                      }}
                      className="h-8 text-center"
                    />
                  </div>
                  {!cartItem && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addToCart(item?.id, qty)}
                      className="bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 border-green-300"
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

  const handlePrintReceipt = () => {
    if (getItem?.data?.saleItemResponse.length > 0) {
      const table = tableInfo?.find((t:{id:number}) => t.id === tableId);

      // Create receipt content
      const receiptContent = `
        RESTAURANT RECEIPT
        -----------------
        ${new Date().toLocaleString()}
        
        Table: ${table ? `${table.name} (${table.category})` : tableId}
        
        ${getItem?.data?.saleItemResponse?.map(
            (item:any) =>
              `${item.name} x${item.quantity} $${(
                item.priceAtSale * item.quantity
              )}`
          )
          .join("\n")}
    
        Total: $${getItem?.data?.totalAmount}
        
        Payment Method: ${paymentType ? paymentType.toUpperCase() : "N/A"}
      `;

      // Create a new window for printing
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt</title>
              <style>
                body { font-family: monospace; padding: 20px; }
                pre { white-space: pre-wrap; }
              </style>
            </head>
            <body>
              <pre>${receiptContent}</pre>
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(function() { window.close(); }, 500);
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const getTableInfo = () => {
    if (!tableId) return null;
    return tableInfo?.find((t:{id:number}) => t.id === tableId);
  };

  const table = getTableInfo();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Menu Section */}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col">
          <header className="border-b bg-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => router.push("/")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Restaurant Menu</h1>
                {table && (
                  <p className="text-sm text-green-600 font-medium">
                    Order for Table {table.name} ({table.category})
                  </p>
                )}
              </div>
            </div>
          </header>

          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="flex-1"
          >
            <div className="border-b bg-white">
              <ScrollArea className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent p-0">
                  {categories.map((category: any) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {categories.map((category: any) => (
                <TabsContent key={category} value={category} className="mt-0">
                  {data
                    .filter((item: any) => item.category === category)
                    .map((item: any) => renderMenuItem(item))}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="w-96 border-l bg-white">
        <div className="flex h-full flex-col">
          <header className="border-b p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Current Order</h2>
                {table && (
                  <p className="text-sm text-green-600">
                    Table {table.number} ({table.category})
                  </p>
                )}
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <ShoppingCart className="h-4 w-4" />
                <span>{getCartItemCount()}</span>
              </Badge>
            </div>
          </header>

          <ScrollArea className="flex-1 p-4">
            {getItem?.data?.saleItemResponse?.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-muted-foreground">
                Your order is empty
              </div>
            ) : (
              <div className="space-y-4">
                {getItem?.data?.saleItemResponse?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.name}</span>
                        <span>{item.priceAtSale * item.quantity}</span>
                        <Button
                          onClick={() => removeItem.mutate(item?.id)}
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                          {item.priceAtSale} × {item.quantity}
                        </span>
                      </div>
                    </div>
                    {/* <div className="ml-4 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-5 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => addToCart(item.id, qty)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div> */}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="border-t p-4">
            <div className="space-y-2">
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${getItem?.data?.totalAmount}</span>
              </div>
            </div>

            {/* Payment Type Selection */}
            <div className="mt-4">
              <p className="mb-2 font-medium">Payment Method:</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  className={`flex flex-col items-center gap-1 py-3 ${
                    paymentType === "cash"
                      ? "bg-green-100 text-green-700 border-green-500"
                      : "hover:bg-green-50 hover:text-green-600"
                  }`}
                  onClick={() => setPaymentType("cash")}
                  disabled={getItem?.data?.saleItemResponse.length === 0}
                >
                  <Banknote className="h-5 w-5" />
                  <span className="text-xs">Cash</span>
                </Button>
                <Button
                  variant="outline"
                  className={`flex flex-col items-center gap-1 py-3 ${
                    paymentType === "credit"
                      ? "bg-green-100 text-green-700 border-green-500"
                      : "hover:bg-green-50 hover:text-green-600"
                  }`}
                  onClick={() => setPaymentType("credit")}
                  disabled={getItem?.data?.saleItemResponse.length === 0}
                >
                  <CreditCard className="h-5 w-5" />
                  <span className="text-xs">Credit</span>
                </Button>
                <Button
                  variant="outline"
                  className={`flex flex-col items-center gap-1 py-3 ${
                    paymentType === "digital"
                      ? "bg-green-100 text-green-700 border-green-500"
                      : "hover:bg-green-50 hover:text-green-600"
                  }`}
                  onClick={() => setPaymentType("digital")}
                  disabled={getItem?.data?.saleItemResponse.length === 0}
                >
                  <Wallet className="h-5 w-5" />
                  <span className="text-xs">Digital</span>
                </Button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                className="bg-white text-green-600 border-green-600 hover:bg-green-50"
                size="lg"
                disabled={getItem?.data?.saleItemResponse?.length === 0}
                onClick={handlePrintReceipt}
              >
                Print Receipt
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                size="lg"
                disabled={
                  getItem?.data?.saleItemResponse.length === 0 || !paymentType
                }

                onClick={()=>{
                  payment.mutate({
                    saleId: saleId,
                    paymentMethod:paymentType
                  });
                }}

              >
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
