// src/components/modals/add-transaction-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeftRight,
  BanknoteArrowDown,
  BanknoteArrowUp,
  CalendarIcon,
  ChevronDownIcon,
  Plus,
} from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { createTransaction } from "@/lib/supabase/actions/transactions-actions";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
} from "../../ui/dialog";
import { Account } from "@/types/accounts";
import { Category } from "@/types/categories";
import { TransactionPayload, TransactionType } from "@/types/transactions";
import { handleActionToast } from "@/lib/utils";

const FormSchema = z
  .object({
    title: z.string().optional(),

    amount: z.string().regex(/^\d+(?:[.,]\d{1,2})?$/, "Invalid value format."),
    type: z.enum(["income", "expense", "transfer"]),
    transaction_date: z.date(),
    account_id: z.string(),
    category_id: z.string().optional(),
    target_account_id: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.type !== "transfer") {
      if (!data.title || data.title.trim().length < 2) {
        ctx.addIssue({
          code: "custom",
          message: "The title is required for 'income' or 'expense' transactions.",
          path: ["title"],
        });
      }
    }
  });

type TransactionFormValues = z.infer<typeof FormSchema>;

interface AddTransactionFormProps {
  accounts: Account[];
  categories: Category[];
}

export default function AddTransactionForm({ accounts, categories }: AddTransactionFormProps) {
  const [currentType, setCurrentType] = useState<TransactionType>("expense");
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      amount: "",
      type: "expense",
      transaction_date: new Date(),
      account_id: undefined,
      category_id: undefined,
      target_account_id: undefined,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  async function onSubmit(data: TransactionFormValues) {
    const amountFloat = parseFloat(data.amount);

    if (isNaN(amountFloat)) {
      alert("Invalid value.");
      return;
    }

    const payload: TransactionPayload = {
      title: data.title,
      amount: amountFloat,
      type: data.type,
      transaction_date: format(data.transaction_date, "yyyy-MM-dd"),
      account_id: data.account_id,
      category_id: data.category_id,
      target_account_id: data.target_account_id,
    };

    await handleActionToast(createTransaction(payload, payload.account_id), {
      form,
      closeModal: () => setIsOpen(false),
    });
  }

  form.watch("type");

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="icon_transitions">
          <Plus size={30} className="md:size-4 size-10 " />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="mb-4">
              <DialogTitle>New Transaction</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={(value: TransactionType) => {
                        field.onChange(value);
                        setCurrentType(value);
                        form.setValue("category_id", undefined);
                        form.setValue("target_account_id", undefined);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select the type of transaction" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="expense">
                          <BanknoteArrowDown className="text-red-600" /> Expense
                        </SelectItem>
                        <SelectItem value="income">
                          <BanknoteArrowUp className="text-green-600" /> Income
                        </SelectItem>
                        <SelectItem value="transfer">
                          <ArrowLeftRight className="text-blue-600" /> Transfer
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Value $</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {currentType !== "transfer" && (
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Lunch, Salary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="transaction_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Select a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="account_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {currentType === "expense" ? "Source Account" : "Account"}
                    </FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        if (currentType === "transfer") {
                          form.setValue("target_account_id", undefined);
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {currentType !== "transfer" && (
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(currentType === "expense" ? expenseCategories : incomeCategories).map(
                            (category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {currentType === "transfer" && (
                <FormField
                  control={form.control}
                  name="target_account_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Account</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? undefined}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accounts
                            .filter((a) => a.id !== form.getValues("account_id"))
                            .map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Transition"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
