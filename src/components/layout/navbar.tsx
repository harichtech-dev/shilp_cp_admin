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
  // Read administrator data from the global store.
  const user = useAuthStore((s) => s.user);

  return (
    // Navbar container - fixed height, white background, border
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left section with the mobile menu button and page title */}
      <div className="flex items-center gap-3">
          {/* Open the sidebar on mobile devices */}
        <button onClick={onMenuClick} className="lg:hidden">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {/* Hamburger menu icon */}
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Page title - Media Delivery Panel */}
        <h1 className="text-sm font-semibold text-gray-500 tracking-wide uppercase">
          Media Delivery Panel
        </h1>
      </div>

      {/* Right Section - Admin profile / user info */}
      <div className="flex items-center gap-3">
        {/* Admin role label */}
        <span className="text-sm text-gray-500">Admin</span>
          {/* Administrator avatar */}
        <div className="w-8 h-8 bg-black text-white text-sm flex items-center justify-center rounded-full font-medium">
          A
        </div>
      </div>
    </header>
  );
}
