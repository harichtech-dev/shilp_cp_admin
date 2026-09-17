"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/services/auth.service"; // Fetch the profile from the API.
import { useAuthStore } from "@/store/auth.store"; // Auth state management

export const useAuth = () => {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser); // Read the Zustand store action.

  useEffect(() => {
    // Read the token from localStorage.
    const token = localStorage.getItem("token");

    if (token) {
      // Mirror the token in a cookie for Next.js middleware.
      document.cookie = `token=${token}; path=/`;

      // Fetch the administrator profile from the backend.
      getProfile()
        .then((res) => setUser(res.data)) // Store the returned user data.
        .catch(() => router.push("/login")); // Redirect to login when the request fails.
    } else {
      // Redirect to login when no token is available.
      router.push("/login");
    }
  }, [router, setUser]);
};
