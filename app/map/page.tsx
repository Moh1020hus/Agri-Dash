"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MOCK_FIELDS, MOCK_SENSORS } from "@/lib/dummy-data";
import { Field, Sensor } from "@/types";

// Dynamically import the Map component to avoid Server-Side Rendering (SSR) issues
const FieldMap = dynamic(() => import("@/components/maps/FieldMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] bg-slate-50 animate-pulse flex items-center justify-center text-slate-400">
      <span className="animate-bounce">Lade Karte...</span>
    </div>
  ),
});

export default function MapPage() {
  // 1. Manage State for the Map
  const [fields, setFields] = useState<Field[]>(MOCK_FIELDS);
  // FIX: Initialize sensors state with mock data
  const [sensors, setSensors] = useState<Sensor[]>(MOCK_SENSORS);
  const [selectedFieldId, setSelectedFieldId] = useState<string>("all");

  // Selection Mode State (for placing new items)
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [selectionMode, setSelectionMode] = useState<"field" | "sensor">(
    "field",
  );

  // 2. Handlers
  const handleSelectField = (id: string) => {
    setSelectedFieldId(id);
  };

  const handleRemoveField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId("all");
  };

  // --- Handlers for Adding New Items on Map ---

  const handleStartSelection = (mode: "field" | "sensor") => {
    setSelectionMode(mode);
    setIsSelectingLocation(true);
  };

  const handleLocationSelected = (lat: number, lng: number) => {
    if (selectionMode === "field") {
      // Create a simple square polygon around the click for demo
      const newField: Field = {
        id: `f-${Date.now()}`,
        name: `Neues Feld ${fields.length + 1}`,
        color: "#10b981", // Default green
        center: [lat, lng],
        polygon: [
          [lat + 0.001, lng - 0.001],
          [lat + 0.001, lng + 0.001],
          [lat - 0.001, lng + 0.001],
          [lat - 0.001, lng - 0.001],
        ],
      };
      setFields([...fields, newField]);
    } else {
      // Create a new Sensor
      const newSensor: Sensor = {
        id: `s-${Date.now()}`,
        name: `Neuer Sensor ${sensors.length + 1}`,
        type: "temperature",
        status: "online",
        value: 0,
        unit: "°C",
        batteryLevel: 100,
        signalStrength: 100,
        lastUpdate: new Date().toISOString(),
        coordinates: [lat, lng],
      };
      setSensors([...sensors, newSensor]);
    }
    setIsSelectingLocation(false);
  };

  return (
    <div className="flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm relative z-0 flex">
      <div className="flex-1 min-h-0">
        <FieldMap
          fields={fields}
          selectedFieldId={selectedFieldId}
          onSelectField={handleSelectField}
          onRemoveField={handleRemoveField}
          sensors={sensors}
          isSelectingLocation={isSelectingLocation}
          onStartSelection={handleStartSelection}
          onLocationSelected={handleLocationSelected}
          onCancelSelection={() => setIsSelectingLocation(false)}
        />
      </div>
    </div>
  );
}
