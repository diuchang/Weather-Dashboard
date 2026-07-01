import { useState } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import { useWeather } from '../../hooks/useWeather';
import { getWeatherInfo } from '../../utils/weatherCodes';
import WeatherIcon from '../shared/WeatherIcon';
import LoadingSpinner from '../shared/LoadingSpinner';
import { format, parseISO } from 'date-fns';

type Metric = 'temperature' | 'rainfall' | 'humidity';

const TABS: { key: Metric; label: string }[] = [
  { key: 'temperature', label: 'Temperature' },
  { key: 'rainfall', label: 'Rainfall' },
  { key: 'humidity', label: 'Humidity' },
];

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

  const weekMin = Math.min(...days.map((d) => d.min));
  const weekMax = Math.max(...days.map((d) => d.max));
  const tempSpan = Math.max(weekMax - weekMin, 1);
  const maxPrecip = Math.max(...days.map((d) => d.precip), 1);

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

      <div className="flex flex-col gap-1">
        {days.map((day, i) => (
          <div key={i} className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0">
            <span className="text-xs text-slate-400 w-8 flex-none">{i === 0 ? 'Today' : format(day.date, 'EEE')}</span>
            <WeatherIcon icon={day.info.icon} size={20} className="text-sky-300 flex-none" />

            {metric === 'temperature' && (
              <>
                <div className="flex-1 mx-1 h-1.5 rounded-full bg-white/5 relative">
                  <div
                    className="absolute h-full rounded-full"
                    style={{
                      left: `${((day.min - weekMin) / tempSpan) * 100}%`,
                      width: `${Math.max(((day.max - day.min) / tempSpan) * 100, 6)}%`,
                      background: 'linear-gradient(to right, #3b82f6, #f97316)',
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-orange-300 w-8 text-right flex-none">{day.max}°</span>
                <span className="text-xs text-slate-500 w-8 text-right flex-none">{day.min}°</span>
              </>
            )}

            {metric === 'rainfall' && (
              <>
                <div className="flex-1 mx-1 h-1.5 rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${(day.precip / maxPrecip) * 100}%`, minWidth: day.precip > 0 ? 4 : 0 }}
                  />
                </div>
                <span className="text-xs font-medium text-blue-300 w-14 text-right flex-none">{day.precip.toFixed(1)} mm</span>
              </>
            )}

            {metric === 'humidity' && (
              <>
                <div className="flex-1 mx-1 h-1.5 rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${day.humidity}%`, background: 'linear-gradient(to right, #06b6d4, #7c3aed)' }}
                  />
                </div>
                <span className="text-xs font-medium text-purple-300 w-14 text-right flex-none">{day.humidity}%</span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
