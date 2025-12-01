import { createClient } from "@/lib/supabase/server";

export async function getYearsInterval() {
  const supabase = await createClient();

  const { data: minRow } = await supabase
    .from("transactions")
    .select("transaction_date")
    .order("transaction_date", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: maxRow } = await supabase
    .from("transactions")
    .select("transaction_date")
    .order("transaction_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  const now = new Date();

  const minYear = minRow?.transaction_date
    ? new Date(minRow.transaction_date).getFullYear()
    : now.getFullYear();

  const maxYear = maxRow?.transaction_date
    ? new Date(maxRow.transaction_date).getFullYear()
    : now.getFullYear();

  const years: number[] = [];
  for (let y = minYear; y <= maxYear; y++) years.push(y);

  return years;
}
