import { Home, Settings } from "lucide-react"
 
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/components/shadcn/ui/sidebar";

import { LucideIcon } from "lucide-react";

interface MenuItem {
  title: string;
  url: string;
  icon?: LucideIcon;
}

// Default items (your original structure)
const defaultItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Settings",
    url: "/settings/profile",
    icon: Settings,
  },
];

export function AppSidebar({ items = defaultItems }: { items?: MenuItem[] }) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel><a href="/">AI Chatbot</a></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </a>
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