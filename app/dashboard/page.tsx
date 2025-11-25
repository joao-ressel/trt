import AddTransactionForm from "@/components/modals-actions/transactions/add-transaction";
import { MobileMenuCategories } from "@/components/mobile-menu/mobile-menu-categories";
import { MobileMenuAccounts } from "@/components/mobile-menu/mobile-menu-accounts";
import AddCategoryForm from "@/components/modals-actions/categories/add-category";
import AddAccountForm from "@/components/modals-actions/accounts/add-account";
import TransactionListItem from "@/components/lists/transaction-list-item";
import CategoryListItem from "@/components/lists/category-list-item";
import AccountListItem from "@/components/lists/account-list-item";

import { DbTransaction, Transaction } from "@/types/transactions";
import { Account, DbAccount } from "@/types/accounts";
import { Category } from "@/types/categories";

import { calculateAccountBalance } from "@/lib/supabase/actions/accounts-actions";
import { createClient } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();

  const [
    { data: transactions, error: transactionsError },
    { data: accounts, error: accountsError },
    { data: categories, error: categoriesError },
  ] = await Promise.all([
    supabase
      .from("transactions")
      .select("*")
      .order("transaction_date", { ascending: false })
      .limit(10)
      .then((res) => res as any),

    supabase
      .from("accounts")
      .select("*")
      .then((res) => res as any),

    supabase
      .from("categories")
      .select("*")
      .then((res) => res as any),
  ]);

  if (transactionsError || accountsError || categoriesError) {
    console.error("Error loading data:", transactionsError || accountsError || categoriesError);
    return (
      <div className="w-full p-6 text-foreground">
        <p>Error loading data from Supabase.</p>
      </div>
    );
  }

  const formattedTransactions: Transaction[] = (transactions as DbTransaction[]).map(
    (transaction) => ({
      id: String(transaction.id),
      account_id: String(transaction.account_id),
      category_id: String(transaction.category_id),
      target_account_id: transaction.target_account_id
        ? String(transaction.target_account_id)
        : undefined,
      amount: parseFloat(transaction.amount),
      title: transaction.title,
      type: transaction.type,
      direction: transaction.direction,
      transaction_date: transaction.transaction_date,
      created_at: transaction.created_at,
      user_id: transaction.user_id,
    })
  );

  const mappedAccounts = (accounts as DbAccount[]).map((account) => ({
    ...account,
    id: String(account.id),
  }));

  const accountsWithBalance = await Promise.all(
    mappedAccounts.map(async (account) => {
      const currentBalance = await calculateAccountBalance(account.id);
      return {
        ...account,
        current_balance: currentBalance ?? 0,
      } as Account;
    })
  );

  const formattedCategories: Category[] = (categories as Category[]) || [];

  return (
    <div className="w-full min-h-[calc(100vh-(var(--spacing) * 20))] p-6 space-y-6">
      <div className="flex justify-between w-full mb-4 gap-2">
        <MobileMenuAccounts accounts={accountsWithBalance} />
        <MobileMenuCategories categories={categories} />
      </div>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Transactions</h2>
            <AddTransactionForm accounts={accountsWithBalance} categories={formattedCategories} />
          </div>
          {formattedTransactions.map((transaction) => (
            <TransactionListItem
              key={transaction.id}
              transaction={transaction}
              accounts={accountsWithBalance}
              categories={categories}
            />
          ))}
          {formattedTransactions.length === 0 && (
            <p className="text-foreground">No transactions found.</p>
          )}
        </div>

        <div className="space-y-4 hidden md:block">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Accounts</h2>
            <AddAccountForm />
          </div>
          {accountsWithBalance.map((account) => (
            <AccountListItem key={account.id} account={account} />
          ))}

          {accountsWithBalance.length === 0 && <p className="text-foreground">No account found.</p>}
        </div>

        <div className="space-y-4 hidden md:block">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Categories</h2>
            <AddCategoryForm />
          </div>
          {formattedCategories.map((category) => (
            <CategoryListItem key={category.id} category={category} />
          ))}
          {formattedCategories.length === 0 && (
            <p className="text-foreground">No categories found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
