"use client";

import { useState } from "react";
import { getContrast } from "polished";

import { ACCOUNT_TYPES, DbAccount } from "@/types/accounts";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditAccount } from "./modals/edit-account";
import { DeleteAccount } from "./modals/delete-account";

interface AccountListItemProps {
  account: DbAccount;
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function AccountListItem({ account }: AccountListItemProps) {
  const [open, setOpen] = useState(false);
  const balanceToFormat = account.current_balance ?? 0;
  const formattedCurrent = currencyFormatter.format(balanceToFormat);
  const balanceClass =
    balanceToFormat >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
  const typeAccount = ACCOUNT_TYPES.find((a) => a.value === account.type);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          onClick={() => setOpen(true)}
          className="flex flex-col justify-between items-center  gap-3 bg-card rounded-md border border-border shadow-md"
        >
          <div
            className="flex flex-col justify-center text-center w-full p-3 rounded-t-md"
            style={{ backgroundColor: account.color ?? "#000" }}
          >
            <span
              className="font-semibold text-card-foreground"
              style={{
                color:
                  getContrast(account?.color || "var(--backgorund)", "#fff") < 3.5
                    ? "#000"
                    : "#fff",
              }}
            >
              {account.name}
            </span>
          </div>

          <div className="flex flex-col items-center gap-4 p-3">
            <span className={`font-semibold ${balanceClass}`}>{formattedCurrent}</span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md p-0">
        <DialogHeader
          className="p-3 rounded-t-md border border-border border-b-0"
          style={{
            backgroundColor: account?.color || "",
          }}
        >
          <DialogTitle
            className="flex items-center gap-3"
            style={{
              color:
                getContrast(account?.color || "var(--backgorund)", "#fff") < 3.5 ? "#000" : "#fff",
            }}
          >
            Account details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 flex flex-col p-4">
          <p>
            <strong className="text-secondary">Name: </strong> {account?.name ?? "—"}
          </p>
          {account?.description && (
            <p>
              <strong className="text-secondary">Description: </strong>{" "}
              {account?.description ?? "—"}
            </p>
          )}
          <p>
            <strong className="text-secondary">Type: </strong> {typeAccount?.label}
          </p>
          <p>
            <strong className="text-secondary">Initial Balance: </strong>{" "}
            {account?.initial_balance ?? "—"}
          </p>
          <div className="flex justify-between items-center w-full">
            <p>
              <strong className="text-secondary">Current Balance: </strong>{" "}
              {formattedCurrent ?? "—"}
            </p>
            <span className="text-sm -mt-2 text-secondary"> {account.currency}</span>
          </div>
          <div className="w-full flex justify-end">
            <div className="flex gap-2 ">
              <EditAccount account={account} />
              <DeleteAccount account={account} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
