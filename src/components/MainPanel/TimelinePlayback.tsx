import { useEffect, useRef } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import { HiPlay, HiPause } from 'react-icons/hi';
import { format, addHours, startOfDay } from 'date-fns';

export default function TimelinePlayback() {
  const isPlaying = useDashboardStore((s) => s.isPlaying);
  const currentHour = useDashboardStore((s) => s.currentHour);
  const setIsPlaying = useDashboardStore((s) => s.setIsPlaying);
  const setCurrentHour = useDashboardStore((s) => s.setCurrentHour);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hourRef = useRef(currentHour);

  useEffect(() => { hourRef.current = currentHour; }, [currentHour]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentHour((hourRef.current + 1) % 24);
      }, 800);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, setCurrentHour]);

  const hourLabel = format(addHours(startOfDay(new Date()), currentHour), 'HH:mm');

  return (
    <div className="flex items-center gap-3 flex-1">
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-none transition-all ${
          isPlaying
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
            : 'bg-panel-700 border border-white/10 text-slate-400 hover:text-white hover:border-white/20'
        }`}
      >
        {isPlaying ? <HiPause size={14} /> : <HiPlay size={14} className="ml-0.5" />}
      </button>

      <span className="text-xs font-mono text-blue-300 w-10 flex-none">{hourLabel}</span>

      <input
        type="range"
        min={0}
        max={23}
        value={currentHour}
        onChange={(e) => {
          setIsPlaying(false);
          setCurrentHour(parseInt(e.target.value));
        }}
        className="flex-1"
        style={{
          background: `linear-gradient(to right, #3b82f6 ${(currentHour / 23) * 100}%, #1e2d4a ${(currentHour / 23) * 100}%)`,
        }}
      />

      <span className="text-xs text-slate-500 flex-none w-16">
        {currentHour < 6 ? 'Night' : currentHour < 12 ? 'Morning' : currentHour < 18 ? 'Afternoon' : 'Evening'}
      </span>
    </div>
  );
}
