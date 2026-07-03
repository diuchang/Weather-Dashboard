import { useState } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import { useWeather } from '../../hooks/useWeather';
import { getWeatherInfo } from '../../utils/weatherCodes';
import LoadingSpinner from '../shared/LoadingSpinner';
import { format, parseISO } from 'date-fns';

type Metric = 'temperature' | 'rainfall' | 'humidity';

const TABS: { key: Metric; label: string }[] = [
  { key: 'temperature', label: 'Temperature' },
  { key: 'rainfall', label: 'Rainfall' },
  { key: 'humidity', label: 'Humidity' },
];

function lerpColor(a: [number, number, number], b: [number, number, number], t: number) {
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

const GREEN: [number, number, number] = [34, 197, 94];
const ORANGE: [number, number, number] = [249, 115, 22];
const CYAN: [number, number, number] = [6, 182, 212];
const PURPLE: [number, number, number] = [124, 58, 237];

export default function DailyForecast() {
  const city = useDashboardStore((s) => s.selectedCity);
  const { data, loading } = useWeather(city);
  const [metric, setMetric] = useState<Metric>('temperature');

  if (loading) return (
    <div className="flex items-center justify-center h-40 rounded-xl bg-panel-800 border border-white/5">
      <LoadingSpinner />
    </div>
  );

  // Daily average humidity aggregated from hourly data
  const humidityByDate: Record<string, number> = {};
  if (data) {
    const acc: Record<string, { sum: number; n: number }> = {};
    data.hourly.time.forEach((t, i) => {
      const date = t.slice(0, 10);
      if (!acc[date]) acc[date] = { sum: 0, n: 0 };
      acc[date].sum += data.hourly.relative_humidity_2m[i];
      acc[date].n += 1;
    });
    Object.keys(acc).forEach((d) => { humidityByDate[d] = acc[d].sum / acc[d].n; });
  }

  const days = data?.daily.time.slice(0, 7).map((time, i) => ({
    date: parseISO(time),
    info: getWeatherInfo(data.daily.weather_code[i]),
    max: Math.round(data.daily.temperature_2m_max[i]),
    min: Math.round(data.daily.temperature_2m_min[i]),
    precip: data.daily.precipitation_sum[i] ?? 0,
    humidity: Math.round(humidityByDate[time.slice(0, 10)] ?? 0),
  })) ?? [];

  const tempHi = Math.max(...days.map((d) => d.max));
  const tempLo = Math.min(...days.map((d) => d.max));
  const tempSpan = Math.max(tempHi - tempLo, 1);
  const maxPrecip = Math.max(...days.map((d) => d.precip), 1);

  function barFor(day: (typeof days)[number]): { label: string; t: number; color: string } {
    if (metric === 'temperature') {
      const t = (day.max - tempLo) / tempSpan;
      return { label: `${day.max}°`, t, color: lerpColor(GREEN, ORANGE, t) };
    }
    if (metric === 'rainfall') {
      const t = day.precip / maxPrecip;
      return { label: `${day.precip.toFixed(1)}`, t, color: 'rgb(59, 130, 246)' };
    }
    const t = day.humidity / 100;
    return { label: `${day.humidity}%`, t, color: lerpColor(CYAN, PURPLE, t) };
  }

  return (
    <div className="rounded-xl bg-panel-800 border border-white/5 p-4">
      <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">7-Day Forecast</p>

      {/* Metric tabs */}
      <div className="flex gap-1 mb-3">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setMetric(key)}
            className={`flex-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
              metric === key
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'bg-white/5 text-slate-400 border border-transparent hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-end justify-between gap-1">
        {days.map((day, i) => {
          const { label, t, color } = barFor(day);
          const heightPct = 25 + t * 75;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 min-w-0">
              <span className="text-[11px] text-slate-400 flex-none">
                {i === 0 ? 'Today' : format(day.date, 'EEE')}
              </span>

              <div className="flex items-end w-full justify-center h-28">
                <div
                  className="w-2.5 rounded-full transition-all"
                  style={{ height: `${heightPct}%`, backgroundColor: color }}
                />
              </div>

              <span className="text-[11px] font-medium flex-none" style={{ color }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
