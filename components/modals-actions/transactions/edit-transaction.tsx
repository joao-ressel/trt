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
import { ptBR } from "date-fns/locale";

import {
  Pencil,
  Loader2,
  Save,
  CalendarIcon,
  BanknoteArrowDown,
  BanknoteArrowUp,
  ArrowLeftRight,
} from "lucide-react";
import { useState } from "react";
import * as z from "zod";
import { Transaction, TransactionPayload, TransactionType } from "@/types/transactions";
import { updateTransaction } from "@/lib/supabase/actions/transactions-actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Account } from "@/types/accounts";
import { Category } from "@/types/categories";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { handleActionToast } from "@/lib/utils";

type TransactionEditFormValues = z.infer<typeof transactionEditSchema>;

interface AddTransactionFormProps {
  transaction: Transaction;
  accounts: Account[];
  categories: Category[];
  onActionSuccess: () => void;
}

const transactionEditSchema = z
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

export function EditTransaction({ transaction, accounts, categories }: AddTransactionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<TransactionEditFormValues>({
    resolver: zodResolver(transactionEditSchema),
    defaultValues: {
      type: transaction.type,
      title: transaction.title,
      transaction_date: parseISO(transaction.transaction_date),
      account_id: transaction.account_id,
      amount: String(transaction.amount),
      category_id: transaction.category_id,
      target_account_id: transaction.target_account_id,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const handleEdit = async (values: TransactionEditFormValues) => {
    setIsLoading(true);

    const payload: Partial<TransactionPayload> = {
      type: values.type,
      title: values.title,
      transaction_date: format(values.transaction_date, "yyyy-MM-dd"),
      account_id: values.account_id,
      amount: Number(values.amount),
      category_id: values.category_id,
      target_account_id: values.target_account_id,
    };

    await handleActionToast(
      updateTransaction(transaction.id.toString(), transaction.account_id.toString(), payload),
      {
        form,
        closeModal: () => setIsOpen(false),
      }
    );
  };

  const [currentType, setCurrentType] = useState<TransactionType>(transaction.type);
  form.watch("type");

  const expenseCategories = (categories || []).filter((c) => c.type === "expense");
  const incomeCategories = (categories || []).filter((c) => c.type === "income");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Edit Transaction">
          <Pencil className="h-4 w-4 text-secondary-foreground hover:text-secondary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            Make changes to the transaction {transaction.title}. Click save when you are done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
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
                        <SelectValue placeholder="Selecione o tipo de transação" />
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
                        <Button variant={"outline"} className="justify-start text-left font-normal">
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
                  <FormLabel>{currentType === "expense" ? "Source Account" : "Account"}</FormLabel>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
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
