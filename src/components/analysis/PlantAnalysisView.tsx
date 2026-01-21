"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  Legend,
} from "recharts";
import {
  Sprout,
  Droplets,
  Thermometer,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { MOCK_GROWTH_HISTORY, MOCK_WEATHER } from "@/lib/dummy-data";

export default function PlantAnalysisView() {
  const [timeRange, setTimeRange] = useState("30d");

  // Mock Forecast Date for next stage
  const nextStageDate = new Date();
  nextStageDate.setDate(nextStageDate.getDate() + 14);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Pflanzenanalyse</h2>
        <p className="text-slate-500">
          Detaillierte Auswertung von Wachstum, Gesundheit und Umweltfaktoren.
        </p>
      </div>

      {/* KPI CARDS - Insight Focus */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Cumulative Growth */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <Sprout size={20} />
            </div>
            <h3 className="font-semibold text-slate-700">
              Gesamtwachstum (Saison)
            </h3>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            12.4 <span className="text-lg text-slate-400 font-medium">mm</span>
          </div>
          <p className="text-xs text-green-600 font-medium mt-1">
            +2.1 mm im Vergleich zum Vorjahr
          </p>
        </div>

        {/* Card 2: Stress Days */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <AlertTriangle size={20} />
            </div>
            <h3 className="font-semibold text-slate-700">
              Stress-Tage (Trockenheit)
            </h3>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            3 <span className="text-lg text-slate-400 font-medium">Tage</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Letzter Stress-Tag: Vor 2 Tagen
          </p>
        </div>

        {/* Card 3: Forecast */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Calendar size={20} />
            </div>
            <h3 className="font-semibold text-slate-700">
              Prognose: Nächstes Stadium
            </h3>
          </div>
          <div className="text-3xl font-bold text-slate-900">14. Mai</div>
          <p className="text-xs text-slate-500 mt-1">
            BBCH 67 (Abblüte) erwartet
          </p>
        </div>
      </div>

      {/* CHART 1: Correlation Analysis (Growth vs Moisture) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Wachstumskorrelation
            </h3>
            <p className="text-sm text-slate-500">
              Vergleich von Stammzuwachs (Linie) und Bodenfeuchte (Balken)
            </p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-sm rounded-lg p-2 outline-none"
          >
            <option value="7d">7 Tage</option>
            <option value="30d">30 Tage</option>
            <option value="season">Ganze Saison</option>
          </select>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={MOCK_GROWTH_HISTORY}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
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
                orientation="left"
                label={{
                  value: "Zuwachs (mm)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#0f172a",
                  fontSize: 12,
                }}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                unit="%"
                domain={[0, 60]}
                tick={{ fontSize: 12, fill: "#3b82f6" }}
              />
              <Tooltip
                labelFormatter={(d) => new Date(d).toLocaleDateString()}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend />
              <Bar
                yAxisId="right"
                dataKey="moisture"
                name="Bodenfeuchte (%)"
                fill="#bfdbfe"
                barSize={20}
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="growth"
                name="Stammzuwachs (mm)"
                stroke="#0f172a"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART 2: Temperature Impact */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800">
            Temperaturverlauf
          </h3>
          <p className="text-sm text-slate-500">
            Min/Max Temperaturen der letzten Periode
          </p>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_WEATHER.slice(0, 14)}>
              {" "}
              {/* Using weather mock for demo */}
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(d) =>
                  new Date(d).toLocaleTimeString([], { hour: "2-digit" })
                }
                tick={{ fontSize: 12 }}
              />
              <YAxis unit="°C" tick={{ fontSize: 12 }} />
              <Tooltip labelFormatter={(d) => new Date(d).toLocaleString()} />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTemp)"
                name="Temperatur"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
