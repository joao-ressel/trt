import { createClient } from "@/services/supabase/server";
import { ChartsView } from "@/components/charts/charts-view";
import { TableTransactions } from "@/components/table/table-transactions";
import { getFormattedTransactions } from "@/services/data-fetcher";

export default async function Home() {
  const finalTransactions = await getFormattedTransactions();
  const supabase = await createClient();
  const [{ data: transactionsOriginal }, { data: accounts }, { data: categories }] =
    await Promise.all([
      supabase
        .from("transactions")
        .select("*")
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
  return (
    <>
      <ChartsView transactions={transactionsOriginal} categories={categories} accounts={accounts} />
      <TableTransactions data={finalTransactions} accounts={accounts} categories={categories} />
    </>
  );
}
