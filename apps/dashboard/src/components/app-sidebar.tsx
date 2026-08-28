"use client";

import { NavMain } from "@/components/nav-main";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { mockOrders, openOrderCount } from "@/lib/dashboard-mock";
import {
  BarChart3Icon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";

const navMain = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboardIcon },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: ShoppingBagIcon,
    badge: openOrderCount(mockOrders),
  },
  { title: "Products", url: "/dashboard/products", icon: PackageIcon },
  { title: "Customers", url: "/dashboard/customers", icon: UsersIcon },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3Icon },
  { title: "Support", url: "/dashboard/support", icon: LifeBuoyIcon },
  { title: "Settings", url: "/dashboard/settings", icon: SettingsIcon },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent className="pt-2">
        <NavMain items={navMain} pathname={pathname} />
      </SidebarContent>
    </Sidebar>
  );
}
