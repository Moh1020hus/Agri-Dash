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
    <html lang="de">
      <body className={`${inter.className} bg-slate-50`}>
        <div className="flex h-screen overflow-hidden">
          {/* 1. SIDEBAR (Fixed position) */}
          <Sidebar />

          {/* 2. RIGHT CONTENT AREA */}
          {/* Added 'md:pl-20' to push content right, leaving space for the collapsed sidebar */}
          <div className="flex-1 flex flex-col h-screen overflow-hidden md:pl-20 transition-all duration-300">
            <TopBar />

            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
