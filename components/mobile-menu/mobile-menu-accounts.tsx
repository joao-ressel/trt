"use client";

import { useState } from "react";
import { WalletCards } from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

import AddAccountForm from "@/components/modals-actions/accounts/add-account";
import AccountListItem from "@/components/lists/account-list-item";

import { Account } from "@/types/accounts";

interface MobileMenuAccountsProps {
  accounts: Account[];
}

export function MobileMenuAccounts({ accounts }: MobileMenuAccountsProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden flex-1">
          <WalletCards className="h-5 w-5" /> Accounts
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-full">
        <SheetHeader>
          <SheetTitle className="text-2xl">Accounts</SheetTitle>
        </SheetHeader>
        <div>
          <ScrollArea className=" p-4">
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <AddAccountForm />
              </div>
              {accounts.map((account) => (
                <AccountListItem key={account.id} account={account} />
              ))}
              {accounts.length === 0 && <p className="text-foreground">No account found.</p>}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
