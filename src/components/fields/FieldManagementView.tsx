"use client";

import { useState } from "react";
import {
  Map as MapIcon,
  Edit2,
  Trash2,
  Save,
  Ruler,
  Cpu,
  Sprout,
} from "lucide-react";
import { Field, Sensor } from "@/types";
import { clsx } from "clsx";

interface FieldManagementViewProps {
  fields: Field[];
  sensors: Sensor[];
  onUpdateField: (updatedField: Field) => void;
  onRemoveField: (id: string) => void;
}

export default function FieldManagementView({
  fields,
  sensors,
  onUpdateField,
  onRemoveField,
}: FieldManagementViewProps) {
  // State to track which field is currently being edited
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Field>>({});

  const startEditing = (field: Field) => {
    setEditingId(field.id);
    setEditForm(field);
  };

  const saveEditing = () => {
    if (editingId && editForm) {
      // Find original to keep polygon/center data intact
      const original = fields.find((f) => f.id === editingId);
      if (original) {
        onUpdateField({ ...original, ...editForm } as Field);
      }
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Feldverwaltung</h2>
        <p className="text-slate-500">
          Verwalten Sie Ihre Flächen, Fruchtfolgen und Zonierungen.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {fields.map((field) => {
          const fieldSensors = sensors.filter(
            (s: any) => s.fieldId === field.id,
          );
          const isEditing = editingId === field.id;

          return (
            <div
              key={field.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row"
            >
              {/* LEFT: Visual Identifier (Color Strip) */}
              <div
                className="w-full md:w-2 h-2 md:h-auto"
                style={{ backgroundColor: field.color }}
              ></div>

              {/* MAIN CONTENT */}
              <div className="p-6 flex-1 flex flex-col md:flex-row gap-6">
                {/* Field Details Form */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                      <MapIcon size={20} />
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="font-bold text-lg text-slate-900 border-b-2 border-blue-500 outline-none bg-transparent"
                      />
                    ) : (
                      <h3 className="font-bold text-lg text-slate-900">
                        {field.name}
                      </h3>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {/* Size (Mocked calculation) */}
                    <div className="flex items-center gap-2 text-slate-600">
                      <Ruler size={16} className="text-slate-400" />
                      <span>
                        Größe: <strong>2.4 ha</strong> (ca.)
                      </span>
                    </div>

                    {/* Coordinates */}
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">
                        {field.center[0].toFixed(4)},{" "}
                        {field.center[1].toFixed(4)}
                      </span>
                    </div>
                  </div>

                  {/* Crop Type (Mock functionality) */}
                  <div className="flex items-center gap-2 mt-4">
                    <Sprout size={16} className="text-green-600" />
                    <span className="text-sm text-slate-500">
                      Aktuelle Kultur:
                    </span>
                    {isEditing ? (
                      <select className="text-sm border rounded p-1">
                        <option>Winterweizen</option>
                        <option>Mais</option>
                        <option>Raps</option>
                        <option>Apfelplantage</option>
                      </select>
                    ) : (
                      <span className="text-sm font-medium text-slate-900 bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                        Winterweizen
                      </span>
                    )}
                  </div>
                </div>

                {/* SENSOR LIST for this field */}
                <div className="w-full md:w-64 bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-700">
                    <Cpu size={16} /> Installierte Sensoren (
                    {fieldSensors.length})
                  </div>
                  {fieldSensors.length > 0 ? (
                    <ul className="space-y-2">
                      {fieldSensors.map((sensor) => (
                        <li
                          key={sensor.id}
                          className="text-xs bg-white p-2 rounded border border-slate-200 flex items-center justify-between"
                        >
                          <span className="truncate max-w-[120px]">
                            {sensor.name}
                          </span>
                          <span
                            className={clsx(
                              "w-2 h-2 rounded-full",
                              sensor.status === "online"
                                ? "bg-green-500"
                                : "bg-red-500",
                            )}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      Keine Sensoren zugewiesen.
                    </p>
                  )}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="p-4 border-t md:border-t-0 md:border-l border-slate-100 bg-slate-50 flex md:flex-col justify-end gap-2">
                {isEditing ? (
                  <button
                    onClick={saveEditing}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save size={18} />{" "}
                    <span className="md:hidden">Speichern</span>
                  </button>
                ) : (
                  <button
                    onClick={() => startEditing(field)}
                    className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 size={18} />{" "}
                    <span className="md:hidden">Bearbeiten</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    if (confirm("Feld wirklich löschen?"))
                      onRemoveField(field.id);
                  }}
                  className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />{" "}
                  <span className="md:hidden">Löschen</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
