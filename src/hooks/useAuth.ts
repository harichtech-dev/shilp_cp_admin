"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export const useAuth = () => {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      document.cookie = `token=${token}; path=/`;

      getProfile()
        .then((res) => setUser(res.data))
        .catch(() => router.push("/login"));
    } else {
      router.push("/login");
    }
  }, [router, setUser]);
};
