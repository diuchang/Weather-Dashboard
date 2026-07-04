import { useDashboardStore } from '../../store/dashboardStore';

const ZOOMS: (0.5 | 1 | 2)[] = [0.5, 1, 2];

export default function ZoomControls() {
  const zoomLevel = useDashboardStore((s) => s.zoomLevel);
  const setZoomLevel = useDashboardStore((s) => s.setZoomLevel);

  return (
    <div className="flex flex-col items-stretch rounded-lg overflow-hidden border border-white/10 shadow-lg">
      {ZOOMS.map((z) => (
        <button
          key={z}
          onClick={() => setZoomLevel(z)}
          className={`px-3 py-1.5 text-xs font-medium transition-colors border-b border-white/10 last:border-0 ${
            zoomLevel === z
              ? 'bg-orange-500/20 text-orange-300'
              : 'bg-panel-700 text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {z}×
        </button>
      ))}
    </div>
  );
}
