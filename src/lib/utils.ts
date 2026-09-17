import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * CN FUNCTION - Merge Tailwind CSS classes and resolve conflicts.
 * Example: cn("px-2", "px-4") -> "px-4" (last one wins)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
