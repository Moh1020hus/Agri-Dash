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
import { Maximize2, Info } from "lucide-react";
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

  // --- DYNAMIC COLOR LOGIC ---
  let moistureColor = "text-blue-800";
  let cardBgColor = "bg-blue-100"; // Deeper Blue background
  let cardBorderColor = "border-blue-300";
  let iconColor = "text-blue-700";
  let dividerColor = "bg-blue-400/40";

  if (latestMoisture < 20) {
    // Critical (Dry)
    moistureColor = "text-red-800";
    cardBgColor = "bg-red-100";
    cardBorderColor = "border-red-300";
    iconColor = "text-red-700";
    dividerColor = "bg-red-400/40";
  } else if (latestMoisture < 40) {
    // Warning (Low)
    moistureColor = "text-amber-800";
    cardBgColor = "bg-amber-100";
    cardBorderColor = "border-amber-300";
    iconColor = "text-amber-700";
    dividerColor = "bg-amber-400/40";
  }

  // Growth number color
  const growthColor = "text-slate-900";

  return (
    <>
      {/* 1. COMPACT HERO CARD */}
      <div
        onClick={() => setModalOpen(true)}
        className={clsx(
          "rounded-xl shadow-sm border p-6 cursor-pointer hover:shadow-md transition-all group relative flex flex-col items-center justify-center text-center h-full",
          cardBgColor,
          cardBorderColor,
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
          <Maximize2 size={18} />
        </div>

        {/* HERO CONTENT: Metrics Side-by-Side */}
        <div className="flex items-center justify-center gap-8 w-full">
          {/* Metric 1: Growth */}
          <div className="flex flex-col items-center">
            <div
              className={clsx(
                "text-6xl font-black leading-none tracking-tight",
                growthColor,
              )}
            >
              {latestGrowth}
            </div>
            <div
              className={clsx(
                "text-lg font-bold uppercase mt-1 opacity-80",
                growthColor,
              )}
            >
              mm Zuwachs
            </div>
          </div>

          {/* Divider */}
          <div className={clsx("w-px h-16 rounded-full", dividerColor)}></div>

          {/* Metric 2: Moisture */}
          <div className="flex flex-col items-center">
            <div
              className={clsx(
                "text-6xl font-black leading-none tracking-tight",
                moistureColor,
              )}
            >
              {latestMoisture}
              <span className="text-3xl align-top font-bold opacity-70 ml-0.5">
                %
              </span>
            </div>
            <div
              className={clsx(
                "text-lg font-bold uppercase mt-1 opacity-90",
                moistureColor,
              )}
            >
              Feuchte
            </div>
          </div>
        </div>
      </div>

      {/* 2. DETAIL MODAL */}
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
