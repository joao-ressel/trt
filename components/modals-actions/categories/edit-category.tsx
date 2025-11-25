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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Loader2, Save, BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";
import { useState } from "react";
import * as z from "zod";
import { Category, CategoryType, ICON_OPTIONS } from "@/types/categories";
import { CategoryPayload, updateCategory } from "@/lib/supabase/actions/categories-actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type CategoryEditFormValues = z.infer<typeof categoryEditSchema>;

interface CategoryActionsProps {
  category: Category;
  onActionSuccess: () => void;
}
const categoryEditSchema = z.object({
  name: z.string().min(2, "The category name must be at least 2 characters long."),
  type: z.enum(["income", "expense"]),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Color must be a valid Hex code."),
  icon: z.string().min(1, "Select an icon."),
});

export function EditCategory({ category, onActionSuccess }: CategoryActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CategoryEditFormValues>({
    resolver: zodResolver(categoryEditSchema),
    defaultValues: {
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon,
    },
  });

  const handleEdit = async (values: CategoryEditFormValues) => {
    setIsLoading(true);

    const payload: Partial<CategoryPayload> = {
      name: values.name,
      type: values.type as CategoryType,
      color: values.color,
      icon: values.icon,
    };

    const result = await updateCategory(category.id.toString(), payload);

    if (result.success) {
      setIsEditDialogOpen(false);
      onActionSuccess();
    } else {
      console.error("Update failed:", result.message);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Edit Category">
          <Pencil className="h-4 w-4 text-foreground hover:text-blue-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Make changes to the category {category.name}. Click save when you are done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: C6 Category, Nubank Savings" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="expense">
                        <BanknoteArrowDown className="text-red-600" /> Expense
                      </SelectItem>
                      <SelectItem value="income">
                        <BanknoteArrowUp className="text-green-600" /> Income
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Ícone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <span className="flex items-center gap-2">
                            <SelectValue placeholder="Selecione um ícone" />
                          </span>
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {ICON_OPTIONS.map((option) => (
                          <SelectItem key={option.name} value={option.name}>
                            <span className="flex items-center gap-2">
                              <option.Component className="h-4 w-4" />
                              {option.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identification Color</FormLabel>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Input type="color" className="w-8 h-8 p-0" {...field} />
                    </FormControl>
                    <Input className="flex-1" placeholder="#RRGGBB" {...field} />
                  </div>
                  <FormDescription className="pt-1" style={{ color: field.value }}>
                    This color will be used in the category display.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
