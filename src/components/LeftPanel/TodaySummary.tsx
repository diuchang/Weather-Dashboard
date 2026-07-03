import { useDashboardStore } from '../../store/dashboardStore';
import { useWeather } from '../../hooks/useWeather';
import LoadingSpinner from '../shared/LoadingSpinner';
import { HiOutlineInformationCircle } from 'react-icons/hi';

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

type Status = 'pleasant' | 'attention' | 'adverse';

function statusOf(score: number): Status {
  if (score < 3.5) return 'pleasant';
  if (score < 6.5) return 'attention';
  return 'adverse';
}

const STATUS_META: Record<Status, { label: string; text: string; dot: string }> = {
  pleasant: { label: 'Pleasant', text: 'text-green-400', dot: 'bg-green-400' },
  attention: { label: 'Watch out', text: 'text-orange-400', dot: 'bg-orange-400' },
  adverse: { label: 'Adverse', text: 'text-red-400', dot: 'bg-red-400' },
};

interface Condition {
  title: string;
  description: string;
  score: number;
}

function ConditionCard({ title, description, score }: Condition) {
  const status = statusOf(score);
  const meta = STATUS_META[status];
  return (
    <div className="flex-1 flex flex-col rounded-lg bg-panel-800 border border-white/5 p-3">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-[11px] leading-snug text-slate-400 flex-1">{description}</p>
      <div className="mt-2 flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
        <span className={`text-[11px] font-medium ${meta.text}`}>{meta.label}</span>
      </div>
      <p className={`mt-1 text-2xl font-semibold ${meta.text}`}>{score.toFixed(1)}</p>
    </div>
  );
}

export default function TodaySummary() {
  const city = useDashboardStore((s) => s.selectedCity);
  const currentHour = useDashboardStore((s) => s.currentHour);
  const { data, loading } = useWeather(city);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-24 rounded-xl bg-panel-800 border border-white/5">
        <LoadingSpinner />
      </div>
    );
  }

  const temp = Math.round(data.hourly.temperature_2m[currentHour]);
  const max = Math.round(data.daily.temperature_2m_max[0]);
  const min = Math.round(data.daily.temperature_2m_min[0]);
  const humidity = Math.round(data.hourly.relative_humidity_2m[currentHour]);
  const wind = Math.round(data.hourly.wind_speed_10m[currentHour]);
  const precip = data.daily.precipitation_sum[0] ?? 0;

  // 0–10, higher = more of a concern
  const tempScore = clamp(Math.abs(temp - 26) * 0.6 + Math.max(0, max - min - 6) * 0.4, 0, 10);
  const humidityScore = clamp((humidity - 40) / 6, 0, 10);
  const rainWindScore = clamp(precip * 0.35 + wind * 0.15, 0, 10);

  const conditions: Condition[] = [
    {
      title: 'Temperature',
      description: 'Tracks heat, cold, and temperature swings through the day.',
      score: tempScore,
    },
    {
      title: 'Humidity',
      description: 'High humidity makes the air feel muggier and less comfortable.',
      score: humidityScore,
    },
    {
      title: 'Rain & wind',
      description: "Combines forecast rainfall with the day's peak wind speed.",
      score: rainWindScore,
    },
  ];

  return (
    <div className="rounded-xl bg-gradient-to-br from-panel-700 to-navy-900 border border-white/5 p-4">
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-semibold text-white">Key weather conditions</p>
        <HiOutlineInformationCircle size={14} className="text-slate-500" />
      </div>
      <p className="mt-1 text-[11px] leading-snug text-slate-400">
        Three weather groups that explain at a glance why a day is rated pleasant, worth watching, or adverse.
      </p>

      <div className="mt-3 flex gap-2">
        {conditions.map((c) => (
          <ConditionCard key={c.title} {...c} />
        ))}
      </div>
    </div>
  );
}
