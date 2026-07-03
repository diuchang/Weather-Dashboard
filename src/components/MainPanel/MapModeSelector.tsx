import { useDashboardStore } from '../../store/dashboardStore';
import type { MapMode } from '../../store/dashboardStore';
import { HiOutlineColorSwatch } from 'react-icons/hi';
import { TbCircleFilled, TbGrain } from 'react-icons/tb';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MODES: { key: MapMode; label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: 'color', label: 'Color', Icon: HiOutlineColorSwatch },
  { key: 'circles', label: 'Circles', Icon: TbCircleFilled },
  { key: 'dots', label: 'Dots', Icon: TbGrain },
];

export default function MapModeSelector() {
  const mapMode = useDashboardStore((s) => s.mapMode);
  const setMapMode = useDashboardStore((s) => s.setMapMode);

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-panel-700 border border-white/10 p-0.5 shadow-lg">
      {MODES.map(({ key, label, Icon }) => (
        <Button
          key={key}
          variant="ghost"
          size="sm"
          onClick={() => setMapMode(key)}
          className={cn(
            'h-auto gap-1 rounded-md px-2.5 py-1.5 font-medium',
            mapMode === key
              ? 'bg-white text-navy-900 hover:bg-white hover:text-navy-900'
              : 'text-slate-400 hover:text-white'
          )}
        >
          <Icon size={14} />
          {label}
        </Button>
      ))}
    </div>
  );
}
