import { useState, useEffect } from 'react';
import type { WeatherResponse } from '../types';
import { CITIES } from '../data/cities';
import { fetchWeather } from '../api/weather';

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function useAllCitiesWeather() {
  const [cityData, setCityData] = useState<Map<string, WeatherResponse>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const CHUNK = 5;

    async function fetchAll() {
      const map = new Map<string, WeatherResponse>();
      for (let i = 0; i < CITIES.length; i += CHUNK) {
        if (cancelled) break;
        const chunk = CITIES.slice(i, i + CHUNK);
        try {
          const results = await Promise.all(chunk.map((c) => fetchWeather(c.lat, c.lon)));
          chunk.forEach((city, idx) => map.set(city.id, results[idx]));
          if (!cancelled) setCityData(new Map(map));
        } catch {
          // continue on error
        }
        if (i + CHUNK < CITIES.length) await sleep(200);
      }
      if (!cancelled) setLoading(false);
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  return { cityData, loading };
}
