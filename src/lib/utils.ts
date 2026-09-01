import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * CN FUNCTION - CSS classes ko merge karne ke liye
 * Tailwind CSS mein jab multiple classes combine karne ho to use karte hain
 * Automatically conflicting classes ko handle kar deta hai
 * Example: cn("px-2", "px-4") -> "px-4" (last one wins)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
