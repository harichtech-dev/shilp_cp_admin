"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const linkClass = (path: string) =>
    `block px-4 py-2.5 rounded-lg text-sm transition ${
      pathname === path
        ? "bg-black text-white font-semibold"
        : "text-gray-600 hover:bg-gray-100 hover:text-black"
    }`;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <Link href="/dashboard">
        <div className="px-6 py-5 font-bold text-lg border-b border-gray-100 cursor-pointer text-black tracking-tight">
          Admin Panel
        </div>
      </Link>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-1">
        <p className="pt-4 pb-1 px-4 text-[10px] text-gray-400 uppercase tracking-widest font-medium">
          Navigation
        </p>
        <Link href="/dashboard" className={linkClass("/dashboard")}>
          Dashboard
        </Link>

        <Link href="/users" className={linkClass("/users")}>
          Users
        </Link>

        {/* Templates */}
        <div className="pt-4 pb-1 px-4 text-[10px] text-gray-400 uppercase tracking-widest font-medium">
          Templates
        </div>

        <Link href="/image-template" className={linkClass("/image-template")}>
          Image Templates
        </Link>

        <Link href="/video-template" className={linkClass("/video-template")}>
          Video Templates
        </Link>

        <p className="pt-4 pb-1 px-4 text-[10px] text-gray-400 uppercase tracking-widest font-medium">
          Integrations
        </p>

        <Link href="/integrations" className={linkClass("/integrations")}>
          Manage Integrations
        </Link>
      </nav>

      {/* Logout */}
      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full bg-black text-white text-sm py-2.5 rounded-lg hover:bg-gray-900 transition font-medium"
        >
          Logout
        </button>
      </div>

      {/* Logout Confirm Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm"
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
              You'll need to sign back in to access the dashboard and manage
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
    </aside>
  );
}
