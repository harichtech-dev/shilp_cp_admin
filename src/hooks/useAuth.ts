"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/services/auth.service"; // To fetch the profile from the API
import { useAuthStore } from "@/store/auth.store"; // Auth state management

/**
 * useAuth - Ensures the current user is authenticated on mount.
 * Reads the token from localStorage, mirrors it into a cookie (for the
 * Next.js middleware), fetches the user profile and stores it in the Zustand
 * store. Redirects to /login if the token is missing or invalid.
 */
export const useAuth = () => {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser); // Grab the setUser action from the Zustand store

  useEffect(() => {
    // Try to read the auth token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // Also mirror the token into a cookie so the Next.js middleware can read it
      document.cookie = `token=${token}; path=/`;

      // Fetch the user profile from the backend
      getProfile()
        .then((res) => setUser(res.data)) // On success, save the user data into the store
        .catch(() => router.push("/login")); // On error, redirect to the login page
    } else {
      // No token present - go to the login page
      router.push("/login");
    }
  }, [router, setUser]);
};
