import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { LucideIcon } from "lucide-react";
import { ICON_OPTIONS } from "@/types/categories";
import { createClient } from "./supabase/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyToNumber(value: string): number {
  if (!value) return 0;

  // Use parseFloat, which correctly handles the decimal point '.' used in the input schema (Zod)
  const numericValue = parseFloat(value);

  // Check if the result is a valid number; if not, return 0
  return isNaN(numericValue) ? 0 : numericValue;
}

export function formatNumberToCurrency(value: number): string {
  if (value === null || value === undefined) return "0.00";

  // Use the locale to ensure proper formatting for display (e.g., with thousands separator)
  // We use 'en-US' locale for consistency with the currency display format in 'account-list-item.tsx'
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

interface HandleActionToastOptions<T> {
  form?: { reset: () => void };
  closeModal?: () => void;
  messages?: {
    loading?: string;
    success?: string;
    error?: string;
  };
}

export async function handleActionToast<T extends { success?: boolean; message?: string }>(
  action: Promise<T>,
  options?: HandleActionToastOptions<T>
): Promise<T> {
  const defaultMessages = {
    loading: "Processing action...",
    success: "Your action was successful.",
    error: "Your action failed.",
  };

  const { form, closeModal, messages = {} } = options || {};
  const merged = { ...defaultMessages, ...messages };

  const toastId = toast.loading(merged.loading);

  try {
    const result = await action;

    if (result.success) {
      toast.success(result.message ?? merged.success, { id: toastId });
      form?.reset();
      closeModal?.();
    } else {
      toast.error(result.message ?? merged.error, { id: toastId });
    }

    return result;
  } catch (error: any) {
    toast.error(error?.message ?? merged.error, { id: toastId });
    return error;
  }
}

export const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  year: "numeric",
  month: "short",
  day: "numeric",
});
