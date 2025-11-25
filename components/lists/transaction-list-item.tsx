"use client";

import TransactionActions from "../buttons-actions/transactions-actions";
import { Transaction } from "@/types/transactions";
import { Category } from "@/types/categories";
import { Account } from "@/types/accounts";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface TransactionListItemProps {
  transaction: Transaction;
  accounts: Account[];
  categories: Category[];
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export default function TransactionListItem({
  transaction,
  accounts,
  categories,
}: TransactionListItemProps) {
  const router = useRouter();
  const refreshList = () => router.refresh();
  const isTransfer = transaction.type === "transfer";

  const sourceAccount = accounts.find((a) => a.id === transaction.account_id);
  const targetAccount = accounts.find((a) => a.id === transaction.target_account_id);

  const isOutflow = transaction.type === "expense" || transaction.direction === "out";

  const amountColor = isOutflow ? "text-red-400" : "text-green-400";
  const amountPrefix = isOutflow ? "- " : "+ ";

  const [year, month, day] = transaction.transaction_date.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);

  const transactionName = (transaction as any).title || "Sem Título";

  const formattedDate = dateFormatter.format(localDate);
  const formattedAmount = currencyFormatter.format(Math.abs(transaction.amount));

  const DisplayContent =
    isTransfer && sourceAccount && targetAccount ? (
      <div className="flex flex-col items-start gap-0">
        <div className="flex gap-2 justify-center items-center">
          <span className="font-semibold text-default-font">{sourceAccount.name}</span>
          <ArrowRight className="h-4 w-4  text-foreground" />
          <span className="font-semibold text-foreground">{targetAccount.name}</span>
        </div>
        <span className="text-secondary-foreground text-sm">{formattedDate}</span>
      </div>
    ) : (
      <div className="flex flex-col justify-center">
        <span className="font-semibold text-foreground">{transactionName}</span>
        <span className="text-secondary-foreground text-sm">{formattedDate}</span>
      </div>
    );

  return (
    <div className="flex justify-between items-center p-3 gap-3 h-25 bg-card rounded-md border border-border shadow-md">
      <div className="flex justify-between w-full h-full items-center">
        <div className="flex items-center gap-3 h-full">
          <div
            className={`h-full w-1 rounded-full ${
              isTransfer ? "bg-blue-500" : isOutflow ? "bg-red-500" : "bg-green-500"
            }`}
          ></div>

          {DisplayContent}
        </div>

        <span className={`${isTransfer ? "text-blue-400" : amountColor} font-semibold `}>
          {isTransfer ? "" : amountPrefix}
          {formattedAmount}
        </span>
      </div>
      <div>
        <TransactionActions
          transaction={transaction}
          accounts={accounts}
          categories={categories}
          onActionSuccess={refreshList}
        />
      </div>
    </div>
  );
}
