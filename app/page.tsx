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
    <main className="w-full min-h-[calc(100vh-(var(--spacing) * 20))] p-6 space-y-6">
      <ChartsView transactions={transactionsOriginal} categories={categories} accounts={accounts} />
      <TableTransactions data={finalTransactions} />
    </main>
  );
}
