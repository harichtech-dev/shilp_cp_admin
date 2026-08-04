"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export const useRequireAdmin = () => {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const canAccess = user?.role === "admin";

  useEffect(() => {
    if (user !== null && user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [user, router]);

  return canAccess;
};
