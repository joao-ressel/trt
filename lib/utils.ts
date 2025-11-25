import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

/**
 * Formats a number into a currency string with two decimal places.
 * This is primarily used for displaying monetary values.
 * * @param value The number to format (e.g., 1234.56).
 * @returns The formatted string (e.g., "1,234.56").
 */
export function formatNumberToCurrency(value: number): string {
  if (value === null || value === undefined) return "0.00";

  // Use the locale to ensure proper formatting for display (e.g., with thousands separator)
  // We use 'en-US' locale for consistency with the currency display format in 'account-list-item.tsx'
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
