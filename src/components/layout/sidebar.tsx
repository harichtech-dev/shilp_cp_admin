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
type Props = {
  closeSidebar?: () => void;
  collapsed?: boolean;
  setCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({
  closeSidebar,
  collapsed,
  setCollapsed,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const user = useAuthStore((s) => s.user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const linkClass = (path: string) =>
    `flex items-center rounded-xl text-sm transition-all duration-200 py-3 ${
      pathname === path
        ? "bg-black text-white font-medium"
        : "text-gray-500 hover:bg-gray-100 hover:text-black"
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
            {/* Logo */}
            {collapsed ? (
              <button
                onClick={() => setCollapsed?.(false)}
                className="w-10 h-8 rounded-lg bg-black text-white flex items-center justify-center font-semibold text-sm"
              >
                A
              </button>
            ) : (
              <>
                <Link href="/dashboard">
                  <div className="text-lg font-bold tracking-tight">
                    Admin Panel
                  </div>
                </Link>

                {/* Collapse Button */}
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
        {/* Menu */}
        <nav className="flex-1 p-3 space-y-1">
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
          {/* Templates */}

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

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
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
      {/* Logout Confirm Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center"
          onClick={(e) => {
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

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="py-2.5 rounded-xl border border-zinc-200 text-[13px] font-medium text-zinc-600 hover:bg-zinc-50 transition"
              >
                Stay signed in
              </button>
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
