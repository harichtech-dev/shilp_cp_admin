import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; // Toast notifications.

/**
 * FONTS - Import the Google font families used by the application.
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
 * METADATA - Browser tab title, description, and favicon.
 */
export const metadata: Metadata = {
  title: "Image Delivery",
  description: "Channel Partner Admin Panel",
    icons: {
    icon: "/shilp-favicon3.png", // Favicon path
  },
};

/**
 * ROOT LAYOUT COMPONENT - Shared wrapper for all application pages.
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
        
        {/* TOASTER - Global notification system */}
          {/* Display notifications triggered by toast.success(), toast.error(), etc. */}
        <Toaster
          position="top-right" // Display notifications in the top-right corner.
          theme="dark" // Dark theme
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
