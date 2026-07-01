import { useMemo } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import { useWeather } from '../../hooks/useWeather';
import { format } from 'date-fns';

function tempToColor(temp: number): string {
  const t = Math.max(0, Math.min(1, (temp - 15) / 25));
  const r = Math.round(59 + t * (239 - 59));
  const g = Math.round(130 + t * (68 - 130));
  const b = Math.round(246 + t * (68 - 246));
  return `rgb(${r},${g},${b})`;
}

export default function YearAtAGlance() {
  const city = useDashboardStore((s) => s.selectedCity);
  const { data } = useWeather(city);

  const cells = useMemo(() => {
    if (!data) return [];
    const today = new Date();
    const result: { date: string; temp: number | null; isToday: boolean }[] = [];

    data.daily.time.forEach((t, i) => {
      result.push({
        date: t,
        temp: data.daily.temperature_2m_max[i],
        isToday: t === format(today, 'yyyy-MM-dd'),
      });
    });
    return result;
  }, [data]);

  const weeks = useMemo(() => {
    const out: typeof cells[] = [];
    for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7));
    return out;
  }, [cells]);

  if (cells.length === 0) return null;

  return (
    <div className="rounded-xl bg-panel-800 border border-white/5 p-4 mb-2">
      <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">Year at a Glance</p>
      <div className="flex gap-px overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-px flex-none">
            {week.map((cell, di) => (
              <div
                key={di}
                className={`w-3 h-3 rounded-sm transition-opacity ${cell.isToday ? 'ring-1 ring-white ring-offset-1 ring-offset-[#0f1829]' : ''}`}
                style={{
                  backgroundColor: cell.temp != null ? tempToColor(cell.temp) : '#1e2d4a',
                  opacity: cell.temp != null ? 0.85 : 0.2,
                }}
                title={cell.temp != null ? `${cell.date}: ${Math.round(cell.temp)}°C` : cell.date}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-slate-500">Cool</span>
        <div className="flex-1 mx-2 h-1.5 rounded-full" style={{ background: 'linear-gradient(to right, #3b82f6, #f97316, #ef4444)' }} />
        <span className="text-[10px] text-slate-500">Hot</span>
      </div>
    </div>
  );
}
