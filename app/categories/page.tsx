import { createClient } from "@/services/supabase/server";

import { DbCategory } from "@/types/categories";

import { Separator } from "@/components/ui/separator";
import AddCategoryForm from "./components/modals/add-category";
import CategoryListItem from "./components/category-list-item";

export default async function CategoriesPage() {
  const supabase = await createClient();

  const [{ data: categories }] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .then((res) => res as any),
  ]);

  const formattedCategories: DbCategory[] = (categories as DbCategory[]) || [];

  const incomeCategories = formattedCategories.filter((c) => c.type === "income");
  const expenseCategories = formattedCategories.filter((c) => c.type === "expense");

  return (
    <div className="w-full min-h-[calc(100vh-(var(--spacing) * 20))] p-6 space-y-6">
      <div className="space-y-4 hidden md:block">
        <div className="flex justify-between gap-4 items-center mb-4">
          <h2 className="text-2xl font-bold">Categories</h2>
          <AddCategoryForm />
        </div>

        <div className="flex flex-row w-full gap-8">
          <div>
            <div className="bg-red-300 dark:bg-red-900 flex items-center justify-center p-2 rounded-sm  mb-3 ">
              <h3 className="text-xl font-semibold text-foreground">Expense</h3>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {expenseCategories.map((category) => (
                <CategoryListItem key={category.id} category={category} />
              ))}
            </div>
          </div>
          <div>
            <Separator orientation="vertical" />
          </div>

          <div>
            <div className="bg-green-300 dark:bg-green-900 flex items-center justify-center p-2 rounded-sm  mb-3 ">
              <h3 className="text-xl font-semibold text-foreground">Income</h3>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {incomeCategories.map((category) => (
                <CategoryListItem key={category.id} category={category} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {formattedCategories.length === 0 && <p className="text-foreground">No categories found.</p>}
    </div>
  );
}
