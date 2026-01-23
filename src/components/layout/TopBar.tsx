"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bell,
  Search,
  LogIn,
  Check,
  Info,
  AlertTriangle,
  ThermometerSnowflake,
  Trash2,
  MapPin, // New icon for Fields
  Activity, // New icon for Sensors
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";

// Import Data for Search & Notifications
import {
  getDynamicNotifications,
  Notification,
} from "@/lib/notification-service";
import { MOCK_FIELDS, MOCK_SENSORS } from "@/lib/dummy-data";

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();

  // --- NOTIFICATION STATE ---
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // --- SEARCH STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    fields: any[];
    sensors: any[];
  }>({ fields: [], sensors: [] });
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Auth Logic (Mock)
  const isLoginPage = pathname === "/login";
  const isLoggedIn = true;

  // --- LOAD NOTIFICATIONS ---
  useEffect(() => {
    setNotifications(getDynamicNotifications());
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // --- HANDLE CLICKS OUTSIDE (Closes dropdowns) ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close Notifications
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
      // Close Search
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- SEARCH LOGIC ---
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 0) {
      // Filter Fields
      const foundFields = MOCK_FIELDS.filter((f) =>
        f.name.toLowerCase().includes(query.toLowerCase()),
      );
      // Filter Sensors
      const foundSensors = MOCK_SENSORS.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase()),
      );

      setSearchResults({ fields: foundFields, sensors: foundSensors });
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  };

  // Clear search when a result is clicked
  const handleResultClick = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  // ... (Helper functions for Notifications remain the same)
  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const clearNotifications = () => {
    setNotifications([]);
    setIsNotifOpen(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <ThermometerSnowflake size={16} className="text-red-600" />;
      case "warning":
        return <AlertTriangle size={16} className="text-amber-600" />;
      default:
        return <Info size={16} className="text-blue-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "alert":
        return "bg-red-100";
      case "warning":
        return "bg-amber-100";
      default:
        return "bg-blue-100";
    }
  };

  if (isLoginPage) return null;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* --- SEARCH BAR (Now Functional) --- */}
      <div
        className="relative hidden md:block w-96 z-50"
        ref={searchContainerRef}
      >
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => searchQuery.length > 0 && setIsSearchOpen(true)}
          placeholder="Suche nach Feldern, Sensoren..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
        />

        {/* SEARCH RESULTS DROPDOWN */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden max-h-[400px] overflow-y-auto animate-in fade-in slide-in-from-top-2">
            {/* Empty State */}
            {searchResults.fields.length === 0 &&
            searchResults.sensors.length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-sm">
                Keine Ergebnisse gefunden.
              </div>
            ) : (
              <>
                {/* 1. Fields Section */}
                {searchResults.fields.length > 0 && (
                  <div className="py-2">
                    <div className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Felder
                    </div>
                    {searchResults.fields.map((field) => (
                      <Link
                        key={field.id}
                        href={`/fields/${field.id}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                          <MapPin size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-800 group-hover:text-green-700">
                            {field.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            ID: {field.id}
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-300" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Separator if both exist */}
                {searchResults.fields.length > 0 &&
                  searchResults.sensors.length > 0 && (
                    <div className="h-px bg-slate-100 mx-2" />
                  )}

                {/* 2. Sensors Section */}
                {searchResults.sensors.length > 0 && (
                  <div className="py-2">
                    <div className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Sensoren
                    </div>
                    {searchResults.sensors.map((sensor) => (
                      <Link
                        key={sensor.id}
                        href={`/fields/${sensor.fieldId}`} // Navigate to the parent field
                        onClick={handleResultClick}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <Activity size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-800 group-hover:text-blue-700">
                            {sensor.name}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                            <span
                              className={clsx(
                                "w-1.5 h-1.5 rounded-full",
                                sensor.status === "online"
                                  ? "bg-green-500"
                                  : "bg-red-500",
                              )}
                            />
                            {sensor.status.toUpperCase()}
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-300" />
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* RIGHT: User Actions */}
      <div className="flex items-center gap-4 ml-auto">
        {/* NOTIFICATIONS DROPDOWN */}
        <div className="relative" ref={notifDropdownRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={clsx(
              "p-2 rounded-full relative transition-colors focus:outline-none",
              isNotifOpen
                ? "bg-green-50 text-green-600"
                : "text-slate-500 hover:bg-slate-50",
            )}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200 z-50">
              {/* ... (Notification content same as before) ... */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Benachrichtigungen</h3>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs font-medium text-green-600 hover:text-green-700 flex items-center gap-1"
                    >
                      <Check size={14} /> Gelesen
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <p className="text-sm">Alles ruhig. Keine Meldungen.</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-50">
                    {notifications.map((note) => (
                      <li key={note.id}>
                        <Link
                          href={note.link}
                          onClick={() => setIsNotifOpen(false)}
                          className={clsx(
                            "block p-4 hover:bg-slate-50 transition-colors cursor-pointer",
                            !note.read && "bg-slate-50/80",
                          )}
                        >
                          <div className="flex gap-3 items-start">
                            <div
                              className={clsx(
                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                                getBgColor(note.type),
                              )}
                            >
                              {getIcon(note.type)}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex justify-between items-start">
                                <p
                                  className={clsx(
                                    "text-sm font-semibold",
                                    note.read
                                      ? "text-slate-600"
                                      : "text-slate-900",
                                  )}
                                >
                                  {note.title}
                                </p>
                                {!note.read && (
                                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0 mt-1.5"></span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed">
                                {note.message}
                              </p>
                              <p className="text-[10px] text-slate-400 font-medium">
                                {note.time}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-8 bg-slate-200 mx-1"></div>

        {/* User Profile / Login Link */}
        {isLoggedIn ? (
          <Link
            href="/login"
            className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-lg transition-colors group"
          >
            <div className="text-right hidden md:block">
              <div className="text-sm font-bold text-slate-800 group-hover:text-green-700 transition-colors">
                John Doe
              </div>
              <div className="text-xs text-slate-500">Farm Manager</div>
            </div>
            <div className="w-9 h-9 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold border border-green-200 group-hover:shadow-sm transition-all">
              JD
            </div>
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 py-2 px-4 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            <LogIn size={16} /> <span>Anmelden</span>
          </Link>
        )}
      </div>
    </header>
  );
}
