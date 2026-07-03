import { useMemo, useState } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import { useWeather } from '../../hooks/useWeather';

const MONTH_LETTERS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function tempLabel(t: number): string {
  if (t < 20) return 'Cool';
  if (t < 27) return 'Mild';
  if (t < 32) return 'Warm';
  return 'Hot';
}

const CX = 100;
const CY = 100;
const R_OUT = 92;
const R_IN = 58;
const GAP = 1.2; // degrees between segments

// angle measured clockwise from the top of the circle
function polar(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.sin(rad), y: CY - r * Math.cos(rad) };
}

function sectorPath(a0: number, a1: number, rOut: number, rIn: number) {
  const p1 = polar(a0, rOut);
  const p2 = polar(a1, rOut);
  const p3 = polar(a1, rIn);
  const p4 = polar(a0, rIn);
  return `M ${p1.x} ${p1.y} A ${rOut} ${rOut} 0 0 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rIn} ${rIn} 0 0 0 ${p4.x} ${p4.y} Z`;
}

// cool (green) -> hot (orange/red)
function tempToColor(temp: number): string {
  const t = Math.max(0, Math.min(1, (temp - 16) / 20));
  const hue = 120 - t * 105; // 120 green -> 15 orange-red
  return `hsl(${hue}, 62%, 48%)`;
}

export default function YearAtAGlance() {
  const city = useDashboardStore((s) => s.selectedCity);
  const { data } = useWeather(city);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const [hovered, setHovered] = useState<number | null>(null);

  const monthly = useMemo(() => {
    // Climatological estimate: annual mean & seasonal swing scale with latitude.
    const baseMean = 27.5 - (city.lat - 10) * 0.38;
    const amplitude = Math.max(1.2, (city.lat - 8) * 0.62);
    // warmest around July (index 6) in the northern hemisphere
    const model = (m: number) => baseMean + amplitude * Math.cos((2 * Math.PI * (m - 6)) / 12);

    // Anchor the curve to the current observed temperature when available.
    let offset = 0;
    if (data) {
      const observed = data.daily.temperature_2m_max[0];
      if (typeof observed === 'number') offset = observed - model(currentMonth);
    }
    return MONTH_ABBR.map((_, m) => Math.round(model(m) + offset));
  }, [city.lat, data, currentMonth]);

  const pointer = polar(currentMonth * 30 + 15, R_OUT + 8);
  const tipPos = hovered !== null ? polar(hovered * 30 + 15, (R_OUT + R_IN) / 2) : null;

  return (
    <div className="rounded-xl bg-panel-800 border border-white/5 p-4 mb-2">
      <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">Year at a Glance</p>

      <div className="flex items-center justify-center gap-3">
        <div className="relative w-52 h-52 flex-none">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {MONTH_ABBR.map((_, m) => {
            const a0 = m * 30 + GAP;
            const a1 = (m + 1) * 30 - GAP;
            const mid = m * 30 + 15;
            const labelPos = polar(mid, (R_OUT + R_IN) / 2);
            const isCurrent = m === currentMonth;
            return (
              <g key={m}>
                <path
                  d={sectorPath(a0, a1, R_OUT, R_IN)}
                  fill={tempToColor(monthly[m])}
                  opacity={hovered === m ? 1 : isCurrent ? 1 : 0.9}
                  stroke={hovered === m ? '#fff' : '#0f1829'}
                  strokeWidth={hovered === m ? 1.5 : 1}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHovered(m)}
                  onMouseLeave={() => setHovered(null)}
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-black/70 font-semibold"
                  style={{ fontSize: 11 }}
                >
                  {MONTH_LETTERS[m]}
                </text>
              </g>
            );
          })}

          {/* current-month pointer */}
          <circle cx={pointer.x} cy={pointer.y} r={4} fill="#fff" />

          {/* center label */}
          <text
            x={CX}
            y={CY - 6}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-white"
            style={{ fontSize: 26, fontWeight: 300 }}
          >
            {MONTH_ABBR[currentMonth]}
          </text>
          <text
            x={CX}
            y={CY + 16}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-slate-500"
            style={{ fontSize: 13 }}
          >
            {currentYear}
          </text>
        </svg>

        {hovered !== null && tipPos && (
          <div
            className="absolute z-10 pointer-events-none -translate-x-1/2 -translate-y-full -mt-1 whitespace-nowrap rounded-lg bg-navy-900 border border-white/15 px-2.5 py-1.5 shadow-xl"
            style={{ left: `${(tipPos.x / 200) * 100}%`, top: `${(tipPos.y / 200) * 100}%` }}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tempToColor(monthly[hovered]) }} />
              <span className="text-xs font-semibold text-white">{MONTH_FULL[hovered]}</span>
              {hovered === currentMonth && (
                <span className="text-[9px] uppercase tracking-wide text-blue-300 bg-blue-500/20 rounded px-1">Now</span>
              )}
            </div>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span className="text-sm font-medium text-white">{monthly[hovered]}°C</span>
              <span className="text-[10px] text-slate-400">avg high · {tempLabel(monthly[hovered])}</span>
            </div>
          </div>
        )}
        </div>

        {/* Vertical color legend */}
        <div className="flex flex-col items-center gap-1 flex-none self-stretch py-2">
          <span className="text-[10px] text-slate-400">Hot</span>
          <div className="flex items-center gap-1 flex-1">
            <div
              className="w-2 h-full rounded-full"
              style={{ background: `linear-gradient(to top, ${tempToColor(16)}, ${tempToColor(26)}, ${tempToColor(36)})` }}
            />
            <div className="flex flex-col justify-between h-full text-[10px] text-slate-500">
              <span>36°</span>
              <span>26°</span>
              <span>16°</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400">Cool</span>
        </div>
      </div>
    </div>
  );
}
