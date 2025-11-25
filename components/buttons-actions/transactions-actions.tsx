"use client";

import { EditTransaction } from "../modals-actions/transactions/edit-transaction";
import { DeleteTransaction } from "../modals-actions/transactions/delete-transaction";
import { Transaction } from "@/types/transactions";
import { Account } from "@/types/accounts";
import { Category } from "@/types/categories";

interface TransactionActionsProps {
  transaction: Transaction;

  accounts: Account[];
  categories: Category[];

  onActionSuccess: () => void;
}

export default function TransactionActions({
  accounts,
  categories,
  transaction,
  onActionSuccess,
}: TransactionActionsProps) {
  return (
    <div className="flex gap-2">
      <EditTransaction
        accounts={accounts}
        categories={categories}
        transaction={transaction}
        onActionSuccess={onActionSuccess}
      />
      <DeleteTransaction
        transaction={transaction}
        onActionSuccess={onActionSuccess}
        account={transaction.account_id}
      />
    </div>
  );
}
