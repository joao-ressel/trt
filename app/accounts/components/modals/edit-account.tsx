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
import { Pencil, Loader2, Save } from "lucide-react";
import { useState } from "react";
import * as z from "zod";
import {} from "@/types/transactions";
import { formatCurrencyToNumber, handleActionToast } from "@/lib/utils";
import { updateAccount } from "@/lib/supabase/actions/accounts-actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DbAccount,
  ACCOUNT_TYPES,
  AccountType,
  CURRENCY_TYPES,
  CurrencyType,
} from "@/types/accounts";

type AccountEditFormValues = z.infer<typeof accountEditSchema>;

interface AccountActionsProps {
  account: DbAccount;
}

const accountEditSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters."),
  description: z.string().optional().nullable(),
  type: z.enum(ACCOUNT_TYPES.map((t) => t.value) as [string, ...string[]]).nullable(),
  currency: z.enum(CURRENCY_TYPES.map((t) => t.value) as [string, ...string[]]).nullable(),
  current_balance: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid balance format. Use periods for decimals."),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format. Use #RRGGBB.")
    .nullable(),
});

export function EditAccount({ account }: AccountActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AccountEditFormValues>({
    resolver: zodResolver(accountEditSchema),
    defaultValues: {
      name: account.name,
      type: account.type,
      description: account.description,
      currency: account.currency,
      current_balance: String(account.current_balance),
      color: account.color,
    },
  });

  const handleEdit = async (values: AccountEditFormValues) => {
    setIsLoading(true);

    const currentBalanceNumber = formatCurrencyToNumber(values.current_balance as string);

    const payload: Partial<DbAccount> = {
      name: values.name,
      description: values.description || undefined,
      type: values.type as AccountType,
      currency: values.currency as CurrencyType,
      color: values.color || undefined,
      current_balance: currentBalanceNumber,
    };

    await handleActionToast(updateAccount(account.id, payload), {
      form,
      closeModal: () => setIsEditDialogOpen(false),
    });
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edit Account</DialogTitle>
              <DialogDescription>
                Make changes to the account {account.name}. <br />
                *It is not possible to edit the current value as it depends on your transfers.
              </DialogDescription>
            </DialogHeader>

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
                    <Input placeholder="Ex: CDI Investment" {...field} value={field.value ?? ""} />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ? String(field.value) : undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ? String(field.value) : undefined}
                  >
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
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Color</FormLabel>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Input
                        type="color"
                        className="w-8 h-8 p-0"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <Input
                      className="flex-1"
                      placeholder="#RRGGBB"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </div>
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
