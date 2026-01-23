"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Activity } from "lucide-react";
import { MOCK_FIELDS, MOCK_SENSORS } from "@/lib/dummy-data";
import { SensorCard } from "@/components/sensors/SensorCard";

export default function FieldDetailPage() {
  // 1. Get the ID from the URL (e.g., "f-001")
  const params = useParams();
  const id = params?.id as string;

  // 2. Find the Data
  const field = MOCK_FIELDS.find((f) => f.id === id);
  const sensors = MOCK_SENSORS.filter((s) => s.fieldId === id);

  if (!field) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800">
          Feld nicht gefunden
        </h1>
        <Link href="/" className="text-green-600 hover:underline mt-4 block">
          Zurück zum Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/"
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            {field.name}
            <span className="text-sm font-normal px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
              {field.id}
            </span>
          </h1>
          <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
            <MapPin size={14} />
            <span>{field.center.join(", ")}</span>
          </div>
        </div>
      </div>

      {/* Grid of Sensoren for this specific field */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensors.length > 0 ? (
          sensors.map((sensor) => (
            // FIX: Changed 'data' to 'sensor' to match your component definition
            <SensorCard key={sensor.id} sensor={sensor} />
          ))
        ) : (
          <div className="col-span-full p-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-slate-500">
            <Activity className="mx-auto mb-2 opacity-50" size={32} />
            Keine Sensoren für dieses Feld aktiv.
          </div>
        )}
      </div>
    </div>
  );
}