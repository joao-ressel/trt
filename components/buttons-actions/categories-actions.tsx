"use client";

import { EditCategory } from "../modals-actions/categories/edit-category";
import { DeleteCategory } from "../modals-actions/categories/delete-category";
import { Category } from "@/types/categories";

interface CategoryActionsProps {
  category: Category;
  onActionSuccess: () => void;
}

export default function CategoryActions({ category, onActionSuccess }: CategoryActionsProps) {
  return (
    <div className="flex gap-2">
      <EditCategory category={category} onActionSuccess={onActionSuccess} />
      <DeleteCategory category={category} onActionSuccess={onActionSuccess} />
    </div>
  );
}
