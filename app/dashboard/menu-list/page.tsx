'use client'

import type React from "react"

import { useState } from "react"
import { PlusCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/menu-ui/select"
import { toast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMutation, useQuery } from "@tanstack/react-query"
import { categoryService } from "@/service/category-service"
import { set } from "react-hook-form"
import { menuService } from "@/service/menu-service"
interface MenuItem {
  id: string
  name: string
  category: string
}

interface category{
  id:string,
  name:string
}

// Predefined categories
//const categories = ["Appetizer", "Main Course", "Dessert", "Beverage", "Side Dish", "Breakfast", "Lunch", "Dinner"]

export default function MenuPage() {

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Margherita Pizza",
      category: "Main Course",
    },
    {
      id: "2",
      name: "Caesar Salad",
      category: "Appetizer",
    },
    {
      id: "3",
      name: "Chocolate Brownie",
      category: "Dessert",
    },
  ])

  const [newItem, setNewItem] = useState({
    id:'',
    name: "",
    categoryId: "",
  })

  const[menuName,setMenuName]=useState<string>("")


  const [category,setCategory]=useState<category>({
    id:'',
    name:''
  })

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setMenuName(value )
    
  }

 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const req={
      name:menuName,
      categoryId:category.id
    }

    console.log("req",req)

    mutateMenu.mutate(req);

    // Basic validation
    // if (!newItem.name) {
    //   toast({
    //     title: "Error",
    //     description: "Menu name is required",
    //     variant: "destructive",
    //   })
    //   return
    // }

    // // Add new item to the list
    // const newMenuItem: MenuItem = {
    //   ...newItem,
    // }

    // setMenuItems((prev) => [...prev, newMenuItem])


    // // Close modal
    // setIsModalOpen(false)

    // toast({
    //   title: "Success",
    //   description: "Menu item added successfully",
    // })
  }
  const mutateMenu=useMutation({
    mutationFn:(data:any)=>{
      return menuService.createMenu(data)
    },
    onSuccess:()=>{
      toast({
        title: "Success",
        description: "Menu item added successfully",
      })
      setIsModalOpen(false)
    }
  })
  const categories=useQuery({
    queryFn:()=>categoryService.getCategory(),
    queryKey: ["categories"],
  })

  const handleCategoryChange = (value: string) => {
    setCategory({
      id:value,
      name:categories?.data?.filter((item:any)=>item?.id===value)[0].name
    })
    
  }
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Food Menu List</h1>

        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Menu Item
        </Button>
      </div>

      <Table>
        <TableCaption>List of menu items</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menuItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
            </TableRow>
          ))}

          {menuItems.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} className="text-center">
                No menu items yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>

            <div className="mb-4">
              <h2 className="text-lg font-semibold">Add New Menu Item</h2>
              <p className="text-sm text-gray-500">Fill in the details to add a new menu item to your list.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter menu name"
                    value={menuName}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <div className="col-span-3">
                    <Select value={category?.id} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                      {category?.name || "Select a category"}
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.data.map((category:any) => (
                          <SelectItem key={category.id} value={category?.id}>
                            {category?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="mr-2">
                  Cancel
                </Button>
                <Button type="submit">Save Menu Item</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

