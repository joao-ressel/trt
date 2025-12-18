import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "./ui/sheet";
import { ModeToggle } from "./mode-toggle";
import { NavUser } from "./nav-user";

export function SheetMenu() {
  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/transactions", label: "Transactions" },
    { href: "/categories", label: "Categories" },
    { href: "/accounts", label: "Accounts" },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="p-4 flex flex-col w-full border-0">
        <SheetHeader className="pb-4">
          <SheetTitle asChild>
            <div className="h-12 w-28 bg-foreground mask-[url('/name-logo.svg')] mask-cover"></div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1">
          <div className="flex flex-col gap-4 mt-8">
            {navLinks.map((link) => (
              <SheetClose asChild key={link.href}>
                <Link href={link.href} className="text-lg font-medium">
                  {link.label}
                </Link>
              </SheetClose>
            ))}
          </div>
        </div>

        <div className="flex w-full justify-between pt-4 border-t items-center">
          <NavUser />
          <ModeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}
