"use client";

import { useRouter } from "next/navigation";
import { Account } from "@/types/accounts";
import AccountActions from "../buttons-actions/account-actions";

interface AccountListItemProps {
  account: Account;
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function AccountListItem({ account }: AccountListItemProps) {
  const router = useRouter();

  const balanceToFormat = account.current_balance ?? 0;
  const formattedCurrent = currencyFormatter.format(balanceToFormat);
  const balanceClass =
    balanceToFormat >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";

  const refreshList = () => router.refresh();
  return (
    <div className="flex justify-between items-center p-3 gap-3 h-25 bg-card rounded-md border border-border shadow-md">
      <div className="flex gap-2 h-full">
        <div className={`h-full w-1 rounded-full`} style={{ backgroundColor: account.color }}></div>

        <div className="flex flex-col justify-center">
          <span className="font-semibold text-card-foreground">{account.name}</span>
          <span className="text-foreground text-sm">{account.currency}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className={`font-semibold ${balanceClass}`}>{formattedCurrent}</span>
        <AccountActions account={account} onActionSuccess={refreshList} />
      </div>
    </div>
  );
}
