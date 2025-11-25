"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { calculateAccountBalance } from "./accounts-actions";
import { TransactionPayload } from "@/types/transactions";

function buildDatabaseTransactionPayload(formData: TransactionPayload, userId: string | undefined) {
  return {
    title: formData.title ?? null,
    type: formData.type,
    amount: String(formData.amount),
    transaction_date: formData.transaction_date,
    direction: formData.type === "income" ? "in" : "out",
    account_id: formData.account_id,
    target_account_id: formData.type === "transfer" ? formData.target_account_id ?? null : null,
    category_id: formData.type !== "transfer" ? formData.category_id ?? null : null,
    user_id: userId,
  };
}

export async function createTransaction(formData: TransactionPayload, accountId: string) {
  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user;
  const userId = user?.id;

  const payload = buildDatabaseTransactionPayload(formData, userId);

  const { error } = await supabase.from("transactions").insert(payload);

  if (error) {
    console.error("Error inserting transaction:", error);
    return { success: false, message: error.message };
  }

  await calculateAccountBalance(accountId);
  revalidatePath("/");

  return { success: true, message: "Transaction created successfully!" };
}

export async function updateTransaction(
  transactionId: string,
  accountId: string,
  formData: Partial<TransactionPayload>
) {
  const supabase = await createClient();

  const updatedFields: Record<string, any> = {};

  if (formData.title !== undefined) updatedFields.title = formData.title;
  if (formData.type !== undefined) updatedFields.type = formData.type;
  if (formData.amount !== undefined) updatedFields.amount = String(formData.amount);
  if (formData.type === "transfer")
    updatedFields.target_account_id = formData.target_account_id ?? null;
  if (formData.type !== "transfer" && formData.category_id !== undefined)
    updatedFields.category_id = formData.category_id;
  if (formData.transaction_date !== undefined)
    updatedFields.transaction_date = formData.transaction_date;

  const { error } = await supabase
    .from("transactions")
    .update(updatedFields)
    .eq("id", transactionId);

  if (error) {
    console.error("Error updating the transaction:", error);
    return { success: false, message: error.message };
  }

  await calculateAccountBalance(accountId);
  revalidatePath("/");

  return { success: true, message: "Transaction updated successfully!" };
}

export async function deleteTransaction(transactionId: string, accountId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("transactions").delete().eq("id", transactionId);

  if (error) {
    console.error("Error deleting transaction:", error);
    return { success: false, message: error.message };
  }

  await calculateAccountBalance(accountId);
  revalidatePath("/");

  return { success: true, message: "Transaction successfully deleted!" };
}
