import { Database } from "./supabase.types";
export type TransactionType = "income" | "expense" | "transfer";
export type FilterPeriod = "week" | "month" | "year";

export type DbTransaction = Database["public"]["Tables"]["transactions"]["Row"];
export type InsertTransaction = Database["public"]["Tables"]["transactions"]["Insert"];
