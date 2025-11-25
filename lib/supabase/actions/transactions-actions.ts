"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { TransactionType } from "@/types/transactions";
import { calculateAccountBalance } from "./accounts-actions";

export interface TransactionPayload {
  title: string | undefined;
  amount: number;
  type: TransactionType;
  transaction_date: Date;
  account_id: string;
  category_id?: string;
  target_account_id?: string | null;
}

export async function createTransaction(formData: TransactionPayload, accountId: string) {
  const supabase = await createClient();

  let direction: "in" | "out";

  if (formData.type === "income") {
    direction = "in";
  } else {
    direction = "out";
  }

  const { amount, transaction_date, ...rest } = formData;

  const newTransaction = {
    ...rest,
    amount: String(amount),
    transaction_date: transaction_date.toISOString().split("T")[0],
    direction: direction,
    target_account_id: formData.type === "transfer" ? formData.target_account_id : null,
    category_id: formData.type === "transfer" ? null : formData.category_id,
    user_id: (await supabase.auth.getUser()).data.user?.id || "default-user-id",
  };
  const { error } = await supabase.from("transactions").insert(newTransaction);

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

  const updatedFields: { [key: string]: any } = {};

  if (formData.title !== undefined) updatedFields.title = formData.title;
  if (formData.type !== undefined) updatedFields.type = formData.type;
  if (formData.type === "transfer") updatedFields.target_account_id = formData.target_account_id;
  if (formData.type === "transfer") updatedFields.target_account_id = formData.target_account_id;
  if (formData.amount !== undefined) updatedFields.amount = formData.amount;
  if (formData.category_id !== undefined) updatedFields.category_id = formData.category_id;
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
