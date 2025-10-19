import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and merges Tailwind CSS classes safely.
 * This is crucial for resolving conflicts when overriding styles.
 * @param inputs - Array of class values (strings, arrays, objects, booleans, nulls)
 * @returns A single merged class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
