"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { deleteAccount } from "@/lib/supabase/actions/accounts-actions";
import { Account } from "@/types/accounts";

import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

interface AccountActionsProps {
  account: Account;
  onActionSuccess: () => void;
}

export function DeleteAccount({ account, onActionSuccess }: AccountActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const result = await deleteAccount(account.id.toString());

    if (result.success) {
      setIsDeleteDialogOpen(false);
      onActionSuccess();
    } else {
      console.error("Deletion failed:", result.message);
    }
    setIsLoading(false);
  };
  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Delete Account">
          <Trash2 className="h-4 w-4 text-secondary-foreground hover:text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the account <p className="bold">{account.name}</p> ?
            This action is irreversible and may delete all associated transactions if the database
            is configured for it.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Yes, Delete Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
