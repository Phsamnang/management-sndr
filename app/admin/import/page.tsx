"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Home,
  Eye,
  Trash2,
  Plus,
  Package,
  Save,
  Check,
  ChevronsUpDown,
  DollarSign,
  XCircle,
  CheckCircle,
  FileInput,
} from "lucide-react";
import Link from "next/link";
import { cn, formatCurrencyPrice } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { importService } from "@/service/import-service";
import useGetAllProducts from "@/hooks/get-all-products";

type Product = {
  id: string;
  name: string;
  qty: number;
  price: number;
  currency: string;
  total: number;
  paymentStatus: "Unpaid" | "Paid";
};

type ExistingProduct = {
  id: string;
  name: string;
  price: number;
  currency: string;
  category: string;
};

type ImportSession = {
  id: string;
  name: string;
  date: string;
  status: "In Progress" | "Completed";
};

export default function ImportProductsPage() {
  const [showImportForm, setShowImportForm] = useState(false);
  const [importSessions, setImportSessions] = useState<ImportSession[]>([]);
  const [currentImportSession, setCurrentImportSession] =
    useState<ImportSession | null>(null);
  const [importName, setImportName] = useState("");
  // const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const useClient = useQueryClient();
  const createImport = useMutation({
    mutationFn: (data: any) => importService.createImport(data),
    onSuccess: () => {
      useClient.invalidateQueries({ queryKey: ["getImport"] });
    },
  });

  const getImport = useQuery({
    queryFn: () => importService.getImportByDate(dateFilter),
    queryKey: ["getImport"],
  });

  const { products } = useGetAllProducts();

  const updatePaymentStatus = useMutation({
    mutationFn: (data: any) => importService.updateImportPaymentStatus(data),
    onSuccess: () => {
      useClient.invalidateQueries({ queryKey: ["getImport"] });
    },
  });

  const createImportDetails = useMutation({
    mutationFn: (data: any) => importService.createImportDetail(data),
    onSuccess: () => {
      useClient.invalidateQueries({ queryKey: ["getImport"] });
      setFormData({
        name: "",
        qty: "",
        price: "",
        currency: "USD",
        paymentStatus: "UNPAID",
      });
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    qty: "",
    price: "",
    currency: "USD",
    paymentStatus: "UNPAID" as "UNPAID" | "PAID",
  });
  const [errors, setErrors] = useState({
    name: "",
    qty: "",
    price: "",
  });
  const [open, setOpen] = useState(false);
  const [selectedExistingProduct, setSelectedExistingProduct] = useState("");

  // Sample existing products from menu with different currencies
  const existingProducts: ExistingProduct[] = [
    {
      id: "1",
      name: "Classic Burger",
      price: 12.99,
      currency: "USD",
      category: "Mains",
    },
    {
      id: "2",
      name: "Margherita Pizza",
      price: 60000,
      currency: "KHR",
      category: "Mains",
    },
    {
      id: "3",
      name: "Caesar Salad",
      price: 8.99,
      currency: "USD",
      category: "Appetizers",
    },
    {
      id: "4",
      name: "French Fries",
      price: 20000,
      currency: "KHR",
      category: "Sides",
    },
    {
      id: "5",
      name: "Grilled Salmon",
      price: 18.99,
      currency: "USD",
      category: "Mains",
    },
    {
      id: "6",
      name: "Chicken Wings",
      price: 40000,
      currency: "KHR",
      category: "Appetizers",
    },
    {
      id: "7",
      name: "Chocolate Cake",
      price: 6.99,
      currency: "USD",
      category: "Desserts",
    },
    {
      id: "8",
      name: "Iced Coffee",
      price: 15000,
      currency: "KHR",
      category: "Drinks",
    },
    {
      id: "9",
      name: "Garlic Bread",
      price: 5.99,
      currency: "USD",
      category: "Sides",
    },
    {
      id: "10",
      name: "Greek Salad",
      price: 35000,
      currency: "KHR",
      category: "Appetizers",
    },
  ];

  const currencies = [
    { value: "USD", label: "USD ($)", symbol: "$" },
    { value: "KHR", label: "Riel (៛)", symbol: "៛" },
  ];

  const paymentStatuses = [
    { value: "UNPAID", label: "UNPAID" },
    { value: "PAID", label: "PAID" },
  ];

  const validateForm = () => {
    const newErrors = {
      name: "",
      qty: "",
      price: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.qty || parseInt(formData.qty) <= 0) {
      newErrors.qty = "Quantity must be greater than 0";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.qty && !newErrors.price;
  };

  const createImportSession = () => {
    if (!importName.trim()) {
      alert("Please enter an import name");
      return;
    }

    const newImportSession: ImportSession = {
      id: `import-${Date.now()}`,
      name: importName.trim(),
      date: new Date().toISOString(),
      status: "In Progress",
    };

    setImportSessions([...importSessions, newImportSession]);
    setCurrentImportSession(newImportSession);
    setImportName("");
  };

  useEffect(() => {
    if (getImport?.data) {
      setShowImportForm(true);
    } else {
      setShowImportForm(false);
    }
  }, [getImport?.data]);

  // const addProduct = () => {
  //   if (validateForm()) {
  //     const qty = parseInt(formData.qty);
  //     const price = parseFloat(formData.price);
  //     const total = qty * price;

  //     const newProduct: Product = {
  //       id: `product-${Date.now()}`,
  //       name: formData.name.trim(),
  //       qty: qty,
  //       price: price,
  //       currency: formData.currency,
  //       total: total,
  //       paymentStatus: formData.paymentStatus,
  //     };

  //     setProducts([...products, newProduct]);
  //     setFormData({
  //       name: "",
  //       qty: "",
  //       price: "",
  //       currency: "USD",
  //       paymentStatus: "Unpaid",
  //     });
  //     setErrors({ name: "", qty: "", price: "" });
  //     setSelectedExistingProduct("");
  //   }
  // };

  const selectExistingProduct = (product: ExistingProduct) => {
    setFormData({
      ...formData,
      name: product.name,
      price: product.price.toString(),
      currency: product.currency,
    });
    setSelectedExistingProduct(product.name);
    setOpen(false);
  };

  // const removeProduct = (id: string) => {
  //   setProducts(products.filter((p) => p.id !== id));
  // };

  // const updateProductPaymentStatus = (
  //   id: string,
  //   newStatus: "UNPAID" | "PAID"
  // ) => {
  //   setPro ducts(
  //     products.map((product) =>
  //       product.id === id ? { ...product, paymentStatus: newStatus } : product
  //     )
  //   );
  // };

  // const saveAllProducts = () => {
  //   if (products.length > 0) {
  //     alert(`Successfully saved ${products.length} products to inventory!`);
  //     setProducts([]);
  //     setCurrentImportSession(null);
  //     setShowImportForm(false);

  //     // Update the import session status to completed
  //     if (currentImportSession) {
  //       setImportSessions(
  //         importSessions.map((session) =>
  //           session.id === currentImportSession.id
  //             ? { ...session, status: "Completed" }
  //             : session
  //         )
  //       );
  //     }
  //   }
  // };

  // const clearAll = () => {
  //   setProducts([]);
  //   setFormData({
  //     name: "",
  //     qty: "",
  //     price: "",
  //     currency: "USD",
  //     paymentStatus: "Unpaid",
  //   });
  //   setErrors({ name: "", qty: "", price: "" });
  //   setSelectedExistingProduct("");
  // };

  // const cancelImport = () => {
  //   if (products.length > 0) {
  //     if (
  //       !confirm(
  //         "Are you sure you want to cancel this import? All products will be lost."
  //       )
  //     ) {
  //       return;
  //     }
  //   }

  //   setProducts([]);
  //   setCurrentImportSession(null);
  //   setShowImportForm(false);
  // };

  // const getTotalValue = () => {
  //   // Group by currency and calculate totals
  //   const totals = products.reduce((acc, product) => {
  //     if (!acc[product.currency]) {
  //       acc[product.currency] = 0;
  //     }
  //     acc[product.currency] += product.total;
  //     return acc;
  //   }, {} as Record<string, number>);

  //   return totals;
  // };

  // const getTotalQuantity = () => {
  //   return products.reduce((sum, product) => sum + product.qty, 0);
  // };

  // const getPaidUnpaidCounts = () => {
  //   return products.reduce((acc, product) => {
  //     acc[product.paymentStatus] = (acc[product.paymentStatus] || 0) + 1;
  //     return acc;
  //   }, {} as Record<"Unpaid" | "Paid", number>);
  // };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-green-600 hover:text-green-700"
            >
              <Home className="h-5 w-5" />
              <span>Back to Menu</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            {showImportForm
              ? `Import: ${currentImportSession?.name}`
              : "Product Imports"}
          </h1>
        </div>
      </header>

      <div className="container mx-auto p-4 space-y-6">
        {!showImportForm ? (
          <>
            {/* Create Import Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileInput className="h-5 w-5" />
                  Create New Import
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="md:col-span-3">
                    <Label htmlFor="importName">Import Name</Label>
                    <Input
                      id="importName"
                      placeholder="Enter import name (e.g., Weekly Stock, Monthly Inventory)"
                      value={importName}
                      onChange={(e) => setImportName(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={() =>
                        createImport.mutate({
                          importDate: new Date(),
                        })
                      }
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Import
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Previous Imports */}
            {importSessions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Previous Imports</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Import Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {importSessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell className="font-medium">
                            {session.name}
                          </TableCell>
                          <TableCell>{formatDate(session.date)}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                session.status === "Completed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                              }
                            >
                              {session.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (session.status === "In Progress") {
                                  setCurrentImportSession(session);
                                  setShowImportForm(true);
                                } else {
                                  alert("This import has been completed.");
                                }
                              }}
                              disabled={session.status === "Completed"}
                            >
                              {session.status === "In Progress"
                                ? "Continue"
                                : "View"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {importSessions.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No Imports Created
                    </h3>
                    <p className="text-gray-500">
                      Start by creating your first import using the form above.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <>
            {/* Add Product Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Product
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-5">
                  <div className="md:col-span-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className={cn(
                            "w-full justify-between",
                            errors.name ? "border-red-500" : "",
                            !selectedExistingProduct && "text-muted-foreground"
                          )}
                        >
                          {selectedExistingProduct ||
                            formData.name ||
                            "Select existing product or type new name..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search products or type new name..."
                            value={formData.name}
                            onValueChange={(value) =>
                              setFormData({ ...formData, name: value })
                            }
                          />
                          <CommandList>
                            <CommandEmpty>
                              <div className="p-2">
                                <p className="text-sm text-gray-600 mb-2">
                                  No existing product found.
                                </p>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedExistingProduct("");
                                    setOpen(false);
                                  }}
                                  className="w-full"
                                >
                                  Use "{formData.name}" as new product
                                </Button>
                              </div>
                            </CommandEmpty>
                            <CommandGroup heading="Existing Products">
                              {products
                                ?.filter((product: any) =>
                                  product.name
                                    .toLowerCase()
                                    .includes(formData.name.toLowerCase())
                                )
                                .map((product: any) => (
                                  <CommandItem
                                    key={product.id}
                                    value={product.name}
                                    onSelect={() =>
                                      selectExistingProduct(product)
                                    }
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedExistingProduct === product.name
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    <div className="flex-1">
                                      <div className="font-medium">
                                        {product.name}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {formatCurrencyPrice(
                                          product.price,
                                          product.currency
                                        )}{" "}
                                        • {product.category}
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="qty">Quantity</Label>
                    <Input
                      id="qty"
                      type="number"
                      placeholder="0"
                      value={formData.qty}
                      onChange={(e) =>
                        setFormData({ ...formData, qty: e.target.value })
                      }
                      className={errors.qty ? "border-red-500" : ""}
                    />
                    {errors.qty && (
                      <p className="text-sm text-red-500 mt-1">{errors.qty}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step={formData.currency === "KHR" ? "100" : "0.01"}
                      placeholder={formData.currency === "KHR" ? "0" : "0.00"}
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className={errors.price ? "border-red-500" : ""}
                    />
                    {errors.price && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.price}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) =>
                        setFormData({ ...formData, currency: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem
                            key={currency.value}
                            value={currency.value}
                          >
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="paymentStatus">Payment Status</Label>
                    <Select
                      value={formData.paymentStatus}
                      onValueChange={(value: "UNPAID" | "PAID") =>
                        setFormData({ ...formData, paymentStatus: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    {formData.qty &&
                      formData.price &&
                      !errors.qty &&
                      !errors.price && (
                        <span>
                          Total:{" "}
                          <strong>
                            {formatCurrencyPrice(
                              parseInt(formData.qty || "0") *
                                parseFloat(formData.price || "0"),
                              formData.currency
                            )}
                          </strong>
                        </span>
                      )}
                  </div>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      createImportDetails.mutate({
                        ...formData,
                        importId: getImport?.data?.importRecord.importId,
                      });
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Product Statistics */}
            {getImport?.data?.importDetail?.length > 0 && (
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {formatCurrencyPrice(
                        getImport?.data?.importRecord?.totalAmountUsd,
                        "USD"
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Total USD</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrencyPrice(
                        getImport?.data?.importRecord?.totalAmountRiel,
                        "KHR"
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Total Reils</p>
                  </CardContent>
                </Card>
                {/* {Object.entries(getTotalValue()).map(([currency, total]) => (
                  <Card key={currency}>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-600">
                      
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Total Value ({currency})
                      </p>
                    </CardContent>
                  </Card>
                ))} */}
                <Card
                  style={{
                    width: 400,
                  }}
                >
                  <CardContent className="pt-8">
                    <span className="text-xl font-bold">UNDPIAD:</span>
                    <span className="text-xl font-bold text-red-600 ml-4">
                      {formatCurrencyPrice(
                        getImport?.data?.importRecord?.totalRemainingRiel,
                        "KHR"
                      )}
                    </span>
                    <span className="text-xl font-bold text-red-600 ml-4">
                      {formatCurrencyPrice(
                        getImport?.data?.importRecord?.totalRemainingUsd,
                        "USD"
                      )}
                    </span>

                    {/* <p className="text-xs text-muted-foreground">
                      Payment Status
                    </p> */}
                  </CardContent>
                  <CardContent>
                    <span className="text-xl font-bold">PAID:</span>
                    <span className="text-xl font-bold text-green-600 ml-4">
                      {formatCurrencyPrice(
                        getImport?.data?.importRecord?.totalPaidRiel,
                        "KHR"
                      )}
                    </span>
                    <span className="text-xl font-bold text-green-600 ml-4">
                      {formatCurrencyPrice(
                        getImport?.data?.importRecord?.totalPaidUsd,
                        "USD"
                      )}
                    </span>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Products List */}
            {getImport?.data?.importDetail?.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Products List</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline">Clear All</Button>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Save className="mr-2 h-4 w-4" />
                        Save All Products
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product Name</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Currency</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Payment Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getImport?.data?.importDetail?.map((product: any) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{product.qty}</Badge>
                            </TableCell>
                            <TableCell>
                              {formatCurrencyPrice(
                                product.unit_price,
                                product.currency
                              )}
                              {/* {product.unit_price} */}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  product.currency === "USD"
                                    ? "bg-blue-50 text-blue-700"
                                    : "bg-purple-50 text-purple-700"
                                }
                              >
                                {product.currency}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-semibold text-green-600">
                              {formatCurrencyPrice(
                                product.total_price,
                                product.currency
                              )}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={product.payment_status}
                                onValueChange={(status) =>
                                  updatePaymentStatus.mutate({
                                    importDetailId: product.id,
                                    paymentStatus: status,
                                  })
                                }
                              >
                                <SelectTrigger
                                  className={cn(
                                    "w-[120px] h-8",
                                    product.payment_status === "PAID"
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : "bg-red-50 text-red-700 border-red-200"
                                  )}
                                >
                                  <SelectValue>
                                    {product.payment_status === "PAID" ? (
                                      <CheckCircle className="h-3 w-3 mr-1 inline-block" />
                                    ) : (
                                      <XCircle className="h-3 w-3 mr-1 inline-block" />
                                    )}
                                    {product.payment_status}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {paymentStatuses.map((status) => (
                                    <SelectItem
                                      key={status.value}
                                      value={status.value}
                                    >
                                      {status.label === "PAID" ? (
                                        <CheckCircle className="h-3 w-3 mr-1 inline-block" />
                                      ) : (
                                        <XCircle className="h-3 w-3 mr-1 inline-block" />
                                      )}
                                      {status.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setShowPreview(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>

                  {/* Summary Row */}
                  <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total: {products?.length} products</span>
                      <span>Quantity:</span>
                      <div className="flex gap-4">
                        {/* {Object.entries(getTotalValue()).map(
                          ([currency, total]) => (
                            <span key={currency} className="text-green-600">
                             
                            </span>
                          )
                        )} */}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {products?.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No Products Added
                    </h3>
                    <p className="text-gray-500">
                      Start by adding your first product using the form above.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Product Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Complete information for this product
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Product Name</h4>
                  <p className="text-lg font-semibold">
                    {selectedProduct.name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Quantity</h4>
                    <p className="text-lg">{selectedProduct.qty}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Unit Price</h4>
                    <p className="text-lg">
                      {formatCurrencyPrice(
                        selectedProduct.price,
                        selectedProduct.currency
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Currency</h4>
                    <Badge
                      className={
                        selectedProduct.currency === "USD"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-purple-50 text-purple-700"
                      }
                    >
                      {selectedProduct.currency}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Total Value</h4>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrencyPrice(
                        selectedProduct.total,
                        selectedProduct.currency
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">Payment Status</h4>
                  <Badge
                    className={cn(
                      "capitalize text-lg px-3 py-1",
                      selectedProduct.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    )}
                  >
                    {selectedProduct.paymentStatus === "Paid" ? (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    {selectedProduct.paymentStatus}
                  </Badge>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Calculation
                  </h4>
                  <p className="text-sm text-gray-600">
                    {selectedProduct.qty} ×{" "}
                    {formatCurrencyPrice(
                      selectedProduct.price,
                      selectedProduct.currency
                    )}{" "}
                    ={" "}
                    {formatCurrencyPrice(
                      selectedProduct.total,
                      selectedProduct.currency
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
