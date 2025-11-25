"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import * as z from "zod";

import { BanknoteArrowDown, BanknoteArrowUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";

import { createCategory } from "@/lib/supabase/actions/categories-actions";
import { ICON_OPTIONS } from "@/types/categories";
import { handleActionToast } from "@/lib/utils";

const FormSchema = z.object({
  name: z.string().min(2, "The category name must be at least 2 characters long."),
  type: z.enum(["income", "expense"]),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Color must be a valid Hex code."),
  icon: z.string().min(1, "Select an icon."),
});

type CategoryFormValues = z.infer<typeof FormSchema>;

export default function AddCategoryForm() {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      type: "expense",
      color: "#D97706",
      icon: "Utensils",
    },
  });

  async function onSubmit(data: CategoryFormValues) {
    const payload = {
      name: data.name,
      type: data.type,
      color: data.color,
      icon: data.icon,
    };

    await handleActionToast(createCategory(payload), {
      form,
      closeModal: () => setIsOpen(false),
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="order-2">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="mb-4">
              <DialogTitle>New Category</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Gasoline, Present" {...field} />
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
                          <SelectValue placeholder="Select the type" />
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
                      <FormLabel>Icon</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <span className="flex items-center gap-2">
                              <SelectValue placeholder="Select an icon" />
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
                    <FormLabel>Color</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Input type="color" className="w-8 h-8 p-0" {...field} />
                      </FormControl>

                      <Input className="flex-1" placeholder="#RRGGBB" {...field} />
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
