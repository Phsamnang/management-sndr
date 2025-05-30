"use client";

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
import { FolderPlus, Home, PlusCircle, Search, X } from "lucide-react";
import Link from "next/link";
import useGetAllCategories from "@/hooks/get-all-categories";
import useGetAllTableType from "@/hooks/get-all-table-type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { menuService } from "@/service/menu-service";
import { all } from "axios";
import { categoryService } from "@/service/category-service";


// Category definitions
// const categories = [
//   { id: "all", name: "All Categories" },
//   { id: "appetizers", name: "Appetizers" },
//   { id: "mains", name: "Main Courses" },
//   { id: "sides", name: "Sides" },
//   { id: "desserts", name: "Desserts" },
//   { id: "drinks", name: "Drinks" },
// ];

// Table type definitions
const tableTypes = [
  { id: "standard", name: "Standard Tables" },
  { id: "bar", name: "Bar Area" },
  { id: "patio", name: "Patio/Outdoor" },
  { id: "private", name: "Private Dining" },
];

// Initial menu data
const initialMenuItems = [
  {
    id: 1,
    name: "Classic Burger",
    category: "mains",
    prices: [
      { tableType: "standard", price: "12.99" },
      { tableType: "bar", price: "10.99" },
      { tableType: "patio", price: "13.99" },
      { tableType: "private", price: "15.99" },
    ],
  },
  {
    id: 2,
    name: "Margherita Pizza",
    category: "mains",
    prices: [
      { tableType: "standard", price: "14.99" },
      { tableType: "bar", price: "14.99" },
      { tableType: "patio", price: "16.99" },
      { tableType: "private", price: "18.99" },
    ],
  },
  {
    id: 3,
    name: "Garlic Bread",
    category: "appetizers",
    prices: [
      { tableType: "standard", price: "5.99" },
      { tableType: "bar", price: "4.99" },
      { tableType: "patio", price: "5.99" },
      { tableType: "private", price: "7.99" },
    ],
  },
  {
    id: 4,
    name: "Caesar Salad",
    category: "appetizers",
    prices: [
      { tableType: "standard", price: "8.99" },
      { tableType: "bar", price: "7.99" },
      { tableType: "patio", price: "8.99" },
      { tableType: "private", price: "10.99" },
    ],
  },
  {
    id: 5,
    name: "French Fries",
    category: "sides",
    prices: [
      { tableType: "standard", price: "3.99" },
      { tableType: "bar", price: "3.99" },
      { tableType: "patio", price: "4.99" },
      { tableType: "private", price: "5.99" },
    ],
  },
  {
    id: 6,
    name: "Chocolate Cake",
    category: "desserts",
    prices: [
      { tableType: "standard", price: "6.99" },
      { tableType: "bar", price: "6.99" },
      { tableType: "patio", price: "7.99" },
      { tableType: "private", price: "8.99" },
    ],
  },
  {
    id: 7,
    name: "Soda",
    category: "drinks",
    prices: [
      { tableType: "standard", price: "2.99" },
      { tableType: "bar", price: "3.99" },
      { tableType: "patio", price: "3.49" },
      { tableType: "private", price: "4.99" },
    ],
  },
];

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
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [selectedCategory, setSelectedCategory] = useState("1");
  const [selectedTableType, setSelectedTableType] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", categoryId: "" });
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [newPrice, setNewPrice] = useState("");
  const [newPriceTableType, setNewPriceTableType] = useState("1");
   const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
   const [newCategory, setNewCategory] = useState({ name: "" });
  const useClient = useQueryClient();
  const {categories}=useGetAllCategories();
  const{tableType}=useGetAllTableType();
  const{data}=useQuery({
    queryKey:['menusPrice'],
    queryFn:()=>menuService.getAllMenusWithprices()
  })

  const createMenu=useMutation({
    mutationFn:(data:any)=>menuService.createMenu(data),
    onSuccess:()=>{
       setIsAddDialogOpen(false);
       setNewItem({ name: "", categoryId: "" });
       useClient.invalidateQueries({ queryKey: ["menusPrice"] });
    }
  })
   const createCategory = useMutation({
     mutationFn: (data: any) => categoryService.createCategory(data),
     onSuccess: () => {
       setIsCategoryDialogOpen(false);
       setNewCategory({name:''})
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






  // Filter menu items based on selected category and search query
  const filteredItems = data?.filter((item :any) => {
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
      };
     
      createMenu.mutate(newMenuItemWithPrices);
     
    }
  };

   const handleAddCategory = () => {
     if (newCategory.name) {
       const request = {
         ...newCategory
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
        tableTypeId:newPriceTableType
      };

      updateMenuPrice.mutate(request);
      //setIsPriceDialogOpen(false);
    }
  };

  // Delete menu item
  const deleteMenuItem = (id: number) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  // Get price for the selected table type
  const getPriceForTableType = (item: MenuItem, tableType: string) => {
    const priceObj = item?.prices.find((p) => p?.tableType === tableType);
    return priceObj ? priceObj.price : "0.00";
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
                        {categories?.filter((cat : any) => cat.id !== "all")
                          .map((category:any) => (
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
                              onClick={() => deleteMenuItem(item.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
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
    </div>
  );
}
