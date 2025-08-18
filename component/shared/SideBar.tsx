"use client";

import { Calendar, Home, Inbox, LogOut, LogOutIcon, Menu, Search } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Employee",
    url: "/dashboard/employee",
    icon: Inbox,
  },
  {
    title: "Loan",
    url: "/dashboard/loan",
    icon: Calendar,
  },
  {
    title: "Table Management",
    url: "/dashboard/table",
    icon: Search,
  },
  {
    title: "Add Menu",
    url: "/dashboard/add-menu",
    icon: Menu,
  },
  {
    title: "Sign Out",
    icon: LogOutIcon,
    onClick: () => signOut({ callbackUrl: "/login" }),
  },
];


export function SidebarMain() {
    const router = useRouter();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.url ? (
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    ) : (
                      <button onClick={item.onClick}>
                        <item.icon />
                        <span>{item.title}</span>
                      </button>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-11 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => router.push("/admin")}
        >
          <LogOut className="h-5 w-5" />
          Admin
        </Button>
      </div>
    </Sidebar>
  );
}
