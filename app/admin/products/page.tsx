"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Clock,
  Edit,
  Eye,
  FolderPlus,
  Home,
  PlusCircle,
  Search,
  Trash2,
  Upload,
  Settings,
} from "lucide-react";
import Link from "next/link";
import useGetAllCategories from "@/hooks/get-all-categories";
import useGetAllTableType from "@/hooks/get-all-table-type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { menuService } from "@/service/menu-service";
import { categoryService } from "@/service/category-service";
import { Switch } from "@/components/ui/switch";
import MenusLoading from "./loading";
import { productService } from "@/service/product-service";

type Price = {
  tableType: string;
  price: string;
};

type MenuItem = {
  id: number;
  name: string;
  category: string;
  prices: Price[];
};

type Category = {
  id: string;
  name: string;
};

export default function SimplifiedMenu() {
  const { categories, categoryLoading } = useGetAllCategories();
  const { tableType, tableTypeLoading } = useGetAllTableType();

  const [selectedCategory, setSelectedCategory] = useState("1");
  const [selectedTableType, setSelectedTableType] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", categoryId: "" });
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [newPrice, setNewPrice] = useState("0");
  const [newPriceTableType, setNewPriceTableType] = useState("");
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedImageItem, setSelectedImageItem] = useState<MenuItem | null>(
    null
  );
  const [isCook, setIsCook] = useState(false);
  const [defaultOrder, setDefualtOrder] = useState(1);
  const [productId, setProductId] = useState("");

  // New state for product edit dialog
  const [isProductEditDialogOpen, setIsProductEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [editCategory, setEditCategory] = useState("");
  const [editTableType, setEditTableType] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [useQty, setUseQty] = useState("");
  const [editPreparationTime, setEditPreparationTime] = useState("");
  const [editAvailable, setEditAvailable] = useState(true);

  const useClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["menusPrice"],
    queryFn: () => menuService.getAllMenusWithprices(),
  });

  const createMenu = useMutation({
    mutationFn: (data: any) => menuService.createMenu(data),
    onSuccess: () => {
      setIsAddDialogOpen(false);
      setNewItem({ name: "", categoryId: "" });
      useClient.invalidateQueries({ queryKey: ["menusPrice"] });
    },
  });
  const createCategory = useMutation({
    mutationFn: (data: any) => categoryService.createCategory(data),
    onSuccess: () => {
      setIsCategoryDialogOpen(false);
      setNewCategory({ name: "" });
      useClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateMenuPrice = useMutation({
    mutationFn: (data: any) => menuService.updatePrice(data),
    onSuccess: () => {
      setIsPriceDialogOpen(false);
      useClient.invalidateQueries({ queryKey: ["menusPrice"] });
    },
  });

  const updateMenuImage = useMutation({
    mutationFn: (data: any) => menuService.updateImage(data),
    onSuccess: () => {
      setIsImageDialogOpen(false);
      useClient.invalidateQueries({ queryKey: ["menusPrice"] });
    },
  });

  // Filter menu items based on selected category and search query
  const filteredItems = data?.filter((item: any) => {
    const matchesCategory =
      selectedCategory === "1" || item.category === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Add new menu item
  const handleAddMenuItem = () => {
    if (newItem.name && newItem.categoryId) {
      const newMenuItemWithPrices = {
        ...newItem,
        isCooked: isCook,
        defaultOrder,
      };

      createMenu.mutate(newMenuItemWithPrices);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.name) {
      const request = {
        ...newCategory,
      };
      createCategory.mutate(request);
    }
  };

  // Open price dialog for an item
  const openPriceDialog = (item: MenuItem) => {
    setSelectedItem(item);
    // Find the price for the currently selected table type, or default to the first price
    const currentPrice =
      item.prices.find((p) => p.tableType === selectedTableType) ||
      item.prices[0];
    setNewPrice(currentPrice?.price);
    setNewPriceTableType(currentPrice?.tableType);
    setIsPriceDialogOpen(true);
  };

  // Open product edit dialog
  const openProductEditDialog = (item: any) => {
    setSelectedProduct(item);
    setEditQuantity(item.defaultOrder || 1);
    setEditCategory(item.categoryId || "");
    setEditTableType(selectedTableType);
    setEditPrice(getPriceForTableType(item, selectedTableType));
    setEditPreparationTime(item.preparationTime || "");
    setEditAvailable(item.available);
    setIsProductEditDialogOpen(true);
  };

  // Update price for an item
  const updatePrice = () => {
    if (selectedItem && newPrice && newPriceTableType) {
      const request = {
        menuId: selectedItem.id,
        price: newPrice,
        tableTypeId: newPriceTableType,
      };

      updateMenuPrice.mutate(request);
      //setIsPriceDialogOpen(false);
    }
  };

  const { data: productData } = useQuery({
    queryKey: ["productData"],
    queryFn: () => productService.getAllProduct(),
  });

  const updateStockUsingQty = useMutation({
    mutationFn: (data: any) => menuService.updateStockUsingQty(data),
    onSuccess: () => {
      useClient.invalidateQueries({ queryKey: ["productData"] });
      setIsProductEditDialogOpen(false);
    },
  });

  // Delete menu item

  // Get price for the selected table type
  const getPriceForTableType = (item: MenuItem, tableType: string) => {
    const priceObj = item?.prices.find((p) => p?.tableType === tableType);
    return priceObj ? priceObj.price : item?.prices[0]?.price || "0.00";
  };

  const openImageDialog = (item: MenuItem) => {
    setSelectedImageItem(item);
    setIsImageDialogOpen(true);
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedImageItem) {
      const request = {
        menuId: selectedImageItem.id,
        image: file,
      };
      updateMenuImage.mutate(request);
      // Create a URL for the uploaded file
      // const imageUrl = URL.createObjectURL(file);

      // // Update the menu item with the new image
      // setMenuItems(
      //   menuItems.map((item) =>
      //     item.id === selectedImageItem.id ? { ...item, image: imageUrl } : item
      //   )
      // );

      //
      setSelectedImageItem(null);
    }
  };

  const [defualtOrderMap, setDefualtOrderMap] = useState<
    Record<number, number>
  >({});

  const updateDefualtOrder = useMutation({
    mutationFn: (data: any) => menuService.updateOrderDefualt(data),
    onSuccess: () => {
      useClient.invalidateQueries({ queryKey: ["menusPrice"] });
    },
  });

  if (categoryLoading || tableTypeLoading) return <MenusLoading />;

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
          <h1 className="text-2xl font-bold">
            Menu Management with Table Pricing
          </h1>
          <div className="flex items-center gap-2">
            <Dialog
              open={isCategoryDialogOpen}
              onOpenChange={setIsCategoryDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
                >
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>
                    Enter the name for the new menu category.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ name: e.target.value })}
                      placeholder="Enter category name"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCategoryDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleAddCategory}
                  >
                    Add Category
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Menu Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Menu Item</DialogTitle>
                  <DialogDescription>
                    Enter the name and category for the new menu item.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Menu Item Name</Label>
                    <Input
                      id="name"
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem({ ...newItem, name: e.target.value })
                      }
                      placeholder="Enter menu item name"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={isCook}
                      onCheckedChange={() => setIsCook(!isCook)}
                    />
                    <Label htmlFor="available">IsCook</Label>
                    <Label htmlFor="name">Defualt Order</Label>
                    <Input
                      id="name"
                      onChange={(e) =>
                        setDefualtOrder(Number.parseInt(e.target.value))
                      }
                      placeholder="Enter Defualt Order"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newItem.categoryId}
                      onValueChange={(value) =>
                        setNewItem({ ...newItem, categoryId: value })
                      }
                      required
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          ?.filter((cat: any) => cat.id !== "all")
                          .map((category: any) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleAddMenuItem}
                  >
                    Add Item
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="grid gap-6">
          {/* Categories Management */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories
                  .filter((cat) => cat.id !== "all")
                  .map((category) => (
                    <div key={category.id} className="flex items-center gap-1">
                      <Badge variant="outline" className={getCategoryColorClass(category.id)}>
                        {category.name}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteCategory(category.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card> */}

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category: any) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tableType">View Prices For</Label>
                  <Select
                    value={selectedTableType}
                    onValueChange={setSelectedTableType}
                  >
                    <SelectTrigger id="tableType">
                      <SelectValue placeholder="Select table type" />
                    </SelectTrigger>
                    <SelectContent>
                      {tableType?.map((type: any) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search menu items..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Menu Items Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Menu Items (Click on item to edit)</CardTitle>
                <Badge variant="outline" className="font-normal">
                  Showing prices for:{" "}
                  <span className="font-medium ml-1">
                    {
                      tableType?.find((t: any) => t.id === selectedTableType)
                        ?.name
                    }
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Prep Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Default Order</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems?.map((item: any) => {
                      const defualtOrderNum =
                        defualtOrderMap[item.id] || item.defaultOrder;
                      //const CategoryIcon = getCategoryIcon(item.category);
                      return (
                        <TableRow
                          key={item.id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => openProductEditDialog(item)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="h-12 w-12 rounded-md object-cover"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openImageDialog(item);
                                }}
                              >
                                <Upload className="h-4 w-4 mr-1" />
                                Browse
                              </Button>
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-gray-500 line-clamp-1">
                                  {item.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1 w-fit"
                            >
                              {item.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            <Button
                              variant="ghost"
                              className="px-2 font-mono"
                              onClick={(e) => {
                                e.stopPropagation();
                                openPriceDialog(item);
                              }}
                            >
                              {Number.parseFloat(
                                getPriceForTableType(item, selectedTableType)
                              ).toFixed(2)}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-gray-500" />
                              {item.preparationTime}min
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  item.available ? "default" : "destructive"
                                }
                              >
                                {item.available ? "Available" : "Unavailable"}
                              </Badge>
                              {item.popular && (
                                <Badge className="bg-orange-500 text-white">
                                  Popular
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                defaultValue={defualtOrderNum}
                                onClick={(e) => e.stopPropagation()}
                                onBlur={(e) => {
                                  const value = Number.parseInt(e.target.value);

                                  setDefualtOrderMap((prev) => ({
                                    ...prev,
                                    [item.id]: value,
                                  }));
                                  updateDefualtOrder.mutate({
                                    menuId: item.id,
                                    defaultOrder: value,
                                  });
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openProductEditDialog(item);
                                }}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Edit Dialog */}
      <Dialog
        open={isProductEditDialogOpen}
        onOpenChange={setIsProductEditDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Product: {selectedProduct?.name}</DialogTitle>
            <DialogDescription>
              Update product details, category, quantity, and pricing
              information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priceTableType">Product</Label>
                <Select
                  value={productId}
                  onValueChange={setProductId}
                >
                  <SelectTrigger id="priceTableType">
                    <SelectValue placeholder="Select table type" />
                  </SelectTrigger>
                  <SelectContent>
                    {productData?.map((type: any) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="qty">Using Qty</Label>
                <Input
                  id="qty"
                  onChange={(e) => setUseQty(e.target.value)}
                  placeholder="Enter quantity to use"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsProductEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                updateStockUsingQty.mutate({
                  menuId: selectedProduct.id,
                  productId: productId,
                  qty: useQty,
                });
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Price Edit Dialog */}
      <Dialog open={isPriceDialogOpen} onOpenChange={setIsPriceDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Price for {selectedItem?.name}</DialogTitle>
            <DialogDescription>
              Enter the price and select the table type.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="priceTableType">Table Type</Label>
              <Select
                value={newPriceTableType}
                onValueChange={setNewPriceTableType}
              >
                <SelectTrigger id="priceTableType">
                  <SelectValue placeholder="Select table type" />
                </SelectTrigger>
                <SelectContent>
                  {tableType?.map((type: any) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor=",price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPriceDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-700"
              onClick={updatePrice}
            >
              Update Price
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Upload Image for {selectedImageItem?.name}
            </DialogTitle>
            <DialogDescription>
              Select an image file to upload for this menu item.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="imageUpload">Choose Image</Label>
              <div className="flex items-center gap-4">
                {selectedImageItem && (
                  <div className="h-20 w-20 overflow-hidden rounded-md border">
                    <img
                      src={"/placeholder.svg"}
                      alt={selectedImageItem.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e)}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported formats: JPG, PNG, GIF (Max 5MB)
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsImageDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
