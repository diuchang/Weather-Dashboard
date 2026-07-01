import { useMemo } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import {
  getClimateForCity,
  classifySeason,
  SEASON_META,
  MONTH_LABELS,
} from '../../data/climate';
import type { SeasonType } from '../../data/climate';
import {
  ComposedChart,
  Bar,
  Line,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TooltipPayloadItem {
  payload: { m: string; rainfall: number; temp: number; humidity: number; season: SeasonType };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  const meta = SEASON_META[d.season];
  return (
    <div className="rounded-lg bg-navy-800 border border-white/10 px-2.5 py-2 text-xs shadow-xl">
      <p className="font-semibold text-white mb-1">{d.m}</p>
      <p className="text-orange-300">Temperature: {d.temp}°C</p>
      <p className="text-blue-300">Rainfall: {d.rainfall} mm</p>
      <p className="text-slate-400">Humidity: {d.humidity}%</p>
      <p className="mt-1" style={{ color: meta.color }}>● {meta.label}</p>
    </div>
  );
}

export default function ClimateSeasons() {
  const city = useDashboardStore((s) => s.selectedCity);
  const currentMonth = new Date().getMonth();

  const data = useMemo(() => {
    const climate = getClimateForCity(city);
    return climate.map((m, i) => ({
      m: MONTH_LABELS[i],
      rainfall: m.rainfall,
      temp: m.tempAvg,
      humidity: m.humidity,
      season: classifySeason(m),
    }));
  }, [city]);

  const usedSeasons = useMemo(() => {
    const set = new Set<SeasonType>(data.map((d) => d.season));
    return (Object.keys(SEASON_META) as SeasonType[]).filter((s) => set.has(s));
  }, [data]);

  return (
    <div className="rounded-xl bg-panel-800 border border-white/5 p-4">
      <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">Climate Seasons</p>

      <div className="h-32 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
            <XAxis
              dataKey="m"
              tick={{ fill: '#64748b', fontSize: 9 }}
              axisLine={{ stroke: '#1e2d4a' }}
              tickLine={false}
              interval={0}
            />
            <YAxis yAxisId="rain" hide domain={[0, 'dataMax']} />
            <YAxis yAxisId="temp" hide domain={['dataMin - 3', 'dataMax + 3']} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar yAxisId="rain" dataKey="rainfall" radius={[2, 2, 0, 0]} maxBarSize={14}>
              {data.map((d, i) => (
                <Cell
                  key={i}
                  fill={SEASON_META[d.season].color}
                  fillOpacity={i === currentMonth ? 1 : 0.75}
                  stroke={i === currentMonth ? '#ffffff' : undefined}
                  strokeWidth={i === currentMonth ? 1 : 0}
                />
              ))}
            </Bar>
            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="temp"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Season band across the year */}
      <div className="flex gap-px mt-2 rounded overflow-hidden">
        {data.map((d, i) => (
          <div
            key={i}
            className={`flex-1 h-2 ${i === currentMonth ? 'ring-1 ring-white/60' : ''}`}
            style={{ backgroundColor: SEASON_META[d.season].color, opacity: 0.85 }}
            title={`${d.m}: ${SEASON_META[d.season].label}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
        {usedSeasons.map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: SEASON_META[s].color }} />
            <span className="text-[11px] text-slate-400">{SEASON_META[s].label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-orange-500" />
          <span className="text-[11px] text-slate-400">Temperature</span>
        </div>
      </div>
    </div>
  );
}
