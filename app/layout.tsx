export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgriDash",
  description: "Smart Farming Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="light" style={{ colorScheme: "light" }}>
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        {/* MAIN CONTAINER: Flexbox handles the side-by-side layout */}
        <div className="flex h-screen overflow-hidden">
          {/* 1. SIDEBAR: Now a direct child of flex, it will take up space */}
          <Sidebar />

          {/* 2. RIGHT CONTENT AREA */}
          {/* REMOVED 'md:pl-20'. 
              The 'flex-1' ensures this takes all remaining width automatically. */}
          <div className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300">
            <TopBar />

            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
