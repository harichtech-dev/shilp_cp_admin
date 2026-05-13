"use client";

import { useAuthStore } from "@/store/auth.store";

type Props = {
  onMenuClick?: () => void;
  // collapsed: boolean;
  // setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Navbar({
  onMenuClick,
}: Props) {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu */}
        <button onClick={onMenuClick} className="lg:hidden">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Desktop Toggle */}
        {/* <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg border hover:bg-gray-100"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {collapsed ? (
              <path d="M9 18l6-6-6-6" />
            ) : (
              <path d="M15 18l-6-6 6-6" />
            )}
          </svg>
        </button> */}
        <h1 className="text-sm font-semibold text-gray-500 tracking-wide uppercase">
          Media Delivery Panel
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Admin</span>
        <div className="w-8 h-8 bg-black text-white text-sm flex items-center justify-center rounded-full font-medium">
          A
        </div>
      </div>
    </header>
  );
}
