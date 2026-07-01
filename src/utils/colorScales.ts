import type { WeatherLayer } from '../types';

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
}

function interpolate(stops: string[], t: number): string {
  if (stops.length === 1) return stops[0];
  const scaled = t * (stops.length - 1);
  const i = Math.floor(scaled);
  const frac = scaled - i;
  const a = hexToRgb(stops[Math.min(i, stops.length - 1)]);
  const b = hexToRgb(stops[Math.min(i + 1, stops.length - 1)]);
  return rgbToHex(lerp(a[0], b[0], frac), lerp(a[1], b[1], frac), lerp(a[2], b[2], frac));
}

const SCALES: Record<WeatherLayer, { stops: string[]; min: number; max: number }> = {
  temperature: {
    stops: ['#3b82f6', '#06b6d4', '#84cc16', '#fbbf24', '#f97316', '#ef4444'],
    min: 15,
    max: 40,
  },
  rain: {
    stops: ['#e0f2fe', '#7dd3fc', '#2563eb', '#1e3a5f'],
    min: 0,
    max: 30,
  },
  wind: {
    stops: ['#ccfbf1', '#5eead4', '#0d9488', '#0f766e'],
    min: 0,
    max: 60,
  },
  humidity: {
    stops: ['#fef08a', '#a3e635', '#06b6d4', '#7c3aed'],
    min: 0,
    max: 100,
  },
};

export function getLayerColor(layer: WeatherLayer, value: number): string {
  const scale = SCALES[layer];
  const t = (value - scale.min) / (scale.max - scale.min);
  return interpolate(scale.stops, t);
}

export function getLayerGradient(layer: WeatherLayer): string {
  const scale = SCALES[layer];
  return `linear-gradient(to right, ${scale.stops.join(', ')})`;
}

export function getLayerRange(layer: WeatherLayer): { min: number; max: number; unit: string } {
  const units: Record<WeatherLayer, string> = {
    temperature: '°C',
    rain: 'mm',
    wind: 'km/h',
    humidity: '%',
  };
  return { ...SCALES[layer], unit: units[layer] };
}

export function formatLayerValue(layer: WeatherLayer, value: number): string {
  switch (layer) {
    case 'temperature': return `${Math.round(value)}°C`;
    case 'rain': return `${value.toFixed(1)} mm`;
    case 'wind': return `${Math.round(value)} km/h`;
    case 'humidity': return `${Math.round(value)}%`;
  }
}
