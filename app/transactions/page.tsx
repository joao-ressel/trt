import { getYearsInterval } from "@/services/get-years-interval";
import { createClient } from "@/services/supabase/server";

import { DbTransaction } from "@/types/transactions";

import TransactionListItem from "@/app/transactions/components/transaction-list-item";
import AddTransactionForm from "./components/modals/add-transaction";
import TransactionsFilter from "./components/transaction-filter";
import { cookies } from "next/headers";

export default async function TransactionsPage() {
  const cookieStore = await cookies();
  const now = new Date();

  const month = Number(cookieStore.get("transactions_month")?.value) || now.getMonth() + 1;

  const year = Number(cookieStore.get("transactions_year")?.value) || now.getFullYear();

  const start = `${year}-${String(month).padStart(2, "0")}-01`;

  const nextMonth = new Date(year, month, 1).toISOString().slice(0, 10);

  const supabase = await createClient();

  const [{ data: transactionsOriginal }, { data: accounts }, { data: categories }, years] =
    await Promise.all([
      supabase
        .from("transactions")
        .select("*")
        .gte("transaction_date", start)
        .lt("transaction_date", nextMonth),
      supabase.from("accounts").select("*"),
      supabase.from("categories").select("*"),
      getYearsInterval(),
    ]);

  function groupByDate(transactions: DbTransaction[]) {
    const map = new Map<string, DbTransaction[]>();

    for (const t of transactions) {
      const date = t.transaction_date ?? "No date";
      if (!map.has(date)) {
        map.set(date, []);
      }
      map.get(date)!.push(t);
    }
    return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }

  const grouped = groupByDate(transactionsOriginal ?? []);
  return (
    <div className="w-full min-h-[calc(100vh-(var(--spacing) * 20))] p-6 space-y-6">
      <main className="flex w-full gap-8 md:gap-4">
        <div className="space-y-4 w-full">
          <div className="flex w-full justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Transactions</h2>
            <div className="flex gap-3">
              <TransactionsFilter month={month} year={year} years={years} />
              <AddTransactionForm accounts={accounts ?? []} categories={categories ?? []} />
            </div>
          </div>

          <div className="space-y-6">
            {grouped.map(([date, items]) => {
              const [year, month, day] = date.split("-").map(Number);
              const formatted = new Date(year, month - 1, day).toLocaleDateString();

              return (
                <div key={date} className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground">{formatted}</h3>
                  {items.map((transaction) => (
                    <TransactionListItem
                      key={transaction.id}
                      transaction={transaction}
                      accounts={accounts ?? []}
                      categories={categories ?? []}
                    />
                  ))}
                </div>
              );
            })}
          </div>

          {transactionsOriginal?.length === 0 && (
            <p className="text-foreground">No transactions found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
