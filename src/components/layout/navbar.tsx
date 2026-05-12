"use client";

import { useAuthStore } from "@/store/auth.store";

export default function Navbar() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-sm font-semibold text-gray-500 tracking-wide uppercase">
        Media Delivery Panel
      </h1>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Admin</span>
        <div className="w-8 h-8 bg-black text-white text-sm flex items-center justify-center rounded-full font-medium">
          A
        </div>
      </div>
    </header>
  );
}
