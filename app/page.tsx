'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MOCK_FIELDS, MOCK_SENSORS, BBCH_BY_FIELD, GROWTH_BY_FIELD } from '@/lib/dummy-data';
import { SensorCard } from '@/components/sensors/SensorCard';
import FrostMonitor from '@/components/weather/FrostMonitor';
import BBCHTracker from '@/components/phenology/BBCHTracker';
import GrowthChart from '@/components/phenology/GrowthChart';
import { Modal } from '@/components/ui/Modal';
import { Field, Sensor } from '@/types';

// Dynamic Import for Map (Client-side only)
const FieldMap = dynamic(() => import('@/components/maps/FieldMap'), { 
  ssr: false, 
  loading: () => (
    <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">
      Karte wird geladen...
    </div>
  )
});

export default function Home() {
  // --- GLOBAL STATE ---
  const [fields, setFields] = useState<Field[]>(MOCK_FIELDS);
  const [sensors, setSensors] = useState<any[]>(MOCK_SENSORS); 
  const [selectedFieldId, setSelectedFieldId] = useState<string>('all');

  // --- SELECTION MODE STATE ---
  const [selectionMode, setSelectionMode] = useState<'field' | 'sensor' | null>(null);
  const [tempCoords, setTempCoords] = useState<[number, number] | null>(null);

  // --- MODAL VISIBILITY STATE ---
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isSensorModalOpen, setSensorModalOpen] = useState(false);

  // --- FORM STATE (NEW FIELD) ---
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldColor, setNewFieldColor] = useState('#3b82f6');

  // --- FORM STATE (NEW SENSOR) ---
  const [newSensorName, setNewSensorName] = useState('');
  const [newSensorType, setNewSensorType] = useState('dendrometer');

  // ==========================================
  // HANDLERS
  // ==========================================

  // 1. User clicks a button to start placing something
  const handleStartSelection = (mode: 'field' | 'sensor') => {
    setSelectionMode(mode);
    // If adding a field, zoom out to see everything. 
    // If adding a sensor, we keep the current zoom (user is likely already looking at the field).
    if (mode === 'field') setSelectedFieldId('all'); 
  };

  // 2. User clicks on the map -> Store coords & open correct modal
  const handleLocationSelected = (lat: number, lng: number) => {
    setTempCoords([lat, lng]);
    
    if (selectionMode === 'field') {
      setAddModalOpen(true);
    } else if (selectionMode === 'sensor') {
      setSensorModalOpen(true);
    }
    setSelectionMode(null); // Stop selecting
  };

  // 3. Submit: Add New Field
  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName || !tempCoords) return;

    const [lat, lng] = tempCoords;
    const offset = 0.001; // Create a small square ~100m

    const newField: Field = {
      id: `f-${Date.now()}`,
      name: newFieldName,
      color: newFieldColor,
      center: [lat, lng],
      polygon: [
        [lat + offset, lng - offset], // Top Left
        [lat + offset, lng + offset], // Top Right
        [lat - offset, lng + offset], // Bottom Right
        [lat - offset, lng - offset], // Bottom Left
      ]
    };

    setFields([...fields, newField]);
    setAddModalOpen(false);
    setNewFieldName('');
    setSelectedFieldId(newField.id); // Auto-select the new field
  };

  // 4. Submit: Add New Sensor
  const handleAddSensor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSensorName || !tempCoords) return;

    // Safety: Ensure we aren't adding to 'all'
    if (selectedFieldId === 'all') {
      alert("Fehler: Kein Feld ausgewählt.");
      return;
    }

    const newSensor = {
      id: `s-${Date.now()}`,
      fieldId: selectedFieldId, // Link to the currently selected field
      name: newSensorName,
      type: newSensorType,
      status: 'online', // Default status
      batteryLevel: 100,
      signalStrength: 100,
      lastUpdate: new Date().toISOString(),
      value: 0, // Placeholder value
      unit: newSensorType === 'temperature' ? '°C' : newSensorType === 'dendrometer' ? 'mm' : '%',
      coordinates: tempCoords,
    };

    setSensors([...sensors, newSensor]);
    setSensorModalOpen(false);
    setNewSensorName('');
  };

  // 5. Delete Field
  const handleRemoveField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
    // Also remove sensors attached to this field? Optional, but good practice:
    // setSensors(sensors.filter(s => s.fieldId !== id)); 
    if (selectedFieldId === id) setSelectedFieldId('all');
  };

  // ==========================================
  // DERIVED DATA (FILTERING)
  // ==========================================
  
  // Filter Sensors for the Grid
  const displayedSensors = selectedFieldId === 'all' 
    ? sensors 
    : sensors.filter((s: any) => s.fieldId === selectedFieldId);

  // Get Chart Data for the current field
  const currentFieldId = selectedFieldId === 'all' ? 'f-001' : selectedFieldId;
  const bbchData = BBCH_BY_FIELD[currentFieldId] || BBCH_BY_FIELD['f-001']; // Fallback
  const growthData = GROWTH_BY_FIELD[currentFieldId] || GROWTH_BY_FIELD['f-001']; // Fallback

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Agri Dashboard</h1>
        <p className="text-slate-500 mt-2">Echtzeit-Überwachung der Versuchsflächen (Pilotprojekt)</p>
      </div>

      {/* ROW 1: MAP & WEATHER */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <FieldMap 
            fields={fields}
            selectedFieldId={selectedFieldId} 
            onSelectField={setSelectedFieldId}
            sensors={displayedSensors}
            onRemoveField={handleRemoveField}
            
            // Interaction Props
            isSelectingLocation={selectionMode !== null}
            onStartSelection={handleStartSelection}
            onLocationSelected={handleLocationSelected}
            onCancelSelection={() => setSelectionMode(null)}
          />
        </div>
        <div className="lg:col-span-1">
          <FrostMonitor />
        </div>
      </div>

      {/* ROW 2: SENSOR GRID */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          Sensor Status
          {selectedFieldId !== 'all' && (
            <span className="text-sm font-normal text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">
              Gefiltert: {displayedSensors.length} Gerät(e)
            </span>
          )}
        </h2>
        
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
      </div>

      {/* ROW 3: ANALYSIS CHARTS */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Pflanzenentwicklung & Analyse</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[220px]">
          {/* Dynamic Data passed via Props */}
          <BBCHTracker data={bbchData} />
          <GrowthChart data={growthData} />
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. ADD FIELD MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Neue Versuchsfläche anlegen"
      >
        <form onSubmit={handleAddField} className="space-y-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm text-slate-600 mb-4">
            Position: <span className="font-mono text-xs">{tempCoords?.map(c => c.toFixed(5)).join(', ')}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bezeichnung</label>
            <input 
              type="text" 
              required
              placeholder="z.B. Feld Ost - Weizen"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Markierungsfarbe</label>
            <div className="flex gap-3">
              {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewFieldColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${newFieldColor === color ? 'border-slate-600 scale-110 ring-2 ring-offset-1 ring-slate-300' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-2 px-4 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm mt-2"
          >
            Fläche erstellen
          </button>
        </form>
      </Modal>

      {/* 2. ADD SENSOR MODAL */}
      <Modal
        isOpen={isSensorModalOpen}
        onClose={() => setSensorModalOpen(false)}
        title="Neuen Sensor hinzufügen"
      >
        <form onSubmit={handleAddSensor} className="space-y-4">
           <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm text-slate-600 mb-4">
            <p className="mb-1">Der Sensor wird der aktuell gewählten Fläche zugeordnet.</p>
            Position: <span className="font-mono text-xs">{tempCoords?.map(c => c.toFixed(5)).join(', ')}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Sensor Name</label>
            <input 
              type="text" 
              required 
              placeholder="z.B. Bodenfeuchte Mitte" 
              value={newSensorName} 
              onChange={(e) => setNewSensorName(e.target.value)} 
              className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Typ</label>
            <select 
              value={newSensorType}
              onChange={(e) => setNewSensorType(e.target.value)}
              className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="dendrometer">Dendrometer (Wachstum)</option>
              <option value="soil_moisture">Bodenfeuchte</option>
              <option value="temperature">Klimastation</option>
              <option value="camera">Kamera</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm mt-2"
          >
            Sensor installieren
          </button>
        </form>
      </Modal>

    </main>
  );
}