import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// utils/currency.js

export function formatRiels(amount:any) {
  // Create the formatter with the 'Khmer (Cambodia)' locale.
  // This ensures it uses the correct currency symbol and format.
  const formatter = new Intl.NumberFormat('km-KH', {
    style: 'currency',
    currency: 'KHR',
  });

  return formatter.format(amount);
}
