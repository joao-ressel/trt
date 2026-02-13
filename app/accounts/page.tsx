import { createClient } from "@/services/supabase/server";

import { DbAccount } from "@/types/accounts";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import AccountListItem from "@/app/accounts/components/account-list-item";
import AddAccountForm from "./components/modals/add-account";
import { calculateAccountBalance } from "@/services/accounts-actions";
import { Button } from "@/components/ui/button";
import { EyeClosedIcon, EyeIcon } from "@phosphor-icons/react";
import { AccountsPageClient } from "./accounts-page-client";

export default async function AccountsPage() {
  const supabase = await createClient();

  const [{ data: accounts }] = await Promise.all([
    supabase
      .from("accounts")
      .select("*")
      .order("current_balance", { ascending: false })
      .then((res) => res as any),
  ]);

  const mappedAccounts = (accounts as DbAccount[]).map((account) => ({
    ...account,
    id: account.id,
  }));

  const accountsWithBalance = await Promise.all(
    mappedAccounts.map(async (account) => {
      const currentBalance = await calculateAccountBalance(account.id);
      return {
        ...account,
        current_balance: currentBalance ?? 0,
      } as DbAccount;
    }),
  );

  const accountsZero = accountsWithBalance.filter((a) => a.current_balance === 0);
  const normalAccounts = accountsWithBalance.filter((a) => a.current_balance !== 0);

  return (
    <AccountsPageClient
      normalAccounts={normalAccounts}
      accountsZero={accountsZero}
      hasAccounts={accountsWithBalance.length > 0}
    />
  );
}
