'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MOCK_FIELDS, MOCK_SENSORS, BBCH_BY_FIELD, GROWTH_BY_FIELD } from '@/lib/dummy-data';
import { SensorCard } from '@/components/sensors/SensorCard';
import FrostMonitor from '@/components/weather/FrostMonitor';
import BBCHTracker from '@/components/phenology/BBCHTracker';
import GrowthChart from '@/components/phenology/GrowthChart';
import { Modal } from '@/components/ui/Modal';
import { Field, Sensor } from '@/types';

// --- VIEW IMPORTS ---
import SettingsView from '@/components/settings/SettingsView';
import ReportsView from '@/components/reports/ReportsView';
import FieldManagementView from '@/components/fields/FieldManagementView';
import PlantAnalysisView from '@/components/analysis/PlantAnalysisView';

// Dynamic Import for Map
const FieldMap = dynamic(() => import('@/components/maps/FieldMap'), { 
  ssr: false, 
  loading: () => <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">Karte wird geladen...</div>
});

// --- HELPER: Point in Polygon Algorithm ---
function isPointInPolygon(point: [number, number], vs: [number, number][]) {
    var x = point[0], y = point[1];
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

export default function Home() {
  // --- URL STATE ---
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'dashboard';

  // --- GLOBAL DATA STATE ---
  const [fields, setFields] = useState<Field[]>(MOCK_FIELDS);
  const [sensors, setSensors] = useState<any[]>(MOCK_SENSORS); 
  const [selectedFieldId, setSelectedFieldId] = useState<string>('all');

  // --- INTERACTION STATE ---
  const [selectionMode, setSelectionMode] = useState<'field' | 'sensor' | null>(null);
  const [tempCoords, setTempCoords] = useState<[number, number] | null>(null);
  
  // --- MODAL STATE ---
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isSensorModalOpen, setSensorModalOpen] = useState(false);

  // --- FORM STATE ---
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldColor, setNewFieldColor] = useState('#3b82f6');
  const [newSensorName, setNewSensorName] = useState('');
  const [newSensorType, setNewSensorType] = useState('dendrometer');

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleStartSelection = (mode: 'field' | 'sensor') => {
    setSelectionMode(mode);
    if (mode === 'field') setSelectedFieldId('all'); 
  };

  const handleLocationSelected = (lat: number, lng: number) => {
    // 1. Validate Sensor Placement
    if (selectionMode === 'sensor') {
      const activeField = fields.find(f => f.id === selectedFieldId);
      if (!activeField) { 
        alert("Fehler: Kein Feld ausgewählt."); 
        setSelectionMode(null); 
        return; 
      }
      
      const isInside = isPointInPolygon([lat, lng], activeField.polygon);
      if (!isInside) { 
        alert(`Der Sensor muss innerhalb der Grenzen von "${activeField.name}" platziert werden.`); 
        return; 
      }

      setTempCoords([lat, lng]);
      setSensorModalOpen(true);
      setSelectionMode(null);
    } 
    // 2. Handle Field Placement
    else if (selectionMode === 'field') {
      setTempCoords([lat, lng]);
      setAddModalOpen(true);
      setSelectionMode(null);
    }
  };

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName || !tempCoords) return;
    const [lat, lng] = tempCoords;
    const offset = 0.001; 
    const newField: Field = {
      id: `f-${Date.now()}`,
      name: newFieldName,
      color: newFieldColor,
      center: [lat, lng],
      polygon: [[lat + offset, lng - offset], [lat + offset, lng + offset], [lat - offset, lng + offset], [lat - offset, lng - offset]]
    };
    setFields([...fields, newField]);
    setAddModalOpen(false);
    setNewFieldName('');
    setSelectedFieldId(newField.id);
  };

  const handleAddSensor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSensorName || !tempCoords) return;
    if (selectedFieldId === 'all') { alert("Fehler: Kein Feld ausgewählt."); return; }
    
    const newSensor = {
      id: `s-${Date.now()}`,
      fieldId: selectedFieldId,
      name: newSensorName,
      type: newSensorType,
      status: 'online',
      batteryLevel: 100,
      signalStrength: 100,
      lastUpdate: new Date().toISOString(),
      value: 0,
      unit: newSensorType === 'temperature' ? '°C' : newSensorType === 'dendrometer' ? 'mm' : '%',
      coordinates: tempCoords,
    };
    setSensors([...sensors, newSensor]);
    setSensorModalOpen(false);
    setNewSensorName('');
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId('all');
  };

  const handleUpdateField = (updatedField: Field) => {
    setFields(fields.map(f => f.id === updatedField.id ? updatedField : f));
  };

  // Derived Data for Dashboard
  const displayedSensors = selectedFieldId === 'all' ? sensors : sensors.filter((s: any) => s.fieldId === selectedFieldId);
  const currentFieldId = selectedFieldId === 'all' ? 'f-001' : selectedFieldId;
  const bbchData = BBCH_BY_FIELD[currentFieldId] || BBCH_BY_FIELD['f-001'];
  const growthData = GROWTH_BY_FIELD[currentFieldId] || GROWTH_BY_FIELD['f-001'];

  // ==========================================
  // ROUTING LOGIC (SWITCH VIEWS)
  // ==========================================

  if (currentView === 'settings') {
    return (
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
        <SettingsView />
      </div>
    );
  }

  if (currentView === 'reports') {
    return (
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
        <ReportsView />
      </div>
    );
  }

  if (currentView === 'fields') {
    return (
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
        <FieldManagementView 
          fields={fields} 
          sensors={sensors}
          onUpdateField={handleUpdateField}
          onRemoveField={handleRemoveField}
        />
      </div>
    );
  }

  if (currentView === 'plants') {
    return (
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
        <PlantAnalysisView />
      </div>
    );
  }

  // ==========================================
  // DEFAULT VIEW: DASHBOARD
  // ==========================================
  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">
      
      {/* 1. MAP & WEATHER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[450px]">
          <FieldMap 
            fields={fields}
            selectedFieldId={selectedFieldId} 
            onSelectField={setSelectedFieldId}
            sensors={displayedSensors}
            onRemoveField={handleRemoveField}
            isSelectingLocation={selectionMode !== null}
            onStartSelection={handleStartSelection}
            onLocationSelected={handleLocationSelected}
            onCancelSelection={() => setSelectionMode(null)}
          />
        </div>
        <div className="lg:col-span-1 h-[450px]">
          <FrostMonitor />
        </div>
      </div>

      {/* 2. SENSOR GRID */}
      {displayedSensors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedSensors.map((sensor) => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400 bg-white rounded-xl border border-slate-200 border-dashed">
          Keine Sensoren in diesem Bereich gefunden.
        </div>
      )}

      {/* 3. ANALYSIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[250px]">
        <BBCHTracker data={bbchData} />
        <GrowthChart data={growthData} />
      </div>

      {/* ================= MODALS ================= */}

      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Neue Versuchsfläche anlegen">
        <form onSubmit={handleAddField} className="space-y-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm text-slate-700 mb-4">
            Position: <span className="font-mono text-xs font-bold text-slate-900">{tempCoords?.map(c => c.toFixed(5)).join(', ')}</span>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1">Bezeichnung</label>
            <input type="text" required placeholder="z.B. Feld Ost" value={newFieldName} onChange={(e) => setNewFieldName(e.target.value)} className="w-full rounded-lg border-slate-300 border p-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none"/>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1">Markierungsfarbe</label>
            <div className="flex gap-3">
              {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((color) => (
                <button key={color} type="button" onClick={() => setNewFieldColor(color)} className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${newFieldColor === color ? 'border-slate-600 scale-110 ring-2' : 'border-transparent'}`} style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
          <button type="submit" className="w-full py-2.5 px-4 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 shadow-sm mt-2">Fläche erstellen</button>
        </form>
      </Modal>

      <Modal isOpen={isSensorModalOpen} onClose={() => setSensorModalOpen(false)} title="Neuen Sensor hinzufügen">
        <form onSubmit={handleAddSensor} className="space-y-4">
           <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm text-slate-700 mb-4">
            <p className="mb-1 font-medium">Der Sensor wird der aktuell gewählten Fläche zugeordnet.</p>
            Position: <span className="font-mono text-xs font-bold text-slate-900">{tempCoords?.map(c => c.toFixed(5)).join(', ')}</span>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1">Sensor Name</label>
            <input type="text" required placeholder="z.B. Bodenfeuchte Mitte" value={newSensorName} onChange={(e) => setNewSensorName(e.target.value)} className="w-full rounded-lg border-slate-300 border p-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1">Typ</label>
            <select value={newSensorType} onChange={(e) => setNewSensorType(e.target.value)} className="w-full rounded-lg border-slate-300 border p-2.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="dendrometer">Dendrometer (Wachstum)</option>
              <option value="soil_moisture">Bodenfeuchte</option>
              <option value="temperature">Klimastation</option>
              <option value="camera">Kamera</option>
            </select>
          </div>
          <button type="submit" className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm mt-2">Sensor installieren</button>
        </form>
      </Modal>

    </div>
  );
}