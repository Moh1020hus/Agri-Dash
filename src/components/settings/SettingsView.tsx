"use client";

import { useState } from "react";
import {
  Bell,
  User,
  Shield,
  Moon,
  Thermometer,
  Droplets,
  Save,
} from "lucide-react";
import { clsx } from "clsx";

export default function SettingsView() {
  // Mock State for Settings
  const [frostThreshold, setFrostThreshold] = useState(2.0);
  const [moistureThreshold, setMoistureThreshold] = useState(20);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [mapType, setMapType] = useState("standard");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Einstellungen</h2>
        <p className="text-slate-500">
          Verwalten Sie Ihre Warnmeldungen und Kontopräferenzen.
        </p>
      </div>

      {/* SECTION 1: CRITICAL ALERTS (The most important part for AgriDash) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
          <Bell className="text-blue-600" size={20} />
          <h3 className="font-semibold text-slate-800">
            Warnungen & Grenzwerte
          </h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Frost Threshold */}
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Thermometer size={20} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900">
                  Frostwarnung (Temperatur)
                </label>
                <p className="text-xs text-slate-500">
                  Ab welcher Temperatur soll gewarnt werden?
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                value={frostThreshold}
                onChange={(e) => setFrostThreshold(parseFloat(e.target.value))}
                className="w-20 p-2 border border-slate-200 rounded-lg text-right font-mono text-sm"
              />
              <span className="text-sm text-slate-500">°C</span>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100"></div>

          {/* Moisture Threshold */}
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Droplets size={20} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900">
                  Kritische Bodenfeuchte
                </label>
                <p className="text-xs text-slate-500">
                  Warnung bei Unterschreitung von:
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={moistureThreshold}
                onChange={(e) => setMoistureThreshold(parseInt(e.target.value))}
                className="w-20 p-2 border border-slate-200 rounded-lg text-right font-mono text-sm"
              />
              <span className="text-sm text-slate-500">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: NOTIFICATION CHANNELS */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
          <Shield className="text-green-600" size={20} />
          <h3 className="font-semibold text-slate-800">
            Benachrichtigungskanäle
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <ToggleRow
            label="E-Mail Benachrichtigungen"
            desc="Senden Sie tägliche Berichte und kritische Warnungen per E-Mail."
            checked={emailNotifications}
            onChange={setEmailNotifications}
          />

          <div className="w-full h-px bg-slate-100"></div>

          <ToggleRow
            label="Push-Benachrichtigungen"
            desc="Echtzeit-Warnungen direkt auf das Smartphone."
            checked={pushNotifications}
            onChange={setPushNotifications}
          />
        </div>
      </div>

      {/* SECTION 3: APP PREFERENCES */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
          <User className="text-slate-600" size={20} />
          <h3 className="font-semibold text-slate-800">Darstellung & Konto</h3>
        </div>
        <div className="p-6 space-y-6">
          {/* Map Type */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Kartenansicht Standard
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setMapType("standard")}
                className={clsx(
                  "p-3 rounded-lg border text-sm font-medium transition-all",
                  mapType === "standard"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 hover:bg-slate-50",
                )}
              >
                Standard (Karte)
              </button>
              <button
                onClick={() => setMapType("satellite")}
                className={clsx(
                  "p-3 rounded-lg border text-sm font-medium transition-all",
                  mapType === "satellite"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 hover:bg-slate-50",
                )}
              >
                Satellit (Luftbild)
              </button>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100"></div>

          {/* Theme Toggle (Mock) */}
          <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                <Moon size={20} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900">
                  Dark Mode
                </label>
                <p className="text-xs text-slate-500">
                  In dieser Version deaktiviert.
                </p>
              </div>
            </div>
            <div className="w-10 h-6 bg-slate-200 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end pt-4">
        <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors">
          <Save size={18} />
          Einstellungen speichern
        </button>
      </div>
    </div>
  );
}

// Helper Component for Toggle Switch
function ToggleRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <label className="block text-sm font-medium text-slate-900">
          {label}
        </label>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={clsx(
          "relative w-11 h-6 rounded-full transition-colors",
          checked ? "bg-green-600" : "bg-slate-200",
        )}
      >
        <span
          className={clsx(
            "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
}
