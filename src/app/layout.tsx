import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; // Toast notifications ke liye

/**
 * FONTS - Google fonts import kar rahe hain
 * Geist Sans aur Geist Mono dono available hain
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
 * METADATA - Browser tab mein title, description, favicon etc.
 */
export const metadata: Metadata = {
  title: "Image Delivery",
  description: "Channel Partner Admin Panel",
    icons: {
    icon: "/shilp-favicon3.png", // Favicon path
  },
};

/**
 * ROOT LAYOUT COMPONENT - Puri app ka wrapper
 * Sab pages yahan ke children hote hain
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
        {/* Jab toast.success(), toast.error() etc. call hote hain to ye show hota hai */}
        <Toaster
          position="top-right" // Top right corner mein show hoga
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
