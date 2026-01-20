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
  data: any[]; // <--- NEW PROP (Array of history data)
}

export default function GrowthChart({ data }: GrowthChartProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  // Use passed 'data' prop
  const latestData = data[data.length - 1];
  const latestGrowth = latestData.growth.toFixed(2);
  const latestMoisture = Math.round(latestData.moisture);

  // Dynamic Colors
  const moistureColor =
    latestMoisture < 20
      ? "text-red-600"
      : latestMoisture < 40
        ? "text-amber-500"
        : "text-blue-600";
  const growthColor = "text-slate-900";

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group relative flex flex-col items-center justify-center text-center h-full"
      >
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
          <Maximize2 size={14} />
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
          <TrendingUp size={12} /> Wachstum & Feuchte
        </div>
        <div className="flex items-center justify-center gap-4 w-full">
          <div className="flex flex-col items-center">
            <div
              className={clsx("text-3xl font-black leading-none", growthColor)}
            >
              {latestGrowth}
            </div>
            <div className="text-[9px] font-bold text-slate-400 uppercase mt-1">
              mm Zuwachs
            </div>
          </div>
          <div className="w-px h-6 bg-slate-200"></div>
          <div className="flex flex-col items-center">
            <div
              className={clsx(
                "text-3xl font-black leading-none",
                moistureColor,
              )}
            >
              {latestMoisture}
              <span
                className={clsx(
                  "text-sm align-top font-bold opacity-60 ml-0.5",
                  moistureColor,
                )}
              >
                %
              </span>
            </div>
            <div
              className={clsx(
                "text-[9px] font-bold uppercase mt-1",
                moistureColor,
                "opacity-80",
              )}
            >
              Feuchte
            </div>
          </div>
        </div>
      </div>

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
              {/* Use 'data' prop here too */}
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
                />
                <YAxis yAxisId="left" unit=" mm" orientation="left" />
                <YAxis
                  yAxisId="right"
                  unit="%"
                  orientation="right"
                  domain={[0, 50]}
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
