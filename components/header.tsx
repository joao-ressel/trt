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
import { SheetMenu } from "./sheet-menu";

export function Header() {
  return (
    <header>
      <div className="flex justify-between px-6 h-20 bg-background items-center border-b">
        <div className="md:hidden">
          <SheetMenu />
        </div>

        <div className="h-12 w-28 bg-foreground mask-[url('/name-logo.svg')] mask-cover"></div>

        <NavigationMenu className="max-md:hidden">
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

        <div className="flex gap-2 items-center max-md:hidden">
          <ModeToggle />
          <NavUser />
        </div>
      </div>
    </header>
  );
}
