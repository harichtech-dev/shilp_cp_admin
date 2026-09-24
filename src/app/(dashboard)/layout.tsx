// "use client";

// import { useAuth } from "@/hooks/useAuth";
// import Sidebar from "@/components/layout/sidebar";
// import Navbar from "@/components/layout/navbar";
// import { useState } from "react";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   useAuth(); // 🔐 protect all dashboard routes

//   // mobile sidebar
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // desktop collapse
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <div className="flex min-h-screen bg-gray-100 overflow-hidden">
//       {/* Mobile Overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`
//           fixed lg:relative z-50
//           transition-all duration-300 ease-in-out
//           ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//           lg:translate-x-0
//           ${collapsed ? "w-20" : "w-64"}
//         `}
//       >
//         <Sidebar
//           collapsed={collapsed}
//           setCollapsed={setCollapsed}
//           closeSidebar={() => setSidebarOpen(false)}
//         />
//       </div>
//       {/* <Sidebar /> */}

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Navbar */}
//         {/* <Navbar /> */}

//         {/* Page Content */}
//         {/* <main className="p-6">{children}</main> */}
//         <div className="flex-1 flex flex-col min-w-0">
//           <Navbar onMenuClick={() => setSidebarOpen(true)} />

//           <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import { useState } from "react";

/**
 * DashboardLayout - shell that wraps every authenticated dashboard route.
 * Renders the sidebar (desktop static + mobile drawer), the top navbar,
 * and the active page content via {children}. Requiring admin auth here
 * guards all child routes at once.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Route guard - only signed-in admins can access dashboard routes.
  useAuth();

  // Controls the mobile sidebar drawer (overlay on small screens).
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Controls the desktop sidebar collapse (icon-only mode).
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* ── Desktop sidebar — always in-flow, never fixed ── */}
      <div
        className={`
          hidden lg:flex flex-col flex-shrink-0
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-64"}
        `}
      >
        {/* Desktop sidebar - width follows the collapse state. */}
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          closeSidebar={() => setSidebarOpen(false)}
        />
      </div>

      {/* ── Mobile sidebar — fixed overlay drawer ── */}
      {/* Backdrop - clicking it closes the drawer */}
      <div
        className={`
          fixed inset-0 bg-black/40 z-40 lg:hidden
          transition-opacity duration-300
          ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setSidebarOpen(false)}
      />
      {/* Drawer */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 lg:hidden
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Mobile drawer sidebar - always full width, slides in and out. */}
        <Sidebar
          collapsed={false}
          setCollapsed={setCollapsed}
          closeSidebar={() => setSidebarOpen(false)}
        />
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar - its menu button opens the mobile sidebar drawer. */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        {/* Active route content renders here. */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>

    </div>
  );
}