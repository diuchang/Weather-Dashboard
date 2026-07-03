import { useEffect, useRef } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import type { TimelineView } from '../../store/dashboardStore';
import { HiPlay, HiPause } from 'react-icons/hi';
import { setDate, setMonth, setYear, startOfDay, getDaysInMonth } from 'date-fns';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const VIEWS: TimelineView[] = ['day', 'month', 'year'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const YEAR_SPAN = 5;

interface Tick {
  pos: number;
  label: string;
}

export default function TimelinePlayback() {
  const isPlaying = useDashboardStore((s) => s.isPlaying);
  const selectedDate = useDashboardStore((s) => s.selectedDate);
  const timelineView = useDashboardStore((s) => s.timelineView);
  const setIsPlaying = useDashboardStore((s) => s.setIsPlaying);
  const setSelectedDate = useDashboardStore((s) => s.setSelectedDate);
  const setTimelineView = useDashboardStore((s) => s.setTimelineView);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dateRef = useRef(selectedDate);

  useEffect(() => { dateRef.current = selectedDate; }, [selectedDate]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const d = dateRef.current;
        if (timelineView === 'day') {
          const daysInMonth = getDaysInMonth(d);
          setSelectedDate(setDate(d, (d.getDate() % daysInMonth) + 1));
        } else if (timelineView === 'month') {
          setSelectedDate(setMonth(d, (d.getMonth() + 1) % 12));
        } else {
          setSelectedDate(setYear(d, d.getFullYear() + 1));
        }
      }, 800);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, timelineView, setSelectedDate]);

  const daysInMonth = getDaysInMonth(selectedDate);
  const currentYear = selectedDate.getFullYear();
  const yearMin = currentYear - YEAR_SPAN;
  const yearMax = currentYear + YEAR_SPAN;

  let min: number;
  let max: number;
  let value: number;
  let ticks: Tick[];

  if (timelineView === 'day') {
    min = 1;
    max = daysInMonth;
    value = selectedDate.getDate();
    ticks = Array.from(new Set([1, 5, 10, 15, 20, 25, 30, daysInMonth].filter((d) => d <= daysInMonth))).map((d) => ({
      pos: d,
      label: String(d),
    }));
  } else if (timelineView === 'month') {
    min = 0;
    max = 11;
    value = selectedDate.getMonth();
    ticks = MONTH_LABELS.map((label, i) => ({ pos: i, label }));
  } else {
    min = yearMin;
    max = yearMax;
    value = currentYear;
    ticks = Array.from({ length: yearMax - yearMin + 1 }, (_, i) => yearMin + i).map((y) => ({
      pos: y,
      label: String(y),
    }));
  }

  function handleChange(v: number) {
    if (timelineView === 'day') {
      setSelectedDate(setDate(selectedDate, v));
    } else if (timelineView === 'month') {
      setSelectedDate(setMonth(selectedDate, v));
    } else {
      setSelectedDate(setYear(selectedDate, v));
    }
  }

  function handleToday() {
    setIsPlaying(false);
    setSelectedDate(startOfDay(new Date()));
  }

  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex items-stretch gap-3 flex-none">
      {/* Date Controls */}
      <div className="flex items-center rounded-lg overflow-hidden flex-none">
        {VIEWS.map((v) => (
          <Button
            key={v}
            variant="ghost"
            size="sm"
            onClick={() => setTimelineView(v)}
            className={cn(
              'h-auto rounded-none px-3 py-1 font-medium capitalize',
              timelineView === v
                ? 'bg-white text-navy-900 hover:bg-white hover:text-navy-900'
                : 'text-slate-400 hover:text-white'
            )}
          >
            {v}
          </Button>
        ))}
      </div>

      {/* Timeline Controls */}
      <div className="flex flex-col gap-1 flex-1 min-w-0 bg-panel-700 border border-white/10 rounded-lg px-3 py-0.5">
        <div className="relative pt-3 pb-0">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => handleChange(parseInt(e.target.value))}
            className="w-full"
            style={{
              background: `linear-gradient(to right, #3b82f6 ${percent}%, #1e2d4a ${percent}%)`,
            }}
          />
          <div className="absolute top-0 left-0 right-0 h-4 text-[10px] text-slate-500 font-mono">
            {ticks.map((t) => (
              <span
                key={t.label}
                className="absolute -translate-x-1/2"
                style={{ left: `${((t.pos - min) / (max - min)) * 100}%` }}
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Play Control */}
      <div className="flex flex-col gap-1 flex-none justify-center bg-panel-700 border border-white/10 rounded-lg px-3 py-0.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsPlaying(!isPlaying)}
          className="h-auto w-auto text-white hover:text-white hover:bg-transparent [&_svg]:size-3"
        >
          {isPlaying ? <HiPause size={12} /> : <HiPlay size={12} />}
        </Button>
      </div>

      {/* Today Control */}
      <div className="flex flex-col gap-1 flex-none justify-center bg-panel-700 border border-white/10 rounded-lg px-3 py-0.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToday}
          className="h-auto px-0 py-0 font-medium text-white hover:text-white hover:bg-transparent"
        >
          Today
        </Button>
      </div>
    </div>
  );
}
