"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";

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

import { createAccount } from "@/lib/supabase/accounts-actions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  ACCOUNT_TYPES,
  AccountType,
  CURRENCY_TYPES,
  CurrencyType,
  InsertAccount,
} from "@/types/accounts";
import { useState } from "react";
import { handleActionToast } from "@/lib/utils";

const FormSchema = z.object({
  name: z.string().min(2, "The account name must be at least 2 characters long."),
  description: z.string().optional(),
  initial_balance: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid initial value format."),
  type: z.enum(ACCOUNT_TYPES.map((t) => t.value) as [AccountType, ...AccountType[]]),
  last_balance_update_at: z.date(),
  currency: z.enum(CURRENCY_TYPES.map((t) => t.value) as [CurrencyType, ...CurrencyType[]]),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Color must be a valid Hex code."),
});

type AccountFormValues = z.infer<typeof FormSchema>;

export default function AddAccountForm() {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      initial_balance: "",
      last_balance_update_at: new Date(),
      currency: "BRL",
      type: "default",
      color: "#34D399",
    },
  });

  async function onSubmit(data: AccountFormValues) {
    const amountFloat = parseFloat(data.initial_balance);
    if (isNaN(amountFloat)) return;

    const payload = {
      name: data.name,
      initial_balance: amountFloat,
      current_balance: amountFloat,
      description: data.description ?? null,
      last_balance_update_at: new Date().toISOString(),
      currency: data.currency,
      type: data.type,
      color: data.color,
    } satisfies InsertAccount;

    await handleActionToast(createAccount(payload), {
      form,
      closeModal: () => setIsOpen(false),
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add Account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="mb-4">
              <DialogTitle>New Account</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: C6 Account, Nubank Savings" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: CDI Investment" {...field} />
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
                        {ACCOUNT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select the currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CURRENCY_TYPES.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="initial_balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opening Balance $</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
                {form.formState.isSubmitting ? "Creating..." : "Create Account"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
