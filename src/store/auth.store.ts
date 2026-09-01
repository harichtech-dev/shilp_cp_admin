import { create } from "zustand";
import type { User } from "@/types/user";

interface AuthState {
  user: User | null; // User data ya null
  setUser: (user: User | null) => void; // User set karne ka function
  logout: () => void; // Logout function
}

/**
 * AUTH STORE - Zustand store create kar rahe hain
 * Ye store puri application mein accessible hota hai
 */
export const useAuthStore = create<AuthState>((set) => ({
  // Initial state - user null hai
  user: null,
  
  // User data set karne ka function
  setUser: (user) => set({ user }),

  // Logout function - Token remove kar ke user ko null set kar deta hai
  logout: () => {
    localStorage.removeItem("token"); // Token remove kar rahe hain
    set({ user: null }); // User ko null set kar rahe hain
  },
}));