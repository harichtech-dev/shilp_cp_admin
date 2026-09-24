"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Image,
  Video,
  Plug,
  LogOut,
} from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

/**
 * Sidebar - main navigation rail for the admin panel.
 */
type Props = {
  closeSidebar?: () => void;
  collapsed?: boolean;
  setCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Sidebar - renders the navigation rail.
 * Highlights the active link by matching the pathname, hides admin-only
 * links from non-admin users, supports a desktop collapsed/expanded mode
 * and a mobile drawer (closeSidebar), and confirms before signing out.
 */
export default function Sidebar({
  closeSidebar,
  collapsed,
  setCollapsed,
}: Props) {
  // For programmatic navigation (e.g. redirecting after logout)
  const router = useRouter();
  // Current route - used to highlight the active link
  const pathname = usePathname();
  // Tracks whether the logout confirmation dialog is open
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  // Signed-in user from the global store - gates the admin-only links
  const user = useAuthStore((s) => s.user);

  /**
   * handleLogout - signs the admin out
   * Removes the token from localStorage and redirects to the login page.
   */
  const handleLogout = () => {
    // Remove the token so protected routes become inaccessible
    localStorage.removeItem("token");
    // Redirect to the login page
    router.push("/login");
  };

  /**
   * linkClass - generates the styling for a navigation link
   * The active link gets a black background; inactive links get a hover effect.
   */
  const linkClass = (path: string) =>
    `flex items-center rounded-xl text-sm transition-all duration-200 py-3 ${
      pathname === path // True when the link matches the current route
        ? "bg-black text-white font-medium" // Active link styling
        : "text-gray-500 hover:bg-gray-100 hover:text-black" // Inactive link styling
    }`;

  return (
    <>
      <aside
        className={`
      relative h-full bg-white border-r border-gray-200 flex flex-col
      transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}
    `}
      >
        <div className="border-b border-gray-100">
          <div
            className={`flex items-center px-4 py-3 ${
              collapsed ? "justify-center" : "justify-between"
            }`}
          >
            {/* Logo - shows just "A" when collapsed, full text when expanded */}
            {collapsed ? (
              // Collapsed state shows only "A"; clicking expands the sidebar
              <button
                onClick={() => setCollapsed?.(false)}
                className="w-10 h-8 rounded-lg bg-black text-white flex items-center justify-center font-semibold text-sm"
              >
                A
              </button>
            ) : (
              // Expanded state - full "Admin Panel" text plus the collapse button
              <>
                <Link href="/dashboard">
                  <div className="text-lg font-bold tracking-tight">
                    Admin Panel
                  </div>
                </Link>

                {/* Collapse button - desktop only; minimizes the sidebar */}
                <button
                  onClick={() => setCollapsed?.(true)}
                  className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                >
                  <ChevronLeft size={16} />
                </button>
              </>
            )}
          </div>
        </div>
        {/* Navigation Menu - Main links */}
        <nav className="flex-1 p-3 space-y-1">
          {/* Dashboard Link - Main dashboard page */}
          <Link
            href="/dashboard"
            onClick={closeSidebar}
            className={`${linkClass("/dashboard")} flex items-center ${
              collapsed ? "justify-center px-0" : "gap-3 px-4"
            }`}
          >
            <LayoutDashboard size={18} />
            {!collapsed && <span>Dashboard</span>}
          </Link>

          {/* Users management link - user listing and operations */}
          <Link
            href="/users"
            onClick={closeSidebar}
            className={`${linkClass("/users")} flex items-center ${
              collapsed ? "justify-center px-0" : "gap-3 px-4"
            }`}
          >
            <Users size={18} />
            {!collapsed && <span>Users</span>}
          </Link>
          
          {/* Image templates link - image uploads and management */}
          <Link
            href="/image-template"
            onClick={closeSidebar}
            className={`${linkClass("/image-template")} flex items-center ${
              collapsed ? "justify-center px-0" : "gap-3 px-4"
            }`}
          >
            <Image size={18} />
            {!collapsed && <span>Image Templates</span>}
          </Link>

          {/* Video templates link - video uploads and management */}
          <Link
            href="/video-template"
            onClick={closeSidebar}
            className={`${linkClass("/video-template")} flex items-center ${
              collapsed ? "justify-center px-0" : "gap-3 px-4"
            }`}
          >
            <Video size={18} />
            {!collapsed && <span>Video Templates</span>}
          </Link>

          {/* Admin-only Link - Integrations management (WATI, INTERAKT) */}
          {/* Only rendered when the signed-in user has the admin role */}
          {user?.role === "admin" && (
            <Link
              href="/integrations"
              onClick={closeSidebar}
              className={`${linkClass("/integrations")} flex items-center ${
                collapsed ? "justify-center px-0" : "gap-3 px-4"
              }`}
            >
              <Plug size={18} />
              {!collapsed && <span>Manage Integrations</span>}
            </Link>
          )}
        </nav>

        {/* Logout button - pinned to the bottom of the sidebar */}
        <div className="p-4 border-t border-gray-100">
          {/* Logout button - opens the confirmation dialog when clicked */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className={`
    w-full bg-black text-white text-sm py-2.5 rounded-lg
    hover:bg-gray-900 transition font-medium
    flex items-center
    ${collapsed ? "justify-center px-0" : "justify-center gap-2 px-4"}
  `}
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
      
      {/* Logout Confirmation Modal - Overlay dialog */}
      {showLogoutConfirm && (
        <div
          className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center"
          onClick={(e) => {
            // Clicking the backdrop (not the dialog itself) closes it
            if (e.target === e.currentTarget) setShowLogoutConfirm(false);
          }}
        >
          <div className="bg-white rounded-2xl w-[360px] mx-4 p-7 shadow-2xl border border-zinc-100">
            {/* Icon */}
            <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mb-5">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </div>

            {/* Text */}
            <h2 className="text-[15px] font-semibold text-zinc-900 tracking-tight mb-1">
              Sign out of Admin Panel?
            </h2>
            <p className="text-[13px] text-zinc-400 leading-relaxed mb-6">
              You&apos;ll need to sign back in to access the dashboard and manage
              your templates.
            </p>

            {/* User chip */}
            {/* <div className="bg-zinc-50 border border-zinc-100 rounded-xl px-3.5 py-3 flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#52525b"
                  strokeWidth="1.8"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
                </svg>
              </div>
              <div>
                <p className="text-[12px] font-medium text-zinc-800 leading-none mb-0.5">
                  Admin User
                </p>
                <p className="text-[11px] text-zinc-400">admin@panel.com</p>
              </div>
            </div> */}

            {/* Modal buttons - cancel or confirm the sign-out */}
            <div className="grid grid-cols-2 gap-2">
              {/* Cancel button - closes the modal without signing out */}
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="py-2.5 rounded-xl border border-zinc-200 text-[13px] font-medium text-zinc-600 hover:bg-zinc-50 transition"
              >
                Stay signed in
              </button>
              {/* Logout button - calls handleLogout (removes token + redirects to login) */}
              <button
                onClick={handleLogout}
                className="py-2.5 rounded-xl bg-black hover:bg-black text-white text-[13px] font-semibold transition flex items-center justify-center gap-1.5"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
