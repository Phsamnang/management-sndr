"use client";
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Users, MapPin, Edit, Trash2, Eye, Settings } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tableService } from "@/service/table-service";
import { formatDate } from "@/lib/utils";

interface Table {
  id: string;
  name: string;
  number: string;
  type: string;
  capacity: number;
  section: string;
  status: "available" | "occupied" | "reserved" | "maintenance";
  description?: string;
  createdAt: Date;
}

interface TableType {
  value: string;
  label: string;
  icon: string;
}

const sections = [
  { value: "main", label: "Main Dining", color: "bg-blue-100 text-blue-800" },
  { value: "patio", label: "Patio", color: "bg-green-100 text-green-800" },
  { value: "bar", label: "Bar Area", color: "bg-orange-100 text-orange-800" },
  {
    value: "vip",
    label: "VIP Section",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "window",
    label: "Window Side",
    color: "bg-yellow-100 text-yellow-800",
  },
];

const statusColors:any = {
  available: "bg-green-100 text-green-800",
  occupied: "bg-red-100 text-red-800",
  reserved: "bg-blue-100 text-blue-800",
  maintenance: "bg-gray-100 text-gray-800",
};

export default function TablesPage() {
  const [tableTypes, setTableTypes] = useState<TableType[]>([
    { value: "standard", label: "Standard Table", icon: "🪑" },
    { value: "booth", label: "Booth", icon: "🛋️" },
    { value: "bar", label: "Bar Table", icon: "🍺" },
    { value: "outdoor", label: "Outdoor Table", icon: "🌳" },
    { value: "private", label: "Private Dining", icon: "🏛️" },
    { value: "counter", label: "Counter Seating", icon: "🥢" },
  ]);

  const [tables, setTables] = useState<Table[]>([
    {
      id: "1",
      name: "Window View Table",
      number: "T001",
      type: "standard",
      capacity: 4,
      section: "main",
      status: "available",
      description: "Near the window with city view",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "Family Booth",
      number: "T002",
      type: "booth",
      capacity: 6,
      section: "main",
      status: "occupied",
      description: "Comfortable booth seating",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "3",
      name: "Sports Bar Table",
      number: "B001",
      type: "bar",
      capacity: 2,
      section: "bar",
      status: "available",
      description: "High bar table",
      createdAt: new Date("2024-01-16"),
    },
    {
      id: "4",
      name: "Garden Patio",
      number: "P001",
      type: "outdoor",
      capacity: 4,
      section: "patio",
      status: "reserved",
      description: "Outdoor patio seating",
      createdAt: new Date("2024-01-16"),
    },
    {
      id: "5",
      name: "Executive Suite",
      number: "V001",
      type: "private",
      capacity: 8,
      section: "vip",
      status: "available",
      description: "Private dining room",
      createdAt: new Date("2024-01-17"),
    },
  ]);
  const useClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddTypeModalOpen, setIsAddTypeModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [newTable, setNewTable] = useState({
    name: "",
    number: "",
    type: "",
    capacity: 2,
    section: "",
    status: "available" as const,
    description: "",
  });
  const [newTableType, setNewTableType] = useState({
    value: "",
    label: "",
    icon: "🪑",
  });

  const handleAddTable = () => {
    if (!newTable.name) return;

    const table: Table = {
      id: Date.now().toString(),
      name: newTable.name,
      number: newTable.number,
      type: newTable.type,
      capacity: newTable.capacity,
      section: newTable.section,
      status: newTable.status,
      description: newTable.description,
      createdAt: new Date(),
    };

    createTable.mutate({
      name: table.name,
      typeId: table.type,
    });

    setTables([...tables, table]);
   
  };

  const createTable = useMutation({
    mutationFn: (data: any) => tableService.createTable(data),
    onSuccess: () => {
      useClient.invalidateQueries({ queryKey: ["allTables"] });
       setNewTable({
         name: "",
         number: "",
         type: "",
         capacity: 2,
         section: "",
         status: "available",
         description: "",
       });
      setIsAddModalOpen(false);
    },
  });

  const typeList = useQuery({
    queryFn: () => tableService.getAllTableTypes(),
    queryKey: ["allTableType"],
  });

  const tableList = useQuery({
    queryFn: () => tableService.getAllTables(),
    queryKey: ["allTables"],
  });

  const handleAddTableType = () => {
    const tableType: TableType = {
      value: newTableType.value.toLowerCase().replace(/\s+/g, "-"),
      label: newTableType.label,
      icon: newTableType.icon,
    };

    createTypeTable.mutate({
      name: tableType.label,
    });
  };

  const handleEditTable = (table: Table) => {
    setEditingTable(table);
    setNewTable({
      name: table.name,
      number: table.number,
      type: table.type,
      capacity: table.capacity,
      section: table.section,
      status: table.status,
      description: table.description || "",
    });
  };

  const handleUpdateTable = () => {
    if (
      !editingTable ||
      !newTable.name ||
      !newTable.number ||
      !newTable.type ||
      !newTable.section
    )
      return;

    setTables(
      tables.map((table) =>
        table.id === editingTable.id
          ? {
              ...table,
              name: newTable.name,
              number: newTable.number,
              type: newTable.type,
              capacity: newTable.capacity,
              section: newTable.section,
              status: newTable.status,
              description: newTable.description,
            }
          : table
      )
    );

    setEditingTable(null);
    setNewTable({
      name: "",
      number: "",
      type: "",
      capacity: 2,
      section: "",
      status: "available",
      description: "",
    });
  };

  const createTypeTable = useMutation({
    mutationFn: (data: any) => tableService.createTypeTable(data),
    onSuccess: () => {
      setIsAddTypeModalOpen(false);
      useClient.invalidateQueries({ queryKey: ["allTableType"] });
    },
  });

  const handleDeleteTable = (id: string) => {
    setTables(tables.filter((table) => table.id !== id));
  };

  const handleDeleteTableType = (value: string) => {
    // Don't allow deletion if tables are using this type
    const tablesUsingType = tables.filter((table) => table.type === value);
    if (tablesUsingType.length > 0) {
      alert(
        `Cannot delete table type "${getTypeLabel(value)}" because ${
          tablesUsingType.length
        } table(s) are using it.`
      );
      return;
    }
    setTableTypes(tableTypes.filter((type) => type.value !== value));
  };

  const getTypeLabel = (type: string) => {
    return tableTypes.find((t) => t.value === type)?.label || type;
  };

  const getTypeIcon = (type: string) => {
    return tableTypes.find((t) => t.value === type)?.icon || "🪑";
  };

  const getSectionLabel = (section: string) => {
    return sections.find((s) => s.value === section)?.label || section;
  };

  const getSectionColor = (section: string) => {
    return (
      sections.find((s) => s.value === section)?.color ||
      "bg-gray-100 text-gray-800"
    );
  };

  const availableTables = tableList?.data?.filter(
    (t: any) => t.status === "available"
  ).length;
  const occupiedTables = tableList?.data?.filter(
    (t: any) => t.status === "occupied"
  ).length;
  const reservedTables = tableList?.data?.filter(
    (t: any) => t.status === "reserved"
  ).length;


  const commonIcons = [
    "🪑",
    "🛋️",
    "🍺",
    "🌳",
    "🏛️",
    "🥢",
    "🍽️",
    "☕",
    "🥂",
    "🎪",
    "🏖️",
    "🎭",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Table Management
                </h1>
              </div>
            </div>

            <div className="flex space-x-3">
              <Dialog
                open={isAddTypeModalOpen}
                onOpenChange={setIsAddTypeModalOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Add Table Type
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Table Type</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="type-label">Type Name</Label>
                      <Input
                        id="type-label"
                        placeholder="e.g., High Top, Communal Table"
                        value={newTableType.label}
                        onChange={(e) =>
                          setNewTableType({
                            ...newTableType,
                            label: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <Label className="text-sm text-gray-600">Preview:</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="font-medium">
                          {newTableType.label || "Table Type Name"}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleAddTableType}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={!newTableType.label}
                    >
                      Add Table Type
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Table
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Table</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Table Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Window View Table, Family Booth"
                        value={newTable.name}
                        onChange={(e) =>
                          setNewTable({ ...newTable, name: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="type">Table Type</Label>
                      <Select
                        value={newTable.type}
                        onValueChange={(value) =>
                          setNewTable({ ...newTable, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select table type" />
                        </SelectTrigger>
                        <SelectContent>
                          {typeList?.data?.map((type: any) => (
                            <SelectItem key={type.id} value={type.id}>
                              <div className="flex items-center space-x-2">
                                <span>{type.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={handleAddTable}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={!newTable.name}
                    >
                      Add Table
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Table Types Management Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Table Types ({typeList?.data?.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {typeList?.data?.map((type: any) => {
              return (
                <Card
                  key={type.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center space-y-2">
                      <span className="font-medium text-sm text-center">
                        {type.name}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-3xl font-bold text-green-600">
                    {availableTables}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Occupied</p>
                  <p className="text-3xl font-bold text-red-600">
                    {occupiedTables}
                  </p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reserved</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {reservedTables}
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Tables
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {tableList?.data?.length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tables Grid */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            All Tables ({tables.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tableList?.data?.map((table: any) => (
              <Card
                key={table.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                      <div className="flex flex-col">
                        <span>{table.name}</span>
                      </div>
                    </CardTitle>
                    <Badge className={statusColors[table.status]}>
                      {table.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">
                      {getTypeLabel(table.category)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-xs text-gray-500">
                      Added {formatDate(table.createdAt)}
                    </span>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Table Details - {table.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Table Name</Label>
                                <p className="font-medium">{table.name}</p>
                              </div>
                              <div>
                                <Label>Table Number</Label>
                                <p className="font-medium">{table.number}</p>
                              </div>
                              <div>
                                <Label>Type</Label>
                                <p className="font-medium">
                                  {getTypeLabel(table.type)}
                                </p>
                              </div>
                              <div>
                                <Label>Capacity</Label>
                                <p className="font-medium">
                                  {table.capacity} people
                                </p>
                              </div>
                              <div>
                                <Label>Section</Label>
                                <p className="font-medium">
                                  {getSectionLabel(table.section)}
                                </p>
                              </div>
                              <div>
                                <Label>Status</Label>
                                <Badge className={statusColors[table.status]}>
                                  {table.status}
                                </Badge>
                              </div>
                              <div>
                                <Label>Created</Label>
                                <p className="font-medium">
                                  {formatDate(table.createdAt)}
                                </p>
                              </div>
                            </div>
                            {table.description && (
                              <div>
                                <Label>Description</Label>
                                <p className="font-medium">
                                  {table.description}
                                </p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTable(table)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Edit Table - {table.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="edit-name">Table Name</Label>
                              <Input
                                id="edit-name"
                                value={newTable.name}
                                onChange={(e) =>
                                  setNewTable({
                                    ...newTable,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div>
                              <Label htmlFor="edit-number">Table Number</Label>
                              <Input
                                id="edit-number"
                                value={newTable.number}
                                onChange={(e) =>
                                  setNewTable({
                                    ...newTable,
                                    number: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div>
                              <Label htmlFor="edit-type">Table Type</Label>
                              <Select
                                value={newTable.type}
                                onValueChange={(value) =>
                                  setNewTable({ ...newTable, type: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {tableTypes.map((type) => (
                                    <SelectItem
                                      key={type.value}
                                      value={type.value}
                                    >
                                      <div className="flex items-center space-x-2">
                                        <span>{type.icon}</span>
                                        <span>{type.label}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="edit-capacity">Capacity</Label>
                              <Input
                                id="edit-capacity"
                                type="number"
                                min="1"
                                max="20"
                                value={newTable.capacity}
                                onChange={(e) =>
                                  setNewTable({
                                    ...newTable,
                                    capacity:
                                      Number.parseInt(e.target.value) || 2,
                                  })
                                }
                              />
                            </div>

                            <div>
                              <Label htmlFor="edit-section">Section</Label>
                              <Select
                                value={newTable.section}
                                onValueChange={(value) =>
                                  setNewTable({ ...newTable, section: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {sections.map((section) => (
                                    <SelectItem
                                      key={section.value}
                                      value={section.value}
                                    >
                                      {section.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="edit-status">Status</Label>
                              <Select
                                value={newTable.status}
                                onValueChange={(value: any) =>
                                  setNewTable({ ...newTable, status: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="available">
                                    Available
                                  </SelectItem>
                                  <SelectItem value="occupied">
                                    Occupied
                                  </SelectItem>
                                  <SelectItem value="reserved">
                                    Reserved
                                  </SelectItem>
                                  <SelectItem value="maintenance">
                                    Maintenance
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="edit-description">
                                Description
                              </Label>
                              <Textarea
                                id="edit-description"
                                value={newTable.description}
                                onChange={(e) =>
                                  setNewTable({
                                    ...newTable,
                                    description: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <Button
                              onClick={handleUpdateTable}
                              className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                              Update Table
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTable(table.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
