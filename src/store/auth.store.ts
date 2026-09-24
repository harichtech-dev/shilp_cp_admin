// auth.store.ts - Global authentication state managed with Zustand.
// Holds the currently logged-in user and exposes setUser/logout actions.
// Logout also clears the auth token from localStorage (the store itself is
// not persisted; the token lives in localStorage).

import { create } from "zustand";
import type { User } from "@/types/user";

// State and actions exposed by the auth store
interface AuthState {
  user: User | null; // Current user object, or null when logged out
  setUser: (user: User | null) => void; // Update the current user
  logout: () => void; // Clear the session (token + user)
}

/**
 * AUTH STORE - Creates the Zustand auth store.
 * The resulting hook is accessible from anywhere in the app.
 */
export const useAuthStore = create<AuthState>((set) => ({
  // Initial state - user starts as null
  user: null,
  
  // Stores the given user data in the store
  setUser: (user) => set({ user }),

  // Logout - removes the token and resets the user to null
  logout: () => {
    localStorage.removeItem("token"); // Removing the token from localStorage
    set({ user: null }); // Resetting the user to null
  },
}));