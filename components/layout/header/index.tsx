"use client";

import { GlobeIcon, PanelLeftIcon } from "lucide-react";
import { useLocale } from "next-intl";

import Notifications from "@/components/layout/header/notifications";
import ThemeSwitch from "@/components/layout/header/theme-switch";
import UserMenu from "@/components/layout/header/user-menu";
import { ThemeCustomizerPanel } from "@/components/theme-customizer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";

import { usePathname, useRouter } from "@/i18n/navigation";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-background/40 sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2 border-b backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) md:rounded-tl-xl md:rounded-tr-xl">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2">
        <Button onClick={toggleSidebar} size="icon" variant="ghost">
          <PanelLeftIcon />
        </Button>
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenuRadioGroupDemo />
          <Notifications />
          <ThemeSwitch />
          <ThemeCustomizerPanel />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

export function DropdownMenuRadioGroupDemo() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <GlobeIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2">
            {locale === "en" ? "Language" : "語系"}
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup value={locale} onValueChange={handleLocaleChange}>
            <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="zh-TW">繁體中文</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
