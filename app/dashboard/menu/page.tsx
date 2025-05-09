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
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter, useSearchParams } from "next/navigation";

// Menu data structure
const menuData = {
  appetizers: [
    {
      id: 1,
      name: "Garlic Bread",
      price: 5.99,
      description: "Toasted bread with garlic butter and herbs",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: "Mozzarella Sticks",
      price: 7.99,
      description: "Breaded mozzarella with marinara sauce",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      name: "Chicken Wings",
      price: 9.99,
      description: "Spicy buffalo wings with blue cheese dip",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 4,
      name: "Loaded Nachos",
      price: 8.99,
      description: "Tortilla chips with cheese, jalapeños, and salsa",
      image: "/placeholder.svg?height=80&width=80",
    },
  ],
  mains: [
    {
      id: 5,
      name: "Classic Burger",
      price: 12.99,
      description: "Beef patty with lettuce, tomato, and special sauce",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 6,
      name: "Margherita Pizza",
      price: 14.99,
      description: "Tomato sauce, mozzarella, and fresh basil",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 7,
      name: "Grilled Salmon",
      price: 18.99,
      description: "Served with seasonal vegetables and lemon butter",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 8,
      name: "Chicken Alfredo",
      price: 15.99,
      description:
        "Fettuccine pasta with creamy alfredo sauce and grilled chicken",
      image: "/placeholder.svg?height=80&width=80",
    },
  ],
  sides: [
    {
      id: 9,
      name: "French Fries",
      price: 3.99,
      description: "Crispy golden fries with sea salt",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 10,
      name: "Onion Rings",
      price: 4.99,
      description: "Beer-battered onion rings",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 11,
      name: "Side Salad",
      price: 4.99,
      description: "Mixed greens with house dressing",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 12,
      name: "Mashed Potatoes",
      price: 4.99,
      description: "Creamy mashed potatoes with gravy",
      image: "/placeholder.svg?height=80&width=80",
    },
  ],
  desserts: [
    {
      id: 13,
      name: "Chocolate Cake",
      price: 6.99,
      description: "Rich chocolate cake with ganache",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 14,
      name: "Cheesecake",
      price: 7.99,
      description: "New York style with berry compote",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 15,
      name: "Ice Cream Sundae",
      price: 5.99,
      description: "Vanilla ice cream with chocolate sauce and nuts",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 16,
      name: "Apple Pie",
      price: 6.99,
      description: "Warm apple pie with cinnamon and vanilla ice cream",
      image: "/placeholder.svg?height=80&width=80",
    },
  ],
  drinks: [
    {
      id: 17,
      name: "Soda",
      price: 2.99,
      description: "Cola, lemon-lime, or root beer",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 18,
      name: "Iced Tea",
      price: 2.99,
      description: "Sweet or unsweetened",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 19,
      name: "Coffee",
      price: 3.49,
      description: "Regular or decaf",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 20,
      name: "Milkshake",
      price: 5.99,
      description: "Chocolate, vanilla, or strawberry",
      image: "/placeholder.svg?height=80&width=80",
    },
  ],
};

type MenuItem = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
};

type CartItem = MenuItem & {
  quantity: number;
};

type PaymentType = "cash" | "credit" | "digital" | null;

// Table data for lookup
const tableInfo = [
  { id: 1, number: 1, category: "Main Dining" },
  { id: 2, number: 2, category: "Main Dining" },
  { id: 3, number: 3, category: "Main Dining" },
  { id: 4, number: 4, category: "Main Dining" },
  { id: 5, number: 5, category: "Main Dining" },
  { id: 6, number: 6, category: "Main Dining" },
  { id: 7, number: 7, category: "VIP Section" },
  { id: 8, number: 8, category: "VIP Section" },
  { id: 9, number: 9, category: "Bar Area" },
  { id: 10, number: 10, category: "Bar Area" },
  { id: 11, number: 11, category: "Bar Area" },
  { id: 12, number: 12, category: "Bar Area" },
  { id: 13, number: 13, category: "Outdoor Patio" },
  { id: 14, number: 14, category: "Outdoor Patio" },
  { id: 15, number: 15, category: "Outdoor Patio" },
  { id: 16, number: 16, category: "Private Room" },
  { id: 17, number: 17, category: "Private Room" },
];

export default function RestaurantPOS() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentType, setPaymentType] = useState<PaymentType>(null);
  const [tableId, setTableId] = useState<number | null>(null);

  useEffect(() => {
    // Get table number from URL
    const tableParam = searchParams.get("table");
    if (tableParam) {
      setTableId(Number.parseInt(tableParam, 10));
    } else {
      // Redirect back to table selection if no table is selected
      router.push("/");
    }
  }, [searchParams, router]);

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
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
    const cartItem = cart.find((cartItem) => cartItem.id === item.id);

    return (
      <Card key={item.id} className="mb-3">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              className="h-20 w-20 rounded-md object-cover"
            />
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-medium">{item.name}</h3>
                <p className="font-semibold">${item.price.toFixed(2)}</p>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
              <div className="mt-2 flex items-center gap-2">
                {cartItem ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center">{cartItem.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => addToCart(item)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addToCart(item)}
                    className="bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 border-green-300"
                  >
                    Add
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const handlePrintReceipt = () => {
    if (cart.length > 0) {
      const table = tableInfo.find((t) => t.id === tableId);

      // Create receipt content
      const receiptContent = `
        RESTAURANT RECEIPT
        -----------------
        ${new Date().toLocaleString()}
        
        Table: ${table ? `${table.number} (${table.category})` : tableId}
        
        ${cart
          .map(
            (item) =>
              `${item.name} x${item.quantity} $${(
                item.price * item.quantity
              ).toFixed(2)}`
          )
          .join("\n")}
        
        Subtotal: $${getCartTotal().toFixed(2)}
        Tax (8%): $${(getCartTotal() * 0.08).toFixed(2)}
        Total: $${(getCartTotal() * 1.08).toFixed(2)}
        
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
    return tableInfo.find((t) => t.id === tableId);
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
                    Order for Table {table.number} ({table.category})
                  </p>
                )}
              </div>
            </div>
          </header>

          <Tabs defaultValue="appetizers" className="flex-1">
            <div className="border-b bg-white">
              <ScrollArea className="w-full" orientation="horizontal">
                <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent p-0">
                  <TabsTrigger
                    value="appetizers"
                    className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Appetizers
                  </TabsTrigger>
                  <TabsTrigger
                    value="mains"
                    className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Main Courses
                  </TabsTrigger>
                  <TabsTrigger
                    value="sides"
                    className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Sides
                  </TabsTrigger>
                  <TabsTrigger
                    value="desserts"
                    className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Desserts
                  </TabsTrigger>
                  <TabsTrigger
                    value="drinks"
                    className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Drinks
                  </TabsTrigger>
                </TabsList>
              </ScrollArea>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <TabsContent value="appetizers" className="mt-0">
                {menuData.appetizers.map(renderMenuItem)}
              </TabsContent>
              <TabsContent value="mains" className="mt-0">
                {menuData.mains.map(renderMenuItem)}
              </TabsContent>
              <TabsContent value="sides" className="mt-0">
                {menuData.sides.map(renderMenuItem)}
              </TabsContent>
              <TabsContent value="desserts" className="mt-0">
                {menuData.desserts.map(renderMenuItem)}
              </TabsContent>
              <TabsContent value="drinks" className="mt-0">
                {menuData.drinks.map(renderMenuItem)}
              </TabsContent>
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
            {cart.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-muted-foreground">
                Your order is empty
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                          ${item.price.toFixed(2)} × {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
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
                        onClick={() => addToCart(item)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="border-t p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${(getCartTotal() * 1.08).toFixed(2)}</span>
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
                  disabled={cart.length === 0}
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
                  disabled={cart.length === 0}
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
                  disabled={cart.length === 0}
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
                disabled={cart.length === 0}
                onClick={handlePrintReceipt}
              >
                Print Receipt
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                size="lg"
                disabled={cart.length === 0 || !paymentType}
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
