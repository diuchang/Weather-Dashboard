import { useRef, useEffect } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import { useWeather } from '../../hooks/useWeather';
import { getWeatherInfo } from '../../utils/weatherCodes';
import WeatherIcon from '../shared/WeatherIcon';
import LoadingSpinner from '../shared/LoadingSpinner';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { format, startOfDay, addHours } from 'date-fns';

export default function HourlyForecast() {
  const city = useDashboardStore((s) => s.selectedCity);
  const currentHour = useDashboardStore((s) => s.currentHour);
  const selectedDate = useDashboardStore((s) => s.selectedDate);
  const setCurrentHour = useDashboardStore((s) => s.setCurrentHour);
  const { data, loading } = useWeather(city);
  const scrollRef = useRef<HTMLDivElement>(null);

  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  const hours = data?.hourly
    ? Array.from({ length: 24 }, (_, i) => {
        const idx = data.hourly.time.findIndex((t) => t === `${dateStr}T${String(i).padStart(2, '0')}:00`);
        if (idx === -1) return null;
        return {
          hour: i,
          temp: Math.round(data.hourly.temperature_2m[idx]),
          code: data.hourly.weather_code[idx],
          info: getWeatherInfo(data.hourly.weather_code[idx]),
        };
      }).filter(Boolean)
    : [];

  const chartData = hours.map((h) => ({ temp: h!.temp }));

  useEffect(() => {
    if (scrollRef.current) {
      const item = scrollRef.current.querySelector(`[data-hour="${currentHour}"]`);
      item?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [currentHour]);

  if (loading) return (
    <div className="flex items-center justify-center h-24">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="py-6">
      <p className="text-md font-semibold text-white pb-2">Today's hourly</p>

      {chartData.length > 0 && (
        <div className="h-20 py-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 4, bottom: 4, left: 4 }}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis domain={['auto', 'auto']} hide />
              <Area type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={1.5} fill="url(#tempGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div ref={scrollRef} className="flex gap-1 overflow-x-auto pb-1 pt-4 scroll-smooth">
        {hours.map((h) => h && (
          <button
            key={h.hour}
            data-hour={h.hour}
            onClick={() => setCurrentHour(h.hour)}
            className={`flex-none flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors min-w-[52px] ${
              h.hour === currentHour
                ? 'bg-orange-500/20 border border-orange-500/40'
                : 'hover:bg-white/5'
            }`}
          >
            <span className="text-xs text-slate-400">{format(addHours(startOfDay(new Date()), h.hour), 'HH:mm')}</span>
            <WeatherIcon icon={h.info.icon} size={20} className="text-sky-300" />
            <span className="text-xs font-medium text-white">{h.temp}°</span>
          </button>
        ))}
      </div>
    </div>
  );
}
