"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Layers,
  Map as MapIcon,
  Plus,
  Trash2,
  MousePointerClick,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { clsx } from "clsx";
import { Sensor, Field } from "@/types";

// --- Icons Setup (Unchanged) ---
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

function LocationSelector({
  isActive,
  onSelect,
}: {
  isActive: boolean;
  onSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (isActive) onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface FieldMapProps {
  fields: Field[];
  selectedFieldId: string;
  onSelectField: (id: string) => void;
  onRemoveField: (id: string) => void;
  sensors: Sensor[];

  // Selection Props
  isSelectingLocation: boolean;
  onStartSelection: (mode: "field" | "sensor") => void;
  onLocationSelected: (lat: number, lng: number) => void;
  onCancelSelection: () => void;
}

export default function FieldMap({
  fields,
  selectedFieldId,
  onSelectField,
  onRemoveField,
  sensors,
  isSelectingLocation,
  onStartSelection,
  onLocationSelected,
  onCancelSelection,
}: FieldMapProps) {
  let mapCenter: [number, number] = [51.3405, 12.38];
  let mapZoom = 13;

  // Determine active field name for display
  const activeFieldName = fields.find((f) => f.id === selectedFieldId)?.name;

  if (selectedFieldId !== "all") {
    const field = fields.find((f) => f.id === selectedFieldId);
    if (field) {
      mapCenter = field.center;
      mapZoom = 16;
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative flex flex-col h-full">
      {/* HEADER */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white z-10">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <MapIcon size={20} className="text-blue-600" />
            Flächenverwaltung
          </h2>
          <p className="text-slate-500 text-sm">
            {isSelectingLocation
              ? `Klicken Sie in ${selectedFieldId === "all" ? "die Karte" : activeFieldName}, um zu platzieren...`
              : selectedFieldId === "all"
                ? `${fields.length} aktive Flächen`
                : activeFieldName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSelectingLocation ? (
            <button
              onClick={onCancelSelection}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
            >
              Abbrechen
            </button>
          ) : (
            <>
              {/* ADD FIELD BUTTON (Always visible) */}
              <button
                onClick={() => onStartSelection("field")}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
              >
                <Plus size={16} />
                <span>Feld</span>
              </button>

              {/* ADD SENSOR BUTTON (Only visible when a Field is Selected) */}
              {selectedFieldId !== "all" && (
                <button
                  onClick={() => onStartSelection("sensor")}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm animate-in fade-in slide-in-from-right-4"
                >
                  <Cpu size={16} />
                  <span>Sensor</span>
                </button>
              )}
            </>
          )}

          {!isSelectingLocation && (
            <div className="relative min-w-[180px]">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Layers size={16} />
              </div>
              <select
                value={selectedFieldId}
                onChange={(e) => onSelectField(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
              >
                <option value="all">Alle anzeigen</option>
                <hr />
                {fields.map((field) => (
                  <option key={field.id} value={field.id}>
                    📍 {field.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* MAP AREA */}
      <div className="h-[400px] w-full relative z-0">
        {/* Banner for Sensor Mode */}
        {isSelectingLocation && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium animate-pulse pointer-events-none">
            <MousePointerClick size={18} />
            Position im Feld wählen
          </div>
        )}

        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={false}
          className={clsx(
            "h-full w-full",
            isSelectingLocation && "cursor-crosshair",
          )}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={mapCenter} zoom={mapZoom} />
          <LocationSelector
            isActive={isSelectingLocation}
            onSelect={onLocationSelected}
          />

          {/* Fields */}
          {fields.map((field) => (
            <Polygon
              key={field.id}
              positions={field.polygon}
              pathOptions={{
                color: field.color,
                fillOpacity: selectedFieldId === field.id ? 0.4 : 0.1,
                weight: selectedFieldId === field.id ? 3 : 1,
              }}
              eventHandlers={{
                click: () => !isSelectingLocation && onSelectField(field.id),
              }}
            >
              {!isSelectingLocation && (
                <Popup>
                  <div className="text-center p-1 min-w-[150px]">
                    <div className="font-bold text-slate-800 mb-2">
                      {field.name}
                    </div>

                    {/* Action: Select This Field (Zoom In) */}
                    {selectedFieldId !== field.id && (
                      <button
                        onClick={() => onSelectField(field.id)}
                        className="flex items-center justify-center gap-1 w-full px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded border border-blue-200 transition-colors mb-2"
                      >
                        <ArrowRight size={12} /> Zu diesem Feld
                      </button>
                    )}

                    {/* Action: Add Sensor (Only visible if selected) */}
                    {selectedFieldId === field.id && (
                      <button
                        onClick={() => onStartSelection("sensor")}
                        className="flex items-center justify-center gap-1 w-full px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors mb-2 shadow-sm"
                      >
                        <Cpu size={12} /> Sensor hinzufügen
                      </button>
                    )}

                    {/* Action: Delete Field */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          confirm(
                            `Möchten Sie "${field.name}" wirklich löschen?`,
                          )
                        )
                          onRemoveField(field.id);
                      }}
                      className="flex items-center justify-center gap-1 w-full px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded border border-red-200 transition-colors"
                    >
                      <Trash2 size={12} /> Fläche löschen
                    </button>
                  </div>
                </Popup>
              )}
            </Polygon>
          ))}

          {sensors.map((sensor) => (
            <Marker key={sensor.id} position={sensor.coordinates} icon={icon}>
              <Popup>
                <strong>{sensor.name}</strong>
                <br />
                {sensor.value} {sensor.unit}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
