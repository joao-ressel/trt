import { createClient } from "@/services/supabase/server";

import { DbTransaction } from "@/types/transactions";
import { DbAccount } from "@/types/accounts";
import { DbCategory } from "@/types/categories";

import { TableTransactions } from "./table-transactions";
export type FetchedData = {
  transactions: DbTransaction[] | null;
  accounts: DbAccount[] | null;
  categories: DbCategory[] | null;
};

export async function getDashboardData(): Promise<FetchedData> {
  const supabase = await createClient();

  const [
    { data: transactions, error: transactionsError },
    { data: accounts, error: accountsError },
    { data: categories, error: categoriesError },
  ] = await Promise.all([
    supabase.from("transactions").select("*"),
    supabase.from("accounts").select("*"),
    supabase.from("categories").select("*"),
  ]);

  if (transactionsError || accountsError || categoriesError) {
    console.error("Erro ao buscar dados:", transactionsError || accountsError || categoriesError);
    return { transactions: [], accounts: [], categories: [] };
  }

  return { transactions, accounts, categories };
}

export async function TableTransactionsServer() {
  const { transactions, accounts, categories } = await getDashboardData();

  return (
    <TableTransactions
      data={transactions ?? []}
      accounts={accounts ?? []}
      categories={categories ?? []}
    />
  );
}
