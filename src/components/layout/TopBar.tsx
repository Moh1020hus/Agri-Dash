"use client";

import { Bell, Search } from "lucide-react";

export function TopBar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* LEFT: Search Bar (Optional, adds professional look) */}
      <div className="relative hidden md:block w-96">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Suche nach Feldern, Sensoren..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* RIGHT: User Actions */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications */}
        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full relative transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="w-px h-8 bg-slate-200 mx-1"></div>

        {/* User Profile Dropdown */}
        <button className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
          <div className="text-right hidden md:block">
            <div className="text-sm font-bold text-slate-800">John Doe</div>
            <div className="text-xs text-slate-500">Farm Manager</div>
          </div>
          <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold border border-blue-200">
            JD
          </div>
        </button>
      </div>
    </header>
  );
}
