// utils.ts - Shared helper utilities used across the admin UI.

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * CN - Merges CSS class names.
 * Combines conditional classes with clsx, then resolves Tailwind conflicts
 * with twMerge so later classes win.
 * Example: cn("px-2", "px-4") -> "px-4" (the last one wins)
 */
export function cn(...inputs: ClassValue[]) {
  // Merge conditional classes, then de-duplicate conflicting Tailwind utilities
  return twMerge(clsx(inputs))
}
