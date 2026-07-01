import axios from 'axios';
import type { WeatherResponse } from '../types';

const BASE = 'https://api.open-meteo.com/v1/forecast';
const CACHE_TTL_MS = 60 * 60 * 1000;

interface CacheEntry {
  data: WeatherResponse;
  timestamp: number;
}

function cacheKey(lat: number, lon: number): string {
  return `wx_${lat.toFixed(4)}_${lon.toFixed(4)}`;
}

function readCache(key: string): WeatherResponse | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) return null;
    return entry.data;
  } catch {
    return null;
  }
}

function writeCache(key: string, data: WeatherResponse): void {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // ignore storage quota errors
  }
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherResponse> {
  const key = cacheKey(lat, lon);
  const cached = readCache(key);
  if (cached) return cached;

  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    hourly: 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum',
    timezone: 'Asia/Ho_Chi_Minh',
    forecast_days: '16',
  });

  const res = await axios.get<WeatherResponse>(`${BASE}?${params}`);
  writeCache(key, res.data);
  return res.data;
}
