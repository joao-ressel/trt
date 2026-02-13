"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EyeClosedIcon, EyeIcon } from "@phosphor-icons/react";
import AccountListItem from "@/app/accounts/components/account-list-item";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DbAccount } from "@/types/accounts";
import AddAccountForm from "./components/modals/add-account";

interface AccountsPageClientProps {
  normalAccounts: DbAccount[];
  accountsZero: DbAccount[];
  hasAccounts: boolean;
}

export function AccountsPageClient({
  normalAccounts,
  accountsZero,
  hasAccounts,
}: AccountsPageClientProps) {
  const [showBalance, setShowBalance] = useState(false);

  return (
    <div className="space-y-4 flex flex-col h-full">
      <div className="flex w-full justify-between mb-4 items-center">
        <h2 className="text-2xl font-bold">Accounts</h2>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            onClick={() => setShowBalance((prev) => !prev)}
            className="text-muted-foreground hover:text-primary"
          >
            {showBalance ? <EyeClosedIcon size={20} /> : <EyeIcon size={20} />}
          </Button>

          <AddAccountForm />
        </div>
      </div>

      <div className="grid md:grid-cols-10 grid-cols-3 gap-4">
        {normalAccounts.map((account) => (
          <AccountListItem key={account.id} account={account} showBalance={showBalance} />
        ))}
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Show zero balance accounts</AccordionTrigger>
          <AccordionContent>
            <div className="grid md:grid-cols-10 grid-cols-3 gap-4">
              {accountsZero.map((account) => (
                <AccountListItem key={account.id} account={account} showBalance={showBalance} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {!hasAccounts && <p className="text-foreground">No account found.</p>}
    </div>
  );
}
