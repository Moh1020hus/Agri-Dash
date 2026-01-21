"use client";

import { useState } from "react";
import { Download, FileText, Calendar, Filter, Search } from "lucide-react";
import { MOCK_SENSORS } from "@/lib/dummy-data";
import { clsx } from "clsx";

export default function ReportsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  // --- FIX 1: Safe Mock Data Generation ---
  const historyData = MOCK_SENSORS.flatMap((sensor) => {
    return Array.from({ length: 5 }).map((_, i) => {
      // Check if value is a number before doing math
      let simulatedValue = sensor.value;
      if (typeof sensor.value === "number") {
        simulatedValue = sensor.value + (Math.random() * 2 - 1);
      }

      return {
        id: `${sensor.id}-${i}`,
        date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
        time: "12:00",
        fieldId: sensor.fieldId,
        sensorName: sensor.name,
        type: sensor.type,
        value: simulatedValue, // Use the safe value
        unit: sensor.unit,
        status: sensor.status,
      };
    });
  });

  // Filter Logic
  const filteredData = historyData.filter((item) => {
    const matchesSearch = item.sensorName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Berichte & Daten
          </h2>
          <p className="text-slate-500">
            Exportieren und analysieren Sie historische Sensordaten.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium text-sm">
            <FileText size={16} /> PDF Bericht
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm">
            <Download size={16} /> CSV Export
          </button>
        </div>
      </div>

      {/* FILTERS TOOLBAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Suche nach Sensor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-slate-400" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 outline-none"
          >
            <option value="all">Alle Typen</option>
            <option value="dendrometer">Dendrometer</option>
            <option value="soil_moisture">Bodenfeuchte</option>
            <option value="temperature">Temperatur</option>
            <option value="camera">Kamera</option>
          </select>
        </div>

        {/* Date Filter (Mock) */}
        <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-sm hover:bg-slate-100 w-full md:w-auto justify-center">
          <Calendar size={16} />
          <span>Letzte 7 Tage</span>
        </button>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Datum</th>
                <th className="px-6 py-3">Sensor Name</th>
                <th className="px-6 py-3">Typ</th>
                <th className="px-6 py-3">Messwert</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <tr
                    key={row.id}
                    className="bg-white border-b border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {row.date}{" "}
                      <span className="text-slate-400 ml-1 text-xs">
                        {row.time}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{row.sensorName}</td>
                    <td className="px-6 py-4 capitalize">
                      {row.type.replace("_", " ")}
                    </td>

                    {/* --- FIX 2: Safe Display Logic --- */}
                    <td className="px-6 py-4 font-mono text-slate-700">
                      {typeof row.value === "number"
                        ? row.value.toFixed(2)
                        : row.value}
                      <span className="text-xs text-slate-400 ml-1">
                        {row.unit}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={clsx(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          row.status === "online"
                            ? "bg-green-100 text-green-700"
                            : row.status === "warning"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700",
                        )}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    Keine Daten für die gewählten Filter gefunden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Zeige{" "}
            <span className="font-semibold text-slate-900">
              1-{Math.min(10, filteredData.length)}
            </span>{" "}
            von{" "}
            <span className="font-semibold text-slate-900">
              {filteredData.length}
            </span>{" "}
            Einträgen
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-xs font-medium text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
              disabled
            >
              Zurück
            </button>
            <button className="px-3 py-1 text-xs font-medium text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50">
              Weiter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
