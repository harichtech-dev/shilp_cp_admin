import { create } from "zustand";
import type { User } from "@/types/user";

interface AuthState {
  user: User | null; // User data ya null
  setUser: (user: User | null) => void; // Store the authenticated user.
  logout: () => void; // Logout function
}

/**
 * AUTH STORE - Zustand store shared across the application.
 */
export const useAuthStore = create<AuthState>((set) => ({
  // Initial state has no authenticated user.
  user: null,
  
  // Set the authenticated user.
  setUser: (user) => set({ user }),

  // Clear the token and authenticated user.
  logout: () => {
    localStorage.removeItem("token"); // Remove the token.
    set({ user: null }); // Clear the user.
  },
}));