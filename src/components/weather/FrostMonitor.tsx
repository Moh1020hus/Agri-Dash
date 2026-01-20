"use client";

import { useState } from "react";
import { MOCK_WEATHER } from "@/lib/dummy-data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { clsx } from "clsx";
import { ThermometerSnowflake, Sun, Maximize2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

export default function FrostMonitor() {
  const [isModalOpen, setModalOpen] = useState(false);
  const minTemp = Math.min(...MOCK_WEATHER.map((d) => d.temp));

  let riskLevel: "low" | "moderate" | "critical" = "low";
  if (minTemp < 0) riskLevel = "critical";
  else if (minTemp < 2) riskLevel = "moderate";

  return (
    <>
      {/* 1. COMPACT HERO CARD */}
      <div
        onClick={() => setModalOpen(true)}
        className={clsx(
          "rounded-xl shadow-sm border p-6 cursor-pointer hover:shadow-md transition-all group relative flex flex-col items-center justify-center text-center h-full min-h-[200px]",
          riskLevel === "low" &&
            "bg-white border-slate-200 hover:border-green-300",
          riskLevel === "moderate" &&
            "bg-amber-50 border-amber-200 hover:border-amber-400",
          riskLevel === "critical" &&
            "bg-red-50 border-red-200 hover:border-red-400",
        )}
      >
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
          <Maximize2 size={18} />
        </div>

        {/* Big Icon */}
        <div
          className={clsx(
            "mb-3 p-4 rounded-full inline-flex",
            riskLevel === "low"
              ? "bg-green-100 text-green-600"
              : riskLevel === "moderate"
                ? "bg-amber-100 text-amber-600"
                : "bg-red-100 text-red-600",
          )}
        >
          {riskLevel === "low" ? (
            <Sun size={40} />
          ) : (
            <ThermometerSnowflake size={40} />
          )}
        </div>

        {/* Hero Text */}
        <div
          className={clsx(
            "text-2xl font-bold mb-1",
            riskLevel === "critical" ? "text-red-800" : "text-slate-800",
          )}
        >
          {riskLevel === "low" && "Kein Frost"}
          {riskLevel === "moderate" && "Risiko Mäßig"}
          {riskLevel === "critical" && "Frost Warnung"}
        </div>

        <div className="text-sm font-medium opacity-70">
          Tiefstwert: {minTemp}°C (48h)
        </div>
      </div>

      {/* 2. DETAIL MODAL (Kept same) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Temperaturverlauf (48h Prognose)"
      >
        <div className="h-[400px] w-full md:w-[600px] mx-auto">
          <p className="text-sm text-slate-500 mb-4">
            Detaillierte Vorhersage für das Versuchsfeld Nord.
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={MOCK_WEATHER}
              margin={{ top: 10, right: 10, left: -20, bottom: 30 }}
            >
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(str) =>
                  new Date(str).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }
                stroke="#94a3b8"
                fontSize={12}
                tickMargin={10}
              />
              <YAxis stroke="#94a3b8" fontSize={12} unit="°C" />
              <Tooltip
                labelFormatter={(label) =>
                  new Date(label).toLocaleString([], {
                    weekday: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }
              />
              <ReferenceLine
                y={0}
                stroke="#ec0404"
                strokeDasharray="3 3"
                label={{ value: "0°C", fill: "#f70000", fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTemp)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Modal>
    </>
  );
}
