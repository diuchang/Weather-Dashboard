import { useState } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import { useWeather } from '../../hooks/useWeather';
import { getClimateForCity, MONTH_LABELS } from '../../data/climate';
import LoadingSpinner from '../shared/LoadingSpinner';
import { format, parseISO } from 'date-fns';

type Period = 'day' | 'week' | 'month' | 'half' | 'year';
type DayCat = 'sunny' | 'cloudy' | 'light-rain' | 'rain';

const PERIODS: { key: Period; label: string }[] = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'half', label: '6 Months' },
  { key: 'year', label: '12 Months' },
];

const CAT_META: Record<DayCat, { color: string; label: string }> = {
  sunny:        { color: '#fbbf24', label: 'Sunny' },
  cloudy:       { color: '#6FA1BF', label: 'Cloudy' },
  'light-rain': { color: '#6687D7', label: 'Light rain' },
  rain:         { color: '#33449C', label: 'Rain' },
};

function catFromValues(precip: number, code: number, heavyThresh: number, lightThresh: number): DayCat {
  if (precip >= heavyThresh) return 'rain';
  if (precip >= lightThresh) return 'light-rain';
  if (code <= 1) return 'sunny';
  return 'cloudy';
}

export default function RainSunCalendar() {
  const city = useDashboardStore((s) => s.selectedCity);
  const { data, loading } = useWeather(city);
  const [period, setPeriod] = useState<Period>('day');

  return (
    <div className="py-6">
      {/* Header with period selector on the right */}
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <p className="text-md font-semibold text-white">Rain &amp; sun calendar</p>
        <div className="flex gap-1 flex-wrap">
          {PERIODS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                period === key
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                  : 'bg-white/5 text-slate-400 border border-transparent hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading && !data ? (
        <div className="flex justify-center py-6"><LoadingSpinner /></div>
      ) : (
        <>
          {period === 'day' && <DayView data={data} />}
          {period === 'week' && <WeekView data={data} />}
          {period === 'month' && <MonthView data={data} />}
          {(period === 'half' || period === 'year') && (
            <MonthlyView city={city} months={period === 'half' ? 6 : 12} />
          )}

          {/* Legend */}
          {period === 'half' || period === 'year' ? (
            <div className="flex gap-3 mt-3">
              <LegendItem color="#33449C" label="Rainy days" />
              <LegendItem color="#EEA530" label="Dry days" />
            </div>
          ) : (
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
              {(Object.keys(CAT_META) as DayCat[]).map((c) => (
                <LegendItem key={c} color={CAT_META[c].color} label={CAT_META[c].label} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
      <span className="text-[11px] text-slate-400">{label}</span>
    </div>
  );
}

/* ---- Day: 24 hours ---- */
function DayView({ data }: { data: ReturnType<typeof useWeather>['data'] }) {
  if (!data) return null;
  const today = format(new Date(), 'yyyy-MM-dd');
  const cells = Array.from({ length: 24 }, (_, h) => {
    const idx = data.hourly.time.findIndex((t) => t === `${today}T${String(h).padStart(2, '0')}:00`);
    if (idx === -1) return { h, cat: 'cloudy' as DayCat, precip: 0 };
    const precip = data.hourly.precipitation[idx] ?? 0;
    const code = data.hourly.weather_code[idx] ?? 0;
    return { h, cat: catFromValues(precip, code, 2, 0.2), precip };
  });

  return (
    <div>
      <div className="grid grid-cols-12 gap-[3px]">
        {cells.map((c) => (
          <div
            key={c.h}
            className="h-6 rounded-sm"
            style={{ backgroundColor: CAT_META[c.cat].color, opacity: 0.85 }}
            title={`${String(c.h).padStart(2, '0')}:00 — ${CAT_META[c.cat].label}${c.precip > 0 ? ` (${c.precip.toFixed(1)}mm)` : ''}`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1 text-[9px] text-slate-500">
        <span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>23h</span>
      </div>
    </div>
  );
}

/* ---- Week: 7 days ---- */
function WeekView({ data }: { data: ReturnType<typeof useWeather>['data'] }) {
  if (!data) return null;
  const days = data.daily.time.slice(0, 7).map((t, i) => {
    const precip = data.daily.precipitation_sum[i] ?? 0;
    const code = data.daily.weather_code[i] ?? 0;
    return { date: parseISO(t), cat: catFromValues(precip, code, 10, 1), precip };
  });

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {days.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <span className="text-[9px] text-slate-500">{i === 0 ? 'Today' : format(d.date, 'EEEEE')}</span>
          <div
            className="w-full h-10 rounded-md flex items-end justify-center pb-0.5"
            style={{ backgroundColor: CAT_META[d.cat].color, opacity: 0.85 }}
            title={`${format(d.date, 'dd/MM')} — ${CAT_META[d.cat].label}${d.precip > 0 ? ` (${d.precip.toFixed(0)}mm)` : ''}`}
          >
            <span className="text-[9px] text-white/90 font-medium">{format(d.date, 'd')}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---- Month: next ~16 forecast days ---- */
function MonthView({ data }: { data: ReturnType<typeof useWeather>['data'] }) {
  if (!data) return null;
  const days = data.daily.time.map((t, i) => {
    const precip = data.daily.precipitation_sum[i] ?? 0;
    const code = data.daily.weather_code[i] ?? 0;
    return { date: parseISO(t), cat: catFromValues(precip, code, 10, 1), precip };
  });

  return (
    <div>
      <p className="text-[10px] text-slate-500 mb-2">Next {days.length} days</p>
      <div className="grid grid-cols-8 gap-1">
        {days.map((d, i) => (
          <div
            key={i}
            className="aspect-square rounded-sm flex items-center justify-center"
            style={{ backgroundColor: CAT_META[d.cat].color, opacity: 0.85 }}
            title={`${format(d.date, 'dd/MM')} — ${CAT_META[d.cat].label}${d.precip > 0 ? ` (${d.precip.toFixed(0)}mm)` : ''}`}
          >
            <span className="text-[9px] text-white/90">{format(d.date, 'd')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- 6 / 12 months: monthly climate summary ---- */
function MonthlyView({ city, months }: { city: ReturnType<typeof useDashboardStore.getState>['selectedCity']; months: number }) {
  const climate = getClimateForCity(city);
  const start = new Date().getMonth();
  const rows = Array.from({ length: months }, (_, k) => {
    const mi = (start + k) % 12;
    const c = climate[mi];
    const daysInMonth = 30;
    const rainPct = Math.min(100, (c.rainDays / daysInMonth) * 100);
    return { label: MONTH_LABELS[mi], rainDays: c.rainDays, rainfall: c.rainfall, rainPct };
  });

  return (
    <div className="flex flex-col gap-1.5">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 w-6 flex-none">{r.label}</span>
          <div className="flex-1 h-4 rounded-full overflow-hidden flex bg-white/5">
            <div
              className="h-full"
              style={{ width: `${r.rainPct}%`, backgroundColor: '#33449C' }}
              title={`${r.rainDays} rainy days`}
            />
            <div
              className="h-full"
              style={{ width: `${100 - r.rainPct}%`, backgroundColor: '#fbbf24', opacity: 0.7 }}
              title={`${30 - r.rainDays} dry days`}
            />
          </div>
          <span className="text-[10px] text-slate-500 w-14 text-right flex-none">{r.rainfall}mm</span>
        </div>
      ))}
    </div>
  );
}
