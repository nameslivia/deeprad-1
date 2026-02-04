'use client';

import { usePathname, Link } from '@/i18n/navigation';

import React from 'react';
import { cn } from '@/lib/utils';
import { CircleArrowRight, Menu, Earth } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { routeList } from '@/@data/navbar';

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Logo from '@/components/layout/logo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ToggleTheme } from '@/components/layout/toogle-theme';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import DiscordIcon from '@/components/icons/discord-icon';
import LanguageSwitch from '@/components/layout/header/language-switch';

export const Navbar = () => {
  const t = useTranslations('Navbar');
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/reset-password';
  const [isOpen, setIsOpen] = React.useState(false);

  if (isAuthPage) {
    return (
      <header>
        <div className="container mx-auto">
          <div className="flex items-center py-4">
            <Logo />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-2 z-40 lg:top-5">
      <div className="container">
        <div className="bg-background/70 flex items-center justify-between rounded-2xl border p-3 backdrop-blur-sm">
          <Logo />
          {/* <!-- Mobile --> */}
          <div className="flex items-center lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Menu
                  onClick={() => setIsOpen(!isOpen)}
                  className="cursor-pointer lg:hidden"
                />
              </SheetTrigger>

              <SheetContent
                side="left"
                className="bg-card border-secondary flex flex-col justify-between rounded-tr-2xl rounded-br-2xl"
              >
                <div>
                  <SheetHeader className="mb-4 ml-4">
                    <SheetTitle className="flex items-center">
                      <Logo />
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col gap-2">
                    {routeList.map(({ href, label }) => (
                      <Button
                        key={href}
                        onClick={() => setIsOpen(false)}
                        asChild
                        variant="ghost"
                        className="justify-start text-base"
                      >
                        <Link href={href}>{t(label)}</Link>
                      </Button>
                    ))}
                  </div>
                </div>

                <SheetFooter className="flex-col items-start justify-start sm:flex-col">
                  <Separator className="mb-2" />
                  <ToggleTheme />
                  <LanguageSwitch />
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {/* <!-- Desktop --> */}
          <NavigationMenu className="mx-auto hidden lg:block">
            <NavigationMenuList className="space-x-0">
              <NavigationMenuItem>
                {routeList.map(({ href, label }) => (
                  <NavigationMenuLink
                    key={href}
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'hover:bg-muted! bg-transparent!'
                    )}
                  >
                    <Link href={href}>{t(label)}</Link>
                  </NavigationMenuLink>
                ))}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="hidden items-center lg:flex">
            <ToggleTheme />

            <LanguageSwitch />

            <Button size="sm" variant="ghost" asChild>
              <a
                href={process.env.NEXT_PUBLIC_DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DiscordIcon className="size-5" />
                {t('joinUs')}
              </a>
            </Button>

            <div className="flex gap-2">
              <Link href="/login">
                <Button size="lg" variant="ghost">
                  {t('login')}
                </Button>
              </Link>
              <Button size="lg">
                {t('tryForFree')}
                <CircleArrowRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
