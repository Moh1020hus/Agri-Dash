"use client";

import { useState, useMemo } from "react";
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
import { ThermometerSnowflake, Sun, Maximize2, CloudRain } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

interface FrostMonitorProps {
  selectedFieldId?: string;
  currentTemp?: number | null; // NEW PROP: Current sensor reading
}

export default function FrostMonitor({
  selectedFieldId = "all",
  currentTemp,
}: FrostMonitorProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  // --- ADJUST FORECAST TO MATCH SENSOR DATA ---
  const weatherData = useMemo(() => {
    // 1. Get base data (copy of mock data)
    let baseData = MOCK_WEATHER.map((d) => ({ ...d }));

    // 2. If we have a real sensor reading, shift the entire forecast
    if (currentTemp !== undefined && currentTemp !== null) {
      const forecastCurrent = baseData[0].temp;
      const diff = currentTemp - forecastCurrent;

      // Apply the difference to all future data points
      baseData = baseData.map((d) => ({
        ...d,
        temp: parseFloat((d.temp + diff).toFixed(1)),
      }));
    } else {
      // Fallback simulation if no sensor exists for this field
      let tempOffset = 0;
      if (selectedFieldId === "f-002") tempOffset = -5; // Simulator: Make Field 2 colder
      if (selectedFieldId === "f-003") tempOffset = -1; // Simulator: Make Field 3 cooler

      baseData = baseData.map((d) => ({
        ...d,
        temp: parseFloat((d.temp + tempOffset).toFixed(1)),
      }));
    }

    return baseData;
  }, [selectedFieldId, currentTemp]);

  // Calculate min temp from the *adjusted* data
  const minTemp = Math.min(...weatherData.map((d) => d.temp));

  // Determine Risk Level based on adjusted min temp
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
            "bg-red-400 border-red-200 hover:border-red-200 text-white",
        )}
      >
        <div
          className={clsx(
            "absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity",
            riskLevel === "critical" ? "text-white/80" : "text-slate-400",
          )}
        >
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
                : "bg-white/20 text-white backdrop-blur-sm",
          )}
        >
          {riskLevel === "low" ? (
            <Sun size={40} />
          ) : riskLevel === "moderate" ? (
            <CloudRain size={40} />
          ) : (
            <ThermometerSnowflake size={40} />
          )}
        </div>

        {/* Hero Text */}
        <div
          className={clsx(
            "text-2xl font-bold mb-1",
            riskLevel === "critical" ? "text-white" : "text-slate-800",
          )}
        >
          {riskLevel === "low" && "Kein Frost"}
          {riskLevel === "moderate" && "Risiko Mäßig"}
          {riskLevel === "critical" && "Frost Warnung"}
        </div>

        {/* Helper Text */}
        <p
          className={clsx(
            "text-sm font-medium",
            riskLevel === "critical" ? "text-white/80" : "text-slate-500",
          )}
        >
          Min: {minTemp.toFixed(1)}°C
        </p>
      </div>

      {/* 2. DETAIL MODAL  */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={`Temperaturverlauf (${selectedFieldId === "all" ? "Alle Flächen" : "Ausgewählte Fläche"})`}
      >
        <div className="h-[400px] w-full md:w-[600px] mx-auto">
          <p className="text-sm text-slate-500 mb-4">
            Detaillierte 48h-Vorhersage basierend auf{" "}
            {currentTemp ? "aktuellen Sensordaten" : "regionalen Wetterdaten"}.
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={weatherData}
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
                stroke="#ff0000"
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
