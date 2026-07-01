import { useState, useEffect } from 'react';
import type { City, WeatherResponse } from '../types';
import { fetchWeather } from '../api/weather';

export function useWeather(city: City) {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchWeather(city.lat, city.lon)
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [city.lat, city.lon]);

  return { data, loading, error };
}
