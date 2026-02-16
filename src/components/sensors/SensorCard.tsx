"use client";

import { useState } from "react";
import { Sensor } from "@/types";
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
  Thermometer,
  Droplets,
  Camera,
  Sprout,
  Map, // Added Map icon
} from "lucide-react";
import clsx from "clsx";

interface SensorCardProps {
  sensor: Sensor;
  fieldName?: string; // NEW PROP: Name of the field
}

export function SensorCard({ sensor, fieldName }: SensorCardProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  const formattedDate = new Date(sensor.lastUpdate).toLocaleString("de-DE", {
    dateStyle: "medium",
    timeStyle: "medium",
  });

  const isCameraSensor = sensor.type === "camera";

  const getTypeIcon = () => {
    switch (sensor.type) {
      case "temperature":
        return <Thermometer size={20} className="text-amber-500" />;
      case "soil_moisture":
        return <Droplets size={20} className="text-blue-500" />;
      case "dendrometer":
        return <Sprout size={20} className="text-green-500" />;
      case "camera":
        return <Camera size={20} className="text-slate-500" />;
      default:
        return <Activity size={20} className="text-slate-400" />;
    }
  };

  return (
    <>
      {/* 1. COMPACT CARD */}
      <div
        onClick={() => setModalOpen(true)}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group relative flex flex-col justify-between h-full"
      >
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
          <Maximize2 size={18} />
        </div>

        {/* Header */}
        <div className="mb-4 pr-8">
          {/* NEW: Field Name Badge (Visible if fieldName is provided) */}
          {fieldName && (
            <div className="mb-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wide border border-slate-200 truncate max-w-full">
              <Map size={10} />
              <span className="truncate">{fieldName}</span>
            </div>
          )}

          <h3 className="font-semibold text-slate-800 text-lg leading-tight">
            {sensor.name}
          </h3>

          <div className="mt-2 flex items-center" title={sensor.type}>
            <div className="p-1.5 bg-slate-50 rounded-md border border-slate-100 inline-flex">
              {getTypeIcon()}
            </div>
          </div>
        </div>

        {/* Value & Status */}
        <div className="flex items-end justify-between">
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
          <StatusBadge status={sensor.status} />
        </div>
      </div>

      {/* 2. MODAL (unchanged logic, just passed fieldName if needed) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={`Sensor-Details: ${sensor.name}`}
      >
        <div className="space-y-6">
          {/* ... existing modal content ... */}
          {isCameraSensor && (
            <>
              {sensor.photoUrl ? (
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img
                    src={sensor.photoUrl}
                    alt={`Uploaded photo for ${sensor.name}`}
                    className="w-full h-56 object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                  No photo uploaded.
                </div>
              )}
            </>
          )}

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
                {/* ... existing status text ... */}
                {sensor.status === "offline"
                  ? "Fehler: Keine Verbindung zum Sensor."
                  : "Sensor ist aktiv."}
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-3 pt-4 border-t border-slate-100 text-sm">
            {fieldName && (
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 flex items-center gap-2">
                  <Map size={16} /> Zugehörige Fläche
                </span>
                <span className="font-medium text-slate-900">{fieldName}</span>
              </div>
            )}
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
