"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath, unstable_noStore } from "next/cache";
import { DbAccount, InsertAccount } from "@/types/accounts";

export async function createAccount(formData: InsertAccount) {
  const supabase = await createClient();

  const { error } = await supabase.from("accounts").insert({
    name: formData.name,
    initial_balance: formData.initial_balance,
    current_balance: formData.current_balance,
    description: formData.description,
    last_balance_update_at: formData.last_balance_update_at?.toString().split("T")[0],
    type: formData.type,
    color: formData.color,
    user_id: (await supabase.auth.getUser()).data.user?.id || "default-user-id",
  });

  if (error) {
    console.error("Error adding account:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/");

  return { success: true, message: "Account successfully created!" };
}

export async function updateAccount(accountId: number, formData: Partial<DbAccount>) {
  const supabase = await createClient();

  const updatedFields: { [key: string]: any } = {};

  if (formData.name !== undefined) updatedFields.name = formData.name;
  if (formData.description !== undefined) updatedFields.description = formData.description;
  if (formData.currency !== undefined) updatedFields.currency = formData.currency;
  if (formData.type !== undefined) updatedFields.type = formData.type;
  if (formData.color !== undefined) updatedFields.color = formData.color;

  if (formData.initial_balance !== undefined)
    updatedFields.initial_balance = String(formData.initial_balance);

  if (formData.last_balance_update_at !== undefined)
    updatedFields.last_balance_update_at = String(formData.last_balance_update_at);

  const { error } = await supabase.from("accounts").update(updatedFields).eq("id", accountId);

  if (error) {
    console.error("Error updating account:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/");

  return { success: true, message: "Account successfully updated!" };
}

export async function deleteAccount(accountId: number) {
  console.log("ID recebido:", accountId);
  const supabase = await createClient();
  const { error } = await supabase.from("accounts").delete().eq("id", accountId);

  if (error) {
    console.error("Error deleting account:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/");

  return { success: true, message: "Account successfully deleted!" };
}
export async function calculateAccountBalance(accountId: number) {
  unstable_noStore();
  if (!accountId) return null;

  const supabase = await createClient();

  const { data: account, error: accError } = await supabase
    .from("accounts")
    .select("initial_balance")
    .eq("id", accountId)
    .single();

  if (accError || !account) {
    console.error("Error fetching account:", accError);
    return null;
  }

  const initial_balance = Number(account.initial_balance) || 0;

  const { data: transactions, error: txError } = await supabase
    .from("transactions")
    .select("amount, type, account_id, target_account_id")
    .or(`account_id.eq.${accountId},target_account_id.eq.${accountId}`)
    .order("created_at", { ascending: true });

  if (txError) {
    console.error("Error fetching transactions:", txError);
    return null;
  }

  const finalBalance = (transactions || []).reduce((sum, tx) => {
    const amount = Number(tx.amount);

    if (tx.type === "income") return sum + amount;

    if (tx.type === "expense") return sum - amount;

    if (tx.type === "transfer") {
      const isOut = String(tx.account_id) === String(accountId);
      const isIn = String(tx.target_account_id) === String(accountId);

      if (isOut) return sum - amount;
      if (isIn) return sum + amount;
      return sum;
    }

    return sum;
  }, initial_balance);

  const { error: updateError } = await supabase
    .from("accounts")
    .update({
      current_balance: Number(finalBalance.toFixed(2)),
      last_balance_update_at: new Date().toISOString(),
    })
    .eq("id", accountId);

  if (updateError) {
    console.error("Error updating balance:", updateError);
  }

  return finalBalance;
}
