"use client";

import { Calendar, Home, Inbox, LogOutIcon, Search } from "lucide-react";

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
    title: "Sign Out",
    icon: LogOutIcon,
    onClick: () => signOut({ callbackUrl: "/" }),
  },
];

export function SidebarMain() {
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
    </Sidebar>
  );
}
