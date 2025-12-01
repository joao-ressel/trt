import { type Database } from "./supabase.types";

export type AccountType =
  | "default"
  | "credit_card"
  | "debit_card"
  | "investment"
  | "accounts_payable"
  | "accounts_receivable";

export const ACCOUNT_TYPES: {
  value: AccountType;
  label: string;
}[] = [
  {
    value: "default",
    label: "Checking Account",
  },

  {
    value: "credit_card",
    label: "Credit Card",
  },
  {
    value: "debit_card",
    label: "Debit Card",
  },
  {
    value: "investment",
    label: "Investment",
  },
  {
    value: "accounts_payable",
    label: "Accounts Payable",
  },
  {
    value: "accounts_receivable",
    label: "Accounts Receivable",
  },
];

export type CurrencyType =
  | "USD"
  | "EUR"
  | "BRL"
  | "GBP"
  | "JPY"
  | "CNY"
  | "AUD"
  | "CAD"
  | "CHF"
  | "MXN"
  | "ARS"
  | "CLP"
  | "COP"
  | "INR"
  | "KRW"
  | "ZAR";

export const CURRENCY_TYPES: {
  value: CurrencyType;
  label: string;
}[] = [
  {
    value: "USD",
    label: "US Dollar",
  },
  {
    value: "EUR",
    label: "Euro",
  },
  {
    value: "BRL",
    label: "Brazilian Real",
  },
  {
    value: "GBP",
    label: "Pound Sterling",
  },
  {
    value: "JPY",
    label: "Yen",
  },
  {
    value: "CNY",
    label: "Yuan Renminbi",
  },
  {
    value: "AUD",
    label: "Australian Dollar",
  },
  {
    value: "CAD",
    label: "Canadian Dollar",
  },
  {
    value: "CHF",
    label: "Swiss Franc",
  },
  {
    value: "MXN",
    label: "Mexican Peso",
  },
  {
    value: "ARS",
    label: "Argentine Peso",
  },
  {
    value: "CLP",
    label: "Chilean Peso",
  },
  {
    value: "COP",
    label: "Colombian Peso",
  },
  {
    value: "INR",
    label: "Indian Rupee",
  },
  {
    value: "KRW",
    label: "South Korean Won",
  },
  {
    value: "ZAR",
    label: "South African Rand",
  },
];

export type DbAccount = Database["public"]["Tables"]["accounts"]["Row"];
export type InsertAccount = Database["public"]["Tables"]["accounts"]["Insert"];
