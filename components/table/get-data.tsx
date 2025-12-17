import { createClient } from "@/services/supabase/server";

import { DbTransaction } from "@/types/transactions";
import { DbAccount } from "@/types/accounts";
import { DbCategory } from "@/types/categories";

export type FetchedData = {
  transactions: DbTransaction[];
  accounts: DbAccount[];
  categories: DbCategory[];
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
    console.error("Erro ao buscar dados:", {
      transactionsError,
      accountsError,
      categoriesError,
    });

    return {
      transactions: [],
      accounts: [],
      categories: [],
    };
  }

  return {
    transactions: transactions ?? [],
    accounts: accounts ?? [],
    categories: categories ?? [],
  };
}
