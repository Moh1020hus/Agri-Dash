import { MOCK_SENSORS, MOCK_WEATHER, MOCK_FIELDS } from './dummy-data';

export type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'alert';
  read: boolean;
  link: string;
};

export function getDynamicNotifications(): Notification[] {
  const notifications: Notification[] = [];

  // 1. CHECK WEATHER FOR FROST
  // We look at the next 12 hours
  const upcomingFrost = MOCK_WEATHER.slice(0, 12).find(w => w.isFrostRisk);
  
  if (upcomingFrost) {
    notifications.push({
      id: 'weather-frost',
      title: 'Frost Warnung',
      message: `Temperatur fällt auf ${upcomingFrost.temp}°C.`,
      time: 'Vor 1 Std', // In a real app, calculate diff
      type: 'alert',
      read: false,
      link: '/weather' // Clicking goes to Weather view
    });
  }

  // 2. CHECK SENSORS FOR WARNINGS
  MOCK_SENSORS.forEach(sensor => {
    if (sensor.status === 'warning' || sensor.status === 'offline') {
      // Find the field name for context
      const field = MOCK_FIELDS.find(f => f.id === sensor.fieldId);
      const fieldName = field ? field.name : 'Unbekanntes Feld';

      notifications.push({
        id: `sensor-${sensor.id}`,
        title: sensor.status === 'offline' ? 'Sensor Offline' : 'Kritischer Wert',
        message: `${sensor.name} in "${fieldName}" meldet Status: ${sensor.status.toUpperCase()}`,
        time: 'Vor 10 Min',
        type: sensor.status === 'offline' ? 'info' : 'warning',
        read: false,
        link: `/fields/${sensor.fieldId}` // <--- Dynamic Link to specific field
      });
    }
  });

  return notifications;
}