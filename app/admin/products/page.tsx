"use client";

import { useEffect, useState } from "react";
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
import { Clock, Edit, Eye, FolderPlus, Home, PlusCircle, Search, Trash2, Upload, X } from "lucide-react";
import Link from "next/link";
import useGetAllCategories from "@/hooks/get-all-categories";
import useGetAllTableType from "@/hooks/get-all-table-type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { menuService } from "@/service/menu-service";
import { all } from "axios";
import { categoryService } from "@/service/category-service";
import { Switch } from "@/components/ui/switch";
import MenusLoading from "./loading";

// Category definitions
// const categories = [
//   { id: "all", name: "All Categories" },
//   { id: "appetizers", name: "Appetizers" },
//   { id: "mains", name: "Main Courses" },
//   { id: "sides", name: "Sides" },
//   { id: "desserts", name: "Desserts" },
//   { id: "drinks", name: "Drinks" },
// ];

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
  const [newPrice, setNewPrice] = useState('0');
  const [newPriceTableType, setNewPriceTableType] = useState("1");
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedImageItem, setSelectedImageItem] = useState<MenuItem | null>(
    null
  );
  const [isCook, setIsCook] = useState(false);
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

  console.log(data,"product")

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

  // Delete menu item

  // Get price for the selected table type
  const getPriceForTableType = (item: MenuItem, tableType: string) => {
    const priceObj = item?.prices.find((p) => p?.tableType === tableType);
    return priceObj ? priceObj.price : item?.prices[0]?.price||"0.00";
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
                  className="text-green-600 border-green-600 hover:bg-green-50"
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
                <CardTitle>Menu Items (Click on price to edit)</CardTitle>
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems?.map((item:any) => {
                      //const CategoryIcon = getCategoryIcon(item.category);
                      return (
                        <TableRow key={item.id}>
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
                                onClick={() => openImageDialog(item)}
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
                              onClick={() => openPriceDialog(item)}
                            >
                              {Number.parseFloat(
                                getPriceForTableType(item, selectedTableType)
                              ).toFixed(2)}
                            </Button>
                          </TableCell>
                          {/* <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {item.rating}
                            </div>
                          </TableCell> */}
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
                            <div className="flex items-center gap-2">
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
                {/* <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No menu items found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredItems?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-12 w-12 overflow-hidden rounded-md border">
                                <img
                                  src={item?.image || "/placeholder.svg"}
                                  alt={item?.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => openImageDialog(item)}
                              >
                                <Upload className="h-4 w-4 mr-1" />
                                Browse
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.name}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                item.category === "appetizers"
                                  ? "bg-blue-100 text-blue-800 border-blue-200"
                                  : item.category === "mains"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : item.category === "sides"
                                  ? "bg-purple-100 text-purple-800 border-purple-200"
                                  : item.category === "desserts"
                                  ? "bg-amber-100 text-amber-800 border-amber-200"
                                  : "bg-rose-100 text-rose-800 border-rose-200"
                              }
                            >
                              {categories.find(
                                (c: any) => c.name === item.category
                              )?.name || item.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              className="px-2 font-mono"
                              onClick={() => openPriceDialog(item)}
                            >
                              {Number.parseFloat(
                                getPriceForTableType(item, selectedTableType)
                              ).toFixed(2)}
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
              <Label htmlFor="price">Price</Label>
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
