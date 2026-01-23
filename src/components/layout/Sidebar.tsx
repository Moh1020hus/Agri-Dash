// src/components/layout/Sidebar.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map as MapIcon,
  Sprout,
  BarChart3,
  Settings,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { clsx } from "clsx";

export function Sidebar() {
  const pathname = usePathname();
  // State to toggle between expanded (w-64) and collapsed (w-20)
  const [isExpanded, setIsExpanded] = useState(false);

  // Navigation Items
  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Feldverwaltung", href: "/fields/f-001", icon: MapIcon }, // Example link
    { name: "Pflanzenanalyse", href: "/analysis", icon: Sprout },
    { name: "Berichte & Daten", href: "/reports", icon: BarChart3 },
    { name: "Einstellungen", href: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={clsx(
        // LAYOUT: Relative (not fixed), part of flex container, no shrink
        "h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-40 shrink-0",
        // WIDTH LOGIC: Changes the physical width of the sidebar
        isExpanded ? "w-64" : "w-20",
      )}
      // Interaction: Expand on Hover (or you can use a button)
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* 1. LOGO AREA */}
      <div className="h-16 flex items-center px-4 border-b border-slate-100 overflow-hidden whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
            <Sprout className="text-white" size={24} />
          </div>
          <span
            className={clsx(
              "font-bold text-xl text-slate-800 transition-opacity duration-300",
              isExpanded ? "opacity-100" : "opacity-0 hidden",
            )}
          >
            AgriDash
          </span>
        </div>
      </div>

      {/* 2. NAVIGATION */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-x-hidden">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all whitespace-nowrap group",
                isActive
                  ? "bg-green-50 text-green-700 font-semibold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              {/* Icon */}
              <item.icon
                size={22}
                className={clsx(
                  "shrink-0",
                  isActive
                    ? "text-green-600"
                    : "text-slate-400 group-hover:text-slate-600",
                )}
              />

              {/* Label (Hidden when collapsed) */}
              <span
                className={clsx(
                  "transition-opacity duration-300",
                  isExpanded ? "opacity-100" : "opacity-0 w-0 hidden",
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* 3. FOOTER / TOGGLE (Optional visual indicator) */}
      <div className="p-4 border-t border-slate-100 flex justify-center">
        <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors">
          {isExpanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </aside>
  );
}
