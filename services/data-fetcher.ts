// Ajuste o caminho conforme necessário

import { createClient } from "@/services/supabase/server";
import { DbAccount } from "@/types/accounts";
import { DbCategory } from "@/types/categories";
import { FormattedTransaction } from "@/types/transaction-schema";
import { DbTransaction } from "@/types/transactions";

type TransactionWithValidation = FormattedTransaction & { _isValid: boolean };

export async function getFormattedTransactions() {
  const supabase = await createClient();

  const [
    { data: transactions, error: transactionsError },
    { data: accounts, error: accountsError },
    { data: categories, error: categoriesError },
  ] = await Promise.all([
    supabase.from("transactions").select("*").order("transaction_date", { ascending: false }),

    supabase.from("accounts").select("*"),
    supabase.from("categories").select("*"),
  ]);

  if (transactionsError || accountsError || categoriesError) {
    console.error("Error loading data:", transactionsError || accountsError || categoriesError);
    return [];
  }

  const accountsMap: Map<number, DbAccount> = new Map(
    (accounts as DbAccount[]).map((account) => [account.id, account])
  );
  const categoriesMap: Map<number, DbCategory> = new Map(
    (categories as DbCategory[]).map((category) => [category.id, category])
  );

  const formattedTransactions: TransactionWithValidation[] = (transactions as DbTransaction[]).map(
    (transaction) => {
      const account = accountsMap.get(transaction.account_id);
      const category = categoriesMap.get(Number(transaction.category_id));

      const accountName = account?.name || "No Account";
      const categoryName = category?.name || "No Category";

      const isValid = !!account && !!category;

      return {
        id: String(transaction.id),
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        direction: transaction.direction,
        transaction_date: transaction.transaction_date,
        category_id: String(transaction.category_id),
        account_id: String(transaction.account_id),
        account_name: (accountName || "N/A").trim(),
        category_name: (categoryName || "N/A").trim(),
        _isValid: isValid,
      } as TransactionWithValidation;
    }
  );

  const finalTransactions: FormattedTransaction[] = formattedTransactions
    .filter((t) => t._isValid)
    .map((t) => {
      const { _isValid, ...rest } = t;
      return rest as FormattedTransaction;
    });

  return finalTransactions;
}
