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
  Globe, // Import Globe icon for the Map
} from "lucide-react";
import { clsx } from "clsx";

export function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  // Define navigation items
  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Flächenverwaltung", href: "/map", icon: MapIcon },
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
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-xl text-green-600">
          {/* Simple Logo Icon */}
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Sprout size={20} />
          </div>
          {isExpanded && (
            <span className="animate-in fade-in duration-200">AgriDash</span>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-green-50 text-green-700 font-medium shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <item.icon
                size={22}
                className={clsx(
                  isActive
                    ? "text-green-600"
                    : "text-slate-400 group-hover:text-slate-600",
                )}
              />

              {isExpanded && (
                <span className="whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-200">
                  {item.name}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {!isExpanded && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
