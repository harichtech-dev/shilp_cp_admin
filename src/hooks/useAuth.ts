"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/services/auth.service"; // API se profile fetch karne ke liye
import { useAuthStore } from "@/store/auth.store"; // Auth state management

export const useAuth = () => {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser); // Zustand store se setUser function

  useEffect(() => {
    // Local storage se token nikalne ki koshish karte hain
    const token = localStorage.getItem("token");

    if (token) {
      // Token ko cookie mein bhi store kar rahe hain (Next.js middleware ke liye)
      document.cookie = `token=${token}; path=/`;

      // Backend se user profile fetch kar rahe hain
      getProfile()
        .then((res) => setUser(res.data)) // Successful to user data store kar do
        .catch(() => router.push("/login")); // Error ho to login page par jao
    } else {
      // Agar token nahi hai to login page par jao
      router.push("/login");
    }
  }, [router, setUser]);
};
