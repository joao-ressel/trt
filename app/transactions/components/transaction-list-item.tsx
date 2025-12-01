"use client";

import { DbTransaction } from "@/types/transactions";
import { DbCategory, ICON_OPTIONS } from "@/types/categories";
import { DbAccount } from "@/types/accounts";

import { ArrowLeftRight, ArrowRight, LucideIcon } from "lucide-react";
import { currencyFormatter } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { getContrast } from "polished";
import { DeleteTransaction } from "./modals/delete-transaction";
import { EditTransaction } from "./modals/edit-transaction";

interface TransactionListItemProps {
  transaction: DbTransaction;
  accounts: DbAccount[];
  categories: DbCategory[];
}

export default function TransactionListItem({
  transaction,
  accounts,
  categories,
}: TransactionListItemProps) {
  const [open, setOpen] = useState(false);

  const isTransfer = transaction.type === "transfer";

  const sourceAccount = accounts.find((a) => a.id === Number(transaction.account_id));
  const targetAccount = accounts.find((a) => a.id === Number(transaction.target_account_id));

  const isOutflow = transaction.type === "expense" || transaction.direction === "out";

  const amountColor = isOutflow ? "text-red-400" : "text-green-400";
  const amountPrefix = isOutflow ? "- " : "+ ";

  const dateString = transaction.transaction_date ?? "";
  const [year, month, day] = dateString.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);

  const transactionName = (transaction as any).title || "Sem Título";

  const amountNumber = Number(transaction.amount);
  const formattedAmount = currencyFormatter.format(Math.abs(amountNumber));

  const IconMap: { [key: string]: LucideIcon } = ICON_OPTIONS.reduce((acc, icon) => {
    acc[icon.name] = icon.Component;
    return acc;
  }, {} as any);

  const category = categories.find((c) => c.id === Number(transaction.category_id));
  const safeIcon = category?.icon ?? "";
  const IconComponent = IconMap[safeIcon];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          onClick={() => setOpen(true)}
          className="flex justify-between items-center p-3 gap-3 bg-card rounded-md border border-border shadow-sm"
        >
          <div className="flex justify-between w-full h-full items-center">
            <div className="flex items-center gap-3 h-full">
              <div
                style={{ backgroundColor: category?.color || "" }}
                className={`h-full w-10 rounded-md flex items-center justify-center p-2 shadow-inner ${
                  isTransfer ? "bg-blue-500" : isOutflow ? "bg-red-500" : "bg-green-500"
                }`}
              >
                {category?.icon ? (
                  <IconComponent
                    className="h-6 w-6 text-black"
                    style={{
                      color:
                        getContrast(category?.color || "var(--backgorund)", "#fff") < 3.5
                          ? "#000"
                          : "#fff",
                    }}
                  />
                ) : (
                  <ArrowLeftRight
                    style={{
                      color: getContrast(category?.color || "#fff", "#fff") < 3.5 ? "#000" : "#fff",
                    }}
                  />
                )}
              </div>

              {isTransfer && sourceAccount && targetAccount ? (
                <div className="flex flex-col items-start gap-0">
                  <div className="flex gap-2 justify-center items-center">
                    <span className="font-semibold text-default-font">{sourceAccount.name}</span>
                    <ArrowRight className="h-4 w-4  text-foreground" />
                    <span className="font-semibold text-foreground">{targetAccount.name}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center">
                  <span className="font-semibold text-foreground">{transactionName}</span>
                </div>
              )}
            </div>

            <span className={`${isTransfer ? "text-blue-500" : amountColor} font-semibold `}>
              {isTransfer ? "" : amountPrefix}
              {formattedAmount}
            </span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div
              className="h-full w-10 rounded-md flex items-center justify-center p-2 shadow-inner bg-blue-500"
              style={{ backgroundColor: category?.color || "" }}
            >
              {category?.icon ? (
                <IconComponent
                  className="h-6 w-6 text-black"
                  style={{
                    color:
                      getContrast(category?.color || "var(--backgorund)", "#fff") < 3.5
                        ? "#000"
                        : "#fff",
                  }}
                />
              ) : (
                <ArrowLeftRight />
              )}
            </div>
            Transaction details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 flex flex-col">
          {transaction.type === "transfer" ? (
            <>
              <p>
                <strong className="text-secondary">Source Account: </strong>{" "}
                {sourceAccount?.name ?? "—"}
              </p>
              <p>
                <strong className="text-secondary">Target Account: </strong>{" "}
                {targetAccount?.name ?? "—"}
              </p>
            </>
          ) : (
            <>
              <p>
                <strong className="text-secondary">Description: </strong> {transaction.title}
              </p>
              <p>
                <strong className="text-secondary">Account: </strong> {sourceAccount?.name ?? "—"}
              </p>
              <p>
                <strong className="text-secondary">Category: </strong> {category?.name ?? "—"}
              </p>
            </>
          )}
          <p>
            <strong className="text-secondary">Amount: </strong>{" "}
            <span>R$ {transaction.amount}</span>
          </p>
          <p>
            <strong className="text-secondary">Date: </strong>{" "}
            {new Date(String(transaction.transaction_date)).toLocaleDateString("pt-BR")}
          </p>
          <p className="text-sm -mt-2.5 text-secondary">
            (added at: {new Date(String(transaction.created_at)).toLocaleDateString("pt-BR")})
          </p>
          <p>
            <strong className="text-secondary">Type: </strong>
            {transaction.type === "expense" ? "Expense" : "Income"}
          </p>
        </div>
        <DialogFooter className="w-full flex gap-3">
          <div className="w-full flex gap-3 justify-end">
            <EditTransaction
              accounts={accounts}
              categories={categories}
              transaction={transaction}
              closeDialog={() => setOpen(false)}
            />
            <DeleteTransaction
              transaction={transaction}
              account={String(transaction.account_id)}
              closeDialog={() => setOpen(false)}
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
