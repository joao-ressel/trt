"use client";

import { EditAccount } from "../modals-actions/accounts/edit-account";
import { DeleteAccount } from "../modals-actions/accounts/delete-account";
import { Account } from "@/types/accounts";

interface AccountActionsProps {
  account: Account;
  onActionSuccess: () => void;
}

export default function AccountActions({ account, onActionSuccess }: AccountActionsProps) {
  return (
    <div className="flex gap-2">
      <EditAccount account={account} onActionSuccess={onActionSuccess} />
      <DeleteAccount account={account} onActionSuccess={onActionSuccess} />
    </div>
  );
}
