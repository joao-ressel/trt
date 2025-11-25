export type TransactionType = "income" | "expense" | "transfer";

export interface DbTransaction {
  id: number;
  created_at: string;
  user_id: string;
  title: string;
  amount: string;
  type: TransactionType;
  transaction_date: string;
  account_id: number;
  category_id: number;
  target_account_id?: number | null;
  direction: "in" | "out";
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category_id: string;
  type: TransactionType;
  direction: "in" | "out";
  transaction_date: string;
  account_id: string;
  target_account_id?: string;
  created_at: string;
  user_id: string;
}
