"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      document.cookie = `token=${token}; path=/`;
    } else {
      router.push("/login");
    }
  }, [router]);
};
