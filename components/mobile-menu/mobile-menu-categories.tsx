"use client";

import { useState } from "react";
import { Grid3x2 } from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

import AddCategoryForm from "@/components/modals-actions/categories/add-category";
import CategoryListItem from "@/components/lists/category-list-item";

import { Category } from "@/types/categories";

interface MobileMenuCategoriesProps {
  categories: Category[];
}

export function MobileMenuCategories({ categories }: MobileMenuCategoriesProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden flex-1">
          <Grid3x2 className="h-5 w-5" /> Categories
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <div>
          <ScrollArea className="h-[90%] p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <AddCategoryForm />
              </div>
              {categories.map((category) => (
                <CategoryListItem key={category.id} category={category} />
              ))}
              {categories.length === 0 && <p className="text-foreground">No category found.</p>}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
