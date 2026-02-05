"use client";

import { useTranslations } from "next-intl";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Library,
  BookOpen,
  Building,
  Package,
  ChevronRight,
  FileSpreadsheet,
  FolderDotIcon,
  type LucideIcon
} from "lucide-react";
// import Link from "next/link";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";

import { Link } from "@/i18n/navigation";

type NavGroup = {
  title: string;
  items: NavItem;
};

type NavItem = {
  title: string;
  href: string;
  icon?: LucideIcon;
  isComing?: boolean;
  isDataBadge?: string;
  isNew?: boolean;
  newTab?: boolean;
  items?: NavItem;
}[];

export const navItems: NavGroup[] = [
  {
    title: "dashboards",
    items: [
      {
        title: "dashboard",
        href: "/dashboard/default",
        icon: LayoutDashboard
      },
      {
        title: "library",
        href: "#",
        icon: Library,
        items: [
          { title: "dashboard", href: "/dashboard/ecommerce" },
          { title: "product-list", href: "/dashboard/pages/products" },
          { title: "product-detail", href: "/dashboard/pages/products/1" },
          { title: "add-product", href: "/dashboard/pages/products/create" },
          { title: "order-list", href: "/dashboard/pages/orders" },
          { title: "order-detail", href: "/dashboard/pages/orders/detail" }
        ]
      },
      {
        title: "agent",
        href: "#",
        icon: BookOpen,
        items: [
          { title: "manuscript", href: "/dashboard/paper-review" }
        ]
      },
      {
        title: "report",
        href: "/dashboard/payment",
        icon: FileSpreadsheet,
        items: [
          { title: "dashboard", href: "/dashboard/payment" },
          { title: "transactions", href: "/dashboard/payment/transactions" }
        ]
      },
      {
        title: "product",
        href: "/dashboard/hotel",
        icon: Package,
        items: [
          { title: "dashboard", href: "/dashboard/hotel" },
          { title: "bookings", href: "/dashboard/hotel/bookings" }
        ]
      },
      { title: "authority", href: "/dashboard/sales", icon: Building },
      {
        title: "project",
        href: "/dashboard/project-management",
        icon: FolderDotIcon,
        items: [
          { title: "dashboard", href: "/dashboard/project-management" },
          { title: "project-list", href: "/dashboard/project-list" }
        ]
      },
    ]
  }
];

export function NavMain() {
  const t = useTranslations("Sidebar");

  const pathname = usePathname();
  const { isMobile } = useSidebar();

  return (
    <>
      {navItems.map((nav) => (
        <SidebarGroup key={nav.title}>
          {/* <SidebarGroupLabel>{nav.title}</SidebarGroupLabel> */}
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {nav.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {Array.isArray(item.items) && item.items.length > 0 ? (
                    <>
                      <div className="hidden group-data-[collapsible=icon]:block">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuButton tooltip={item.title}>
                              {item.icon && <item.icon />}
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            side={isMobile ? "bottom" : "right"}
                            align={isMobile ? "end" : "start"}
                            className="min-w-48 rounded-lg">
                            <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                            {item.items?.map((item) => (
                              <DropdownMenuItem
                                className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10! active:bg-[var(--primary)]/10!"
                                asChild
                                key={item.title}>
                                <a href={item.href}>{item.title}</a>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <Collapsible
                        className="group/collapsible block group-data-[collapsible=icon]:hidden"
                        defaultOpen={!!item.items.find((s) => s.href === pathname)}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/10"
                            tooltip={item.title}>
                            {item.icon && <item.icon />}
                            <span>{t(`${item.title}.title`)}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item?.items?.map((subItem, key) => (
                              <SidebarMenuSubItem key={key}>
                                <SidebarMenuSubButton
                                  className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/10"
                                  isActive={
                                    pathname === subItem.href ||
                                    pathname.replace(/^\/(en|zh-TW)/, "") === subItem.href
                                  }
                                  asChild>
                                  <Link href={subItem.href} target={subItem.newTab ? "_blank" : ""}>
                                    <span>{t(`${item.title}.subTitle.${subItem.title}`)}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </>
                  ) : (
                    <SidebarMenuButton
                      className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/10"
                      isActive={
                        pathname === item.href ||
                        pathname.replace(/^\/(en|zh-TW)/, "") === item.href
                      }
                      tooltip={item.title}
                      asChild>
                      <Link href={item.href} target={item.newTab ? "_blank" : ""}>
                        {item.icon && <item.icon />}
                        <span>{t(`${item.title}.title`)}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                  {!!item.isComing && (
                    <SidebarMenuBadge className="peer-hover/menu-button:text-foreground opacity-50">
                      Coming
                    </SidebarMenuBadge>
                  )}
                  {!!item.isNew && (
                    <SidebarMenuBadge className="border border-green-400 text-green-600 peer-hover/menu-button:text-green-600">
                      New
                    </SidebarMenuBadge>
                  )}
                  {!!item.isDataBadge && (
                    <SidebarMenuBadge className="peer-hover/menu-button:text-foreground">
                      {item.isDataBadge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
