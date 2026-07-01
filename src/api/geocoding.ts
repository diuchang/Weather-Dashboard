import axios from 'axios';
import type { GeoResult } from '../types';

const GEO_BASE = 'https://geocoding-api.open-meteo.com/v1/search';

export async function searchLocations(name: string): Promise<GeoResult[]> {
  if (name.trim().length < 2) return [];
  try {
    const res = await axios.get<{ results?: GeoResult[] }>(GEO_BASE, {
      params: { name: name.trim(), count: 10, language: 'en' },
    });
    return res.data.results ?? [];
  } catch {
    return [];
  }
}
