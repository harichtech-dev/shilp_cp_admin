import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; // For toast notifications

/**
 * RootLayout - top-level wrapper for every page in the app.
 * Loads the Google fonts (Geist Sans + Geist Mono) as CSS variables,
 * exports global metadata, and mounts the <Toaster /> once so toast
 * notifications work across all routes.
 */

/**
 * FONTS - Google fonts
 * Both Geist Sans and Geist Mono are configured here.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * METADATA - browser tab title, description, and favicon
 */
export const metadata: Metadata = {
  title: "Image Delivery",
  description: "Channel Partner Admin Panel",
    icons: {
    icon: "/shilp-favicon3.png", // Favicon path
  },
};

/**
 * ROOT LAYOUT component - wraps the entire app
 * Every page renders as a child of this layout.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        
        {/* TOASTER - global notification system */}
        {/* Renders wherever toast.success(), toast.error(), etc. are called */}
        <Toaster
          position="top-right" // Shows in the top-right corner
          theme="dark" // Uses the dark theme
          toastOptions={{
            classNames: {
              toast: "bg-black text-white border border-white/10",
              title: "text-white",
              description: "text-zinc-300",
              actionButton: "bg-white text-black",
              cancelButton: "bg-zinc-800 text-white",
              success: "!bg-black !text-white !border-white/10",
              error: "!bg-black !text-white !border-white/10",
              warning: "!bg-black !text-white !border-white/10",
              info: "!bg-black !text-white !border-white/10",
            },
          }}
        />
      </body>
    </html>
  );
}
