"use client";

import {
  LayoutDashboard,
  Map as MapIcon,
  Sprout,
  BarChart3,
  Settings,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // <--- NEW IMPORTS
import { clsx } from "clsx";

export function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Get current view from URL, default to 'dashboard'
  const activeItem = searchParams.get("view") || "dashboard";

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "fields", label: "Feldverwaltung", icon: MapIcon }, // You can map these later
    { id: "plants", label: "Pflanzenanalyse", icon: Sprout },
    { id: "reports", label: "Berichte & Daten", icon: BarChart3 },
    { id: "settings", label: "Einstellungen", icon: Settings },
  ];

  const handleNavigation = (id: string) => {
    // This pushes ?view=settings to the URL
    router.push(`/?view=${id}`);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-50">
        <div className="font-bold text-lg text-slate-800 flex items-center gap-2">
          <Sprout className="text-green-600" /> AgriDash
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-slate-600"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* SIDEBAR */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out shadow-xl overflow-hidden",
          isMobileOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full md:translate-x-0",
          "md:w-20 md:hover:w-64 group",
        )}
      >
        {/* LOGO AREA */}
        <div className="h-16 flex items-center px-5 border-b border-slate-100 whitespace-nowrap">
          <div className="bg-green-600 p-2 rounded-lg text-white shrink-0 transition-transform group-hover:scale-110">
            <Sprout size={24} />
          </div>
          <span className="ml-4 font-bold text-xl text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
            AgriDash
          </span>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 py-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)} // <--- UPDATED CLICK HANDLER
              className={clsx(
                "w-full flex items-center px-5 py-3 transition-colors relative whitespace-nowrap",
                activeItem === item.id
                  ? "text-blue-600 bg-blue-50"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <item.icon size={24} className="shrink-0" />
              <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* PROFILE */}
        <div className="p-4 border-t border-slate-100 whitespace-nowrap">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold shrink-0">
              JD
            </div>
            <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-sm font-medium text-slate-900">John Doe</p>
              <p className="text-xs text-slate-500">Landwirt</p>
            </div>
          </div>
        </div>
      </aside>

      {/* OVERLAY */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
