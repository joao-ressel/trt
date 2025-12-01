import Link from "next/link";
import InstallPWA from "./install-pwa";
import { ModeToggle } from "./mode-toggle";
import { NavUser } from "./nav-user";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";

export function Header() {
  return (
    <header>
      <div className="flex justify-between px-6 h-20 bg-background items-center border-b">
        <div className="h-12 w-28 bg-foreground mask-[url('/name-logo.svg')] mask-cover"></div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/" passHref>
                  Dashboard
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/transactions" passHref>
                  Transactions
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/categories" passHref>
                  Categories
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/accounts" passHref>
                  Accounts
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex gap-2">
          <InstallPWA />
          <ModeToggle />
          <NavUser />
        </div>
      </div>
    </header>
  );
}
