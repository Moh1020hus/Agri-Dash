// src/types/index.ts

export type SensorStatus = 'online' | 'offline' | 'warning';
export type SensorType = 'dendrometer' | 'soil_moisture' | 'temperature' | 'camera';

export interface Field {
  id: string;
  name: string;
  color: string;
  center: [number, number];
  polygon: [number, number][];
}

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  status: SensorStatus;
  batteryLevel: number; // Percentage (0-100)
  signalStrength: number; // Percentage (0-100)
  lastUpdate: string; // ISO Date string
  value: number | string;
  unit: string;
  coordinates: [number, number]; // [Latitude, Longitude]
}

export interface BBCHData {
  currentStage: number;
  stageName: string;
  confidenceScore: number; // 0-1
  lastUpdated: string;
  history: {
    date: string;
    stage: number;
  }[];
}

export interface WeatherForecast {
  timestamp: string;
  temp: number; // Celsius
  humidity: number; // Percentage
  condition: 'sunny' | 'cloudy' | 'rain' | 'frost' | 'storm';
  isFrostRisk: boolean; // True if temp < 0 or risk is high
}