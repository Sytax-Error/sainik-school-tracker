import { type ClassValue, clsx } from "clsx";

/**
 * Utility function to merge class names using clsx
 * This provides a clean way to conditionally apply classes
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
