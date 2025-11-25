"use client";

import { deleteCategory } from "@/lib/supabase/actions/categories-actions";

import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Category } from "@/types/categories";
import { useState } from "react";

interface CategoryActionsProps {
  category: Category;
  onActionSuccess: () => void;
}

export function DeleteCategory({ category, onActionSuccess }: CategoryActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const result = await deleteCategory(category.id.toString());

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
        <Button variant="ghost" size="icon" title="Delete Category">
          <Trash2 className="h-4 w-4 text-foreground hover:text-red-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the category {category.name}? This action is
            irreversible.
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
            Yes, Delete Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
