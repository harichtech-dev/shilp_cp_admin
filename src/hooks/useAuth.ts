// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export const useAuth = () => {
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       document.cookie = `token=${token}; path=/`;
//     } else {
//       router.push("/login");
//     }
//   }, [router]);
// };

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    // CHECK TOKEN FROM COOKIE
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    // IF TOKEN NOT FOUND
    if (!token) {
      router.push("/login");
    }
  }, [router]);
};
