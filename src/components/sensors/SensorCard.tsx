"use client";

import { useState } from "react";
import { Sensor } from "@/types"; // Ensure this matches your type location
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import {
  Battery,
  Signal,
  Clock,
  MapPin,
  Activity,
  Maximize2,
  Cpu,
} from "lucide-react";
import { clsx } from "clsx";

interface SensorCardProps {
  sensor: Sensor;
}

export function SensorCard({ sensor }: SensorCardProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  // Format date for the detail view (German format)
  const formattedDate = new Date(sensor.lastUpdate).toLocaleString("de-DE", {
    dateStyle: "medium",
    timeStyle: "medium",
  });

  return (
    <>
      {/* 1. COMPACT CARD (Dashboard View) */}
      <div
        onClick={() => setModalOpen(true)}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group relative flex flex-col justify-between h-full"
      >
        {/* Hover Hint Icon */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
          <Maximize2 size={18} />
        </div>

        {/* Header: Name & Type */}
        <div className="mb-4 pr-8">
          <h3 className="font-semibold text-slate-800 text-lg leading-tight">
            {sensor.name}
          </h3>
          <p className="text-slate-500 text-xs uppercase tracking-wider font-medium mt-1">
            {sensor.type.replace("_", " ")}
          </p>
        </div>

        {/* Main Content: Value & Status */}
        <div className="flex items-end justify-between">
          {/* Big Value */}
          <div className="flex items-baseline gap-1">
            <span
              className={clsx(
                "text-4xl font-bold tracking-tight",
                sensor.status === "offline"
                  ? "text-slate-300"
                  : "text-slate-900",
              )}
            >
              {sensor.value}
            </span>
            <span className="text-slate-500 font-medium">{sensor.unit}</span>
          </div>

          {/* Status Badge */}
          <StatusBadge status={sensor.status} />
        </div>
      </div>

      {/* 2. DETAIL MODAL (Pop-up View) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={`Sensor-Details: ${sensor.name}`}
      >
        <div className="space-y-6">
          {/* Status Context Box */}
          <div
            className={clsx(
              "p-4 rounded-lg border flex items-start gap-4",
              sensor.status === "online" && "bg-green-50 border-green-200",
              sensor.status === "warning" && "bg-amber-50 border-amber-200",
              sensor.status === "offline" && "bg-red-50 border-red-200",
            )}
          >
            <Activity
              size={24}
              className={clsx(
                "mt-0.5",
                sensor.status === "online"
                  ? "text-green-600"
                  : sensor.status === "warning"
                    ? "text-amber-600"
                    : "text-red-600",
              )}
            />
            <div>
              <div className="font-semibold text-slate-900">
                Systemstatus: {sensor.status.toUpperCase()}
              </div>
              <p className="text-sm text-slate-600 mt-1">
                {sensor.status === "online" &&
                  "Das Gerät arbeitet normal und sendet regelmäßig Daten."}
                {sensor.status === "warning" &&
                  "Achtung: Sensorwerte weichen vom Durchschnitt ab oder Batterie ist schwach."}
                {sensor.status === "offline" &&
                  "Fehler: Keine Verbindung zum Sensor seit mehr als 24 Stunden."}
              </p>
            </div>
          </div>

          {/* Technical Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Battery Health */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                <Battery size={18} /> Batteriestatus
              </div>
              <div className="font-bold text-2xl text-slate-900">
                {sensor.batteryLevel}%
              </div>
              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-200 rounded-full mt-3 overflow-hidden">
                <div
                  className={clsx(
                    "h-full rounded-full transition-all",
                    sensor.batteryLevel > 20 ? "bg-green-500" : "bg-red-500",
                  )}
                  style={{ width: `${sensor.batteryLevel}%` }}
                />
              </div>
            </div>

            {/* Signal Strength */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                <Signal size={18} /> Signalstärke
              </div>
              <div className="font-bold text-2xl text-slate-900">
                {sensor.signalStrength}%
              </div>
              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-200 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${sensor.signalStrength}%` }}
                />
              </div>
            </div>
          </div>

          {/* Metadata List */}
          <div className="space-y-3 pt-4 border-t border-slate-100 text-sm">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 flex items-center gap-2">
                <Clock size={16} /> Letztes Update
              </span>
              <span className="font-medium text-slate-900 bg-slate-100 px-2 py-1 rounded">
                {formattedDate}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 flex items-center gap-2">
                <MapPin size={16} /> Koordinaten
              </span>
              <span className="font-medium text-slate-900 font-mono text-xs">
                {sensor.coordinates.join(", ")}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 flex items-center gap-2">
                <Cpu size={16} /> Sensor-ID
              </span>
              <span className="font-mono text-slate-400">{sensor.id}</span>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
