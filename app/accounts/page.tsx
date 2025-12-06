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
    })
  );

  const accountsZero = accountsWithBalance.filter((a) => a.current_balance === 0);
  const normalAccounts = accountsWithBalance.filter((a) => a.current_balance !== 0);

  return (
    <div className="w-full min-h-[calc(100vh-(var(--spacing) * 20))] p-6 space-y-6">
      <div className="space-y-4 flex flex-col h-full ">
        <div className="flex w-full justify-between mb-4 items-center ">
          <h2 className="text-2xl font-bold">Accounts</h2>
          <div className="flex gap-4">
            <AddAccountForm />
          </div>
        </div>

        <div className="grid grid-cols-10 gap-4">
          {normalAccounts.map((account) => (
            <AccountListItem key={account.id} account={account} />
          ))}
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Show zero balance accounts</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-10 gap-4">
                {accountsZero.map((account) => (
                  <AccountListItem key={account.id} account={account} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {accountsWithBalance.length === 0 && <p className="text-foreground">No account found.</p>}
      </div>
    </div>
  );
}
