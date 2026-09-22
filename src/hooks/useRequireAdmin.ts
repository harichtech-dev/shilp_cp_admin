"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export const useRequireAdmin = () => {
  const router = useRouter();
  const user = useAuthStore((s) => s.user); // Auth store se user data

  // Check karte hain ki user admin hai ya nahi
  const canAccess = user?.role === "admin";

  useEffect(() => {
    // Agar user logout hua ya admin nahi hai to dashboard par redirect kar do
    if (user !== null && user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [user, router]);

  // True/False return karte hain - admin hai ya nahi
  return canAccess;
};
