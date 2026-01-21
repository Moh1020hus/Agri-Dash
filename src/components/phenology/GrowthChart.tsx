"use client";

import { useState } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Maximize2, Info } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { clsx } from "clsx";

interface GrowthChartProps {
  data: any[];
}

export default function GrowthChart({ data }: GrowthChartProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  const latestData = data[data.length - 1];
  const latestGrowth = latestData.growth.toFixed(2);
  const latestMoisture = Math.round(latestData.moisture);

  // --- DYNAMIC COLOR LOGIC (DEEPER COLORS) ---
  let moistureColor = "text-blue-700";
  let cardBgColor = "bg-blue-100"; // Deeper Blue
  let cardBorderColor = "border-blue-300";
  let iconColor = "text-blue-600";
  let dividerColor = "bg-blue-300/50"; // Semi-transparent divider

  if (latestMoisture < 20) {
    // Critical (Dry)
    moistureColor = "text-red-700";
    cardBgColor = "bg-red-100"; // Deeper Red
    cardBorderColor = "border-red-300";
    iconColor = "text-red-600";
    dividerColor = "bg-red-300/50";
  } else if (latestMoisture < 40) {
    // Warning (Low)
    moistureColor = "text-amber-700";
    cardBgColor = "bg-amber-100"; // Deeper Amber
    cardBorderColor = "border-amber-300";
    iconColor = "text-amber-600";
    dividerColor = "bg-amber-300/50";
  }

  // Growth number is always dark/slate to differentiate from moisture
  const growthColor = "text-slate-800";

  return (
    <>
      {/* 1. COMPACT HERO CARD */}
      <div
        onClick={() => setModalOpen(true)}
        className={clsx(
          "rounded-xl shadow-sm border p-4 cursor-pointer hover:shadow-md transition-all group relative flex flex-col items-center justify-center text-center h-full",
          cardBgColor,
          cardBorderColor,
          // Stronger hover border
          latestMoisture < 20
            ? "hover:border-red-500"
            : latestMoisture < 40
              ? "hover:border-amber-500"
              : "hover:border-blue-500",
        )}
      >
        <div
          className={clsx(
            "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity",
            iconColor,
          )}
        >
          <Maximize2 size={16} />
        </div>

        {/* Small Header */}
        <div
          className={clsx(
            "text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5",
            iconColor,
          )}
        >
          <TrendingUp size={16} /> Wachstum & Feuchte
        </div>

        {/* HERO CONTENT: Metrics Side-by-Side */}
        <div className="flex items-center justify-center gap-6 w-full flex-grow">
          {/* Metric 1: Growth */}
          <div className="flex flex-col items-center">
            {/* CHANGED: Increased to text-5xl */}
            <div
              className={clsx(
                "text-5xl font-black leading-none tracking-tight",
                growthColor,
              )}
            >
              {latestGrowth}
            </div>
            <div
              className={clsx(
                "text-[10px] font-bold uppercase mt-1 opacity-70",
                growthColor,
              )}
            >
              mm Zuwachs
            </div>
          </div>

          {/* Divider */}
          <div className={clsx("w-px h-12 rounded-full", dividerColor)}></div>

          {/* Metric 2: Moisture (Dynamic Color) */}
          <div className="flex flex-col items-center">
            {/* CHANGED: Increased to text-5xl */}
            <div
              className={clsx(
                "text-5xl font-black leading-none tracking-tight",
                moistureColor,
              )}
            >
              {latestMoisture}
              <span className="text-2xl align-top font-bold opacity-60 ml-0.5">
                %
              </span>
            </div>
            <div
              className={clsx(
                "text-[10px] font-bold uppercase mt-1 opacity-80",
                moistureColor,
              )}
            >
              Feuchte
            </div>
          </div>
        </div>
      </div>

      {/* 2. DETAIL MODAL (Unchanged) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Analyse: Wachstum vs. Bodenfeuchte"
      >
        <div className="space-y-6 h-[400px] md:h-[500px] w-full md:w-[700px] mx-auto">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-sm text-blue-900">
            <Info className="shrink-0 text-blue-500" size={20} />
            <p>
              Diese Grafik zeigt die Korrelation zwischen der Bodenfeuchte
              (Balken) und dem Dickenwachstum des Stammes (Linie).
            </p>
          </div>
          <div className="flex-grow h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
              >
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) =>
                    new Date(d).toLocaleDateString(undefined, {
                      day: "2-digit",
                      month: "2-digit",
                    })
                  }
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis
                  yAxisId="left"
                  unit=" mm"
                  orientation="left"
                  tick={{ fontSize: 12, fill: "#0f172a" }}
                  label={{
                    value: "Zuwachs (mm)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#0f172a",
                    fontSize: 12,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  unit="%"
                  orientation="right"
                  domain={[0, 50]}
                  tick={{ fontSize: 12, fill: "#3b82f6" }}
                  label={{
                    value: "Bodenfeuchte (%)",
                    angle: 90,
                    position: "insideRight",
                    fill: "#3b82f6",
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  labelFormatter={(d) => new Date(d).toLocaleDateString()}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  yAxisId="right"
                  dataKey="moisture"
                  name="Bodenfeuchte"
                  fill="#bfdbfe"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="growth"
                  name="Stammzuwachs"
                  stroke="#0f172a"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#0f172a" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Modal>
    </>
  );
}
