"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export const useRequireAdmin = () => {
  const router = useRouter();
  const user = useAuthStore((s) => s.user); // Read the authenticated user.

  // Verify that the user has administrator access.
  const canAccess = user?.role === "admin";

  useEffect(() => {
    // Redirect unauthorized users to the dashboard.
    if (user !== null && user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [user, router]);

  // Return whether the current user is an administrator.
  return canAccess;
};
