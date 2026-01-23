"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FrostMonitor from "@/components/weather/FrostMonitor";
import { MOCK_WEATHER } from "@/lib/dummy-data";

export default function WeatherPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">
          Wetter & Frostschutz
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reuse your existing Frost Component */}
        <div className="h-64">
          <FrostMonitor />
        </div>

        {/* Simple List of Upcoming Weather */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4">
            24-Stunden Vorhersage
          </h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {MOCK_WEATHER.slice(0, 12).map((w, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg border border-slate-100"
              >
                <div className="text-sm font-medium text-slate-600">
                  {new Date(w.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${w.isFrostRisk ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                  >
                    {w.temp}°C
                  </span>
                  <span className="text-slate-400 text-sm w-16 text-right">
                    {w.humidity}% Feuchte
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
