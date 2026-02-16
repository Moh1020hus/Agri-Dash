// src/lib/dummy-data.ts
import { Sensor, BBCHData, WeatherForecast } from '@/types';

// ==========================================
// 1. FIELDS (MOVED TO COUNTRYSIDE)
// ==========================================
export const MOCK_FIELDS = [
  {
    id: 'f-001',
    name: 'Versuchsfeld Nord (Seehausen)',
    color: '#3b82f6', // Blue
    center: [51.4050, 12.4000] as [number, number], // ~7km North of Center
    polygon: [
      [51.4060, 12.3990],
      [51.4060, 12.4010],
      [51.4040, 12.4010],
      [51.4040, 12.3990],
    ] as [number, number][],
  },
  {
    id: 'f-002',
    name: 'Obstplantage Süd (Wachau)',
    color: '#10b981', // Green
    center: [51.2700, 12.4200] as [number, number], // ~10km South of Center
    polygon: [
      [51.2710, 12.4190],
      [51.2710, 12.4210],
      [51.2690, 12.4210],
      [51.2690, 12.4190],
    ] as [number, number][],
  },
  {
    id: 'f-003',
    name: 'Gewächshaus West (Miltitz)',
    color: '#f59e0b', // Amber
    center: [51.3300, 12.2300] as [number, number], // ~10km West of Center
    polygon: [
      [51.3305, 12.2290],
      [51.3305, 12.2310],
      [51.3295, 12.2310],
      [51.3295, 12.2290],
    ] as [number, number][],
  },
  {
    id: 'f-004',
    name: 'Apfelbaum Gewächshaus West (Miltitz)',
    color: '#920ec7', // Purple
    center: [49.13140, 13.3700] as [number, number], // ~10km West of Center
    polygon: [
      [49.13148, 13.3690],
      [49.13148, 13.3710],
      [49.13099, 13.3710],
      [49.13099, 13.3690],
    ] as [number, number][],
  }
];

// ==========================================
// 2. SENSORS (COORDINATES UPDATED)
// ==========================================
export const MOCK_SENSORS: (Sensor & { fieldId: string })[] = [
  // --- Field 1: Nord (Seehausen) ---
  {
    id: 's-001',
    fieldId: 'f-001',
    name: 'Dendrometer Nord',
    type: 'dendrometer',
    status: 'online',
    batteryLevel: 85,
    signalStrength: 92,
    lastUpdate: new Date().toISOString(),
    value: 0.45,
    unit: 'mm growth',
    coordinates: [51.4050, 12.4000], // Updated
  },
  {
    id: 's-002',
    fieldId: 'f-001',
    name: 'Bodenfeuchte Tief',
    type: 'soil_moisture',
    status: 'warning',
    batteryLevel: 12,
    signalStrength: 45,
    lastUpdate: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    value: 22,
    unit: '%',
    coordinates: [51.4055, 12.3995], // Updated
  },
  // --- Field 2: Süd (Wachau) ---
  {
    id: 's-003',
    fieldId: 'f-002',
    name: 'Klima Station',
    type: 'temperature',
    status: 'online',
    batteryLevel: 100,
    signalStrength: 98,
    lastUpdate: new Date().toISOString(),
    value: 14.2,
    unit: '°C',
    coordinates: [51.2700, 12.4200], // Updated
  },
  // --- Field 3: West (Miltitz) ---
  {
    id: 's-004',
    fieldId: 'f-003',
    name: 'Phäno-Kamera',
    type: 'camera',
    status: 'offline',
    batteryLevel: 0,
    signalStrength: 0,
    lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    value: 'No Signal',
    unit: '',
    coordinates: [51.3300, 12.2300], // Updated
    photoUrl: '/uploads/sensor-1.jpg',
  },
  // --- Field 4: Apfelbaum Gewächshaus West (Miltitz) ---
  {
    id: 's-005',
    fieldId: 'f-004',
    name: 'Apfelbaum Kamera', 
    type: 'camera',
    status: 'online',
    batteryLevel: 95, 
    signalStrength: 90,
    lastUpdate: new Date().toISOString(),
    value: 'Online',
    unit: '',
    coordinates: [49.13140, 13.3700], // Updated
    photoUrl: '/uploads/sensor-2.jpg',
    
  },
  {
    id: 's-006',
    fieldId: 'f-004',
    name: 'Apfelbaum Temperatur',
    type: 'temperature',
    status: 'online',
    batteryLevel: 95, 
    signalStrength: 90,
    lastUpdate: new Date().toISOString(),
    value: 20.5,
    unit: '°C',
    coordinates: [49.13140, 13.3700], // Updated
    photoUrl: '/uploads/sensor-2.jpg',
    
  },
  {
    id: 's-007',
    fieldId: 'f-004',
    name: 'Apfelbaum Bodenfeuchte', 
    type: 'soil_moisture',
    status: 'online',
    batteryLevel: 95, 
    signalStrength: 90,
    lastUpdate: new Date().toISOString(),
    value: 35,
    unit: '%',
    coordinates: [49.13140, 13.3700], // Updated
    photoUrl: '/uploads/sensor-2.jpg',
  }
];

// ==========================================
// 3. BBCH DATA (Unchanged)
// ==========================================
export const BBCH_BY_FIELD: Record<string, BBCHData> = {
  'f-001': { // Field 1: Apple
    currentStage: 65,
    stageName: 'Vollblüte',
    confidenceScore: 0.89,
    lastUpdated: new Date().toISOString(),
    history: [
      { date: '2025-04-01', stage: 10 },
      { date: '2025-04-15', stage: 30 },
      { date: '2025-04-25', stage: 60 },
      { date: '2025-05-01', stage: 65 },
    ],
  },
  'f-002': { // Field 2: Cherry
    currentStage: 71,
    stageName: 'Fruchtansatz',
    confidenceScore: 0.92,
    lastUpdated: new Date().toISOString(),
    history: [
      { date: '2025-04-01', stage: 50 },
      { date: '2025-04-10', stage: 60 },
      { date: '2025-04-20', stage: 69 },
      { date: '2025-05-01', stage: 71 },
    ],
  },
  'f-003': { // Field 3: Greenhouse
    currentStage: 11,
    stageName: 'Erste Laubblätter',
    confidenceScore: 0.75,
    lastUpdated: new Date().toISOString(),
    history: [
      { date: '2025-04-20', stage: 0 },
      { date: '2025-04-25', stage: 9 },
      { date: '2025-05-01', stage: 11 },
    ],
  },
};

// ==========================================
// 4. GROWTH DATA 
// ==========================================
export const GROWTH_BY_FIELD: Record<string, any[]> = {
  'f-001': Array.from({ length: 14 }).map((_, i) => ({
    date: new Date(Date.now() - (13 - i) * 86400000).toISOString(),
    growth: parseFloat((0.1 + i * 0.05).toFixed(2)),
    moisture: Math.round(30 - i * 0.5),
  })),
  'f-002': Array.from({ length: 14 }).map((_, i) => ({
    date: new Date(Date.now() - (13 - i) * 86400000).toISOString(),
    growth: parseFloat((0.8 + i * 0.1).toFixed(2)),
    moisture: Math.round(45 + (i % 3)), 
  })),
  'f-003': Array.from({ length: 14 }).map((_, i) => ({
    date: new Date(Date.now() - (13 - i) * 86400000).toISOString(),
    growth: parseFloat((0.05 + i * 0.01).toFixed(2)),
    moisture: Math.round(18 - i * 0.5), 
  })),
};

// ==========================================
// 5. WEATHER FORECAST 
// ==========================================
export const MOCK_WEATHER: WeatherForecast[] = Array.from({ length: 24 }).map((_, i) => {
  const isNight = i > 10 && i < 18;
  const temp = isNight ? -1.5 : 12 + (i % 3); 
  return {
    timestamp: new Date(Date.now() + i * 3600 * 1000).toISOString(),
    temp: parseFloat(temp.toFixed(1)),
    humidity: isNight ? 90 : 45,
    condition: temp < 0 ? 'frost' : isNight ? 'cloudy' : 'sunny',
    isFrostRisk: temp <= 2,
  };
});

export const MOCK_BBCH = BBCH_BY_FIELD['f-001'];
export const MOCK_GROWTH_HISTORY = GROWTH_BY_FIELD['f-001'];