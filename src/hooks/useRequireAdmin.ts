"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

/**
 * useRequireAdmin - Route access guard for admin-only pages.
 * Returns whether the current user has the "admin" role, and redirects
 * non-admin (or logged-out) users to the dashboard.
 */
export const useRequireAdmin = () => {
  const router = useRouter();
  const user = useAuthStore((s) => s.user); // Read the user from the auth store

  // Determine whether the user has the admin role
  const canAccess = user?.role === "admin";

  useEffect(() => {
    // Redirect logged-out or non-admin users to the dashboard
    if (user !== null && user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [user, router]);

  // Return true if the user is an admin, false otherwise
  return canAccess;
};
