"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, X, Activity, Check } from "lucide-react";

import {
  MOCK_FIELDS,
  MOCK_SENSORS,
  BBCH_BY_FIELD,
  GROWTH_BY_FIELD,
} from "@/lib/dummy-data";
import { SensorCard } from "@/components/sensors/SensorCard";
import FrostMonitor from "@/components/weather/FrostMonitor";
import BBCHTracker from "@/components/phenology/BBCHTracker";
import GrowthChart from "@/components/phenology/GrowthChart";
import { Field } from "@/types";

// --- VIEW IMPORTS ---
import SettingsView from "@/components/settings/SettingsView";
import ReportsView from "@/components/reports/ReportsView";
import FieldManagementView from "@/components/fields/FieldManagementView";
import PlantAnalysisView from "@/components/analysis/PlantAnalysisView";

// --- SIMPLE MODAL COMPONENT ---
function SimpleModal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// --- FIELD LIST COMPONENT (Updated) ---
function FieldList({
  fields,
  selectedFieldId,
  onSelectField,
  onAddField,
}: {
  fields: Field[];
  selectedFieldId: string;
  onSelectField: (id: string) => void;
  onAddField: () => void;
}) {
  return (
    <div className="h-full bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 shrink-0">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5">
            Flächenverwaltung
          </p>
          <p className="text-sm font-medium text-slate-900">
            {fields.length} aktive Fläche{fields.length === 1 ? "" : "n"}
          </p>
        </div>
        <button
          onClick={onAddField}
          className="p-1.5 bg-white border border-slate-200 text-green-600 rounded-lg hover:bg-green-50 hover:border-green-200 transition-all shadow-sm"
          title="Neue Fläche hinzufügen"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0 scrollbar-thin scrollbar-thumb-slate-200">
        {/* "All Fields" Button */}
        <button
          onClick={() => onSelectField("all")}
          className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm border
            ${
              selectedFieldId === "all"
                ? "bg-slate-800 text-white border-slate-800 ring-2 ring-offset-2 ring-slate-200"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            }`}
        >
          <div className="flex items-center justify-between">
            <span>Alle Flächen</span>
            {selectedFieldId === "all" && <Activity size={18} />}
          </div>
        </button>

        {/* Individual Field Buttons */}
        {fields.map((field) => {
          const isSelected = selectedFieldId === field.id;
          return (
            <button
              key={field.id}
              onClick={() => onSelectField(field.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm border group
                ${
                  isSelected
                    ? "text-white ring-2 ring-offset-2 ring-slate-200 scale-[1.02]"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md"
                }`}
              style={{
                // Only apply background color if selected
                backgroundColor: isSelected ? field.color : undefined,
                borderColor: isSelected ? field.color : undefined,
              }}
            >
              <div className="flex items-center gap-3">
                {/* Dot: White if selected, Colored if unselected */}
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{
                    backgroundColor: isSelected ? "white" : field.color,
                  }}
                />
                <span className="truncate">{field.name}</span>
              </div>

              {/* Checkmark only when selected */}
              {isSelected && <Check size={18} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "dashboard";

  // Global State
  const [fields, setFields] = useState<Field[]>(MOCK_FIELDS);
  const [sensors, setSensors] = useState<any[]>(MOCK_SENSORS);
  const [selectedFieldId, setSelectedFieldId] = useState<string>("all");

  // Modal State
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [isAddSensorOpen, setIsAddSensorOpen] = useState(false);

  // Form State
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldColor, setNewFieldColor] = useState("#3b82f6");
  const [newSensorName, setNewSensorName] = useState("");
  const [newSensorType, setNewSensorType] = useState("temperature");

  // --- ACTIONS ---
  const handleRemoveField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId("all");
  };

  const handleUpdateField = (updatedField: Field) => {
    setFields(fields.map((f) => (f.id === updatedField.id ? updatedField : f)));
  };

  const handleCreateField = () => {
    if (!newFieldName.trim()) return;
    const newField: Field = {
      id: `f-${Date.now()}`,
      name: newFieldName,
      color: newFieldColor,
      center: [51.3, 12.3],
      polygon: [],
    };
    setFields([...fields, newField]);
    setNewFieldName("");
    setIsAddFieldOpen(false);
    setSelectedFieldId(newField.id);
  };

  const handleCreateSensor = () => {
    if (!newSensorName.trim()) return;
    const newSensor = {
      id: `s-${Date.now()}`,
      fieldId: selectedFieldId,
      name: newSensorName,
      type: newSensorType,
      status: "online",
      batteryLevel: 100,
      signalStrength: 100,
      lastUpdate: new Date().toISOString(),
      value: 0,
      unit:
        newSensorType === "temperature"
          ? "°C"
          : newSensorType === "soil_moisture"
            ? "%"
            : "",
      coordinates: [51.3, 12.3],
    };
    setSensors([...sensors, newSensor]);
    setNewSensorName("");
    setIsAddSensorOpen(false);
  };

  // Derived data
  const displayedSensors =
    selectedFieldId === "all"
      ? sensors
      : sensors.filter((s: any) => s.fieldId === selectedFieldId);

  const currentFieldId = selectedFieldId === "all" ? "f-001" : selectedFieldId;
  const currentField = fields.find((f) => f.id === currentFieldId);
  const bbchData = BBCH_BY_FIELD[currentFieldId] || BBCH_BY_FIELD["f-001"];
  const growthData =
    GROWTH_BY_FIELD[currentFieldId] || GROWTH_BY_FIELD["f-001"];

  // --- VIEW SWITCHING ---
  if (currentView === "settings")
    return (
      <div className="p-6 h-screen overflow-auto">
        <SettingsView />
      </div>
    );
  if (currentView === "reports")
    return (
      <div className="p-6 h-screen overflow-auto">
        <ReportsView />
      </div>
    );
  if (currentView === "fields")
    return (
      <div className="p-6 h-screen overflow-auto">
        <FieldManagementView
          fields={fields}
          sensors={sensors}
          onUpdateField={handleUpdateField}
          onRemoveField={handleRemoveField}
        />
      </div>
    );
  if (currentView === "plants")
    return <div className="p-6 h-screen overflow-auto"></div>;

  // ==========================================
  // DYNAMIC TABLET & DESKTOP LAYOUT
  // ==========================================
  return (
    <div className="min-h-screen lg:h-[calc(100vh-2rem)] p-4 flex flex-col gap-4 lg:overflow-hidden max-w-[1800px] mx-auto">
      {/* 1. TOP SECTION */}
      <div className="shrink-0 lg:flex-[40] lg:min-h-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Field List */}
        <div className="lg:col-span-2 h-[45vh] md:h-[40vh] lg:h-full">
          <FieldList
            fields={fields}
            selectedFieldId={selectedFieldId}
            onSelectField={setSelectedFieldId}
            onAddField={() => setIsAddFieldOpen(true)}
          />
        </div>

        {/* Frost Monitor */}
        <div className="lg:col-span-1 h-[30vh] md:h-[40vh] lg:h-full min-h-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="h-full w-full overflow-y-auto">
            <FrostMonitor />
          </div>
        </div>
      </div>

      {/* 2. MIDDLE SECTION: SENSORS */}
      <div className="shrink-0 lg:flex-[25] lg:min-h-0 flex flex-col">
        <div className="flex items-center justify-between mb-2 shrink-0">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="text-slate-400" size={16} />
            Sensoren
            {selectedFieldId !== "all" && (
              <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                für {currentField?.name}
              </span>
            )}
          </h3>
          {selectedFieldId !== "all" && (
            <button
              onClick={() => setIsAddSensorOpen(true)}
              className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium hover:bg-blue-100 transition-colors"
            >
              <Plus size={14} /> Neu
            </button>
          )}
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 lg:overflow-y-auto min-h-0 pr-1 scrollbar-thin scrollbar-thumb-slate-200">
          {displayedSensors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pb-1">
              {displayedSensors.map((sensor) => (
                <div key={sensor.id} className="h-full min-h-[140px]">
                  <SensorCard sensor={sensor} />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 lg:h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
              <p className="text-sm font-medium">Keine Sensoren gefunden.</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. BOTTOM SECTION: ANALYSIS */}
      <div className="shrink-0 lg:flex-[35] lg:min-h-0 grid grid-cols-1 md:grid-cols-2 gap-3 pb-1">
        <div className="h-[40vh] md:h-[35vh] lg:h-full min-h-0 overflow-hidden rounded-xl shadow-sm">
          <div className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
            <BBCHTracker data={bbchData} />
          </div>
        </div>

        <div className="h-[40vh] md:h-[35vh] lg:h-full min-h-0 overflow-hidden rounded-xl shadow-sm">
          <div className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
            <GrowthChart data={growthData} />
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      <SimpleModal
        isOpen={isAddFieldOpen}
        onClose={() => setIsAddFieldOpen(false)}
        title="Neue Fläche hinzufügen"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Flächenname
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="z.B. Obstgarten West"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Farbe
            </label>
            <div className="flex gap-2">
              {["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"].map(
                (color) => (
                  <button
                    key={color}
                    onClick={() => setNewFieldColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      newFieldColor === color
                        ? "border-slate-600 scale-110"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ),
              )}
            </div>
          </div>
          <button
            onClick={handleCreateField}
            disabled={!newFieldName.trim()}
            className="w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            Fläche speichern
          </button>
        </div>
      </SimpleModal>

      <SimpleModal
        isOpen={isAddSensorOpen}
        onClose={() => setIsAddSensorOpen(false)}
        title="Neuen Sensor hinzufügen"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Sensor Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="z.B. Bodensensor 1"
              value={newSensorName}
              onChange={(e) => setNewSensorName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Typ
            </label>
            <select
              value={newSensorType}
              onChange={(e) => setNewSensorType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              <option value="temperature">Temperatur (Luft)</option>
              <option value="soil_moisture">Bodenfeuchte</option>
              <option value="dendrometer">Dendrometer (Wachstum)</option>
              <option value="camera">Kamera</option>
            </select>
          </div>
          <button
            onClick={handleCreateSensor}
            disabled={!newSensorName.trim()}
            className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            Sensor hinzufügen
          </button>
        </div>
      </SimpleModal>
    </div>
  );
}
