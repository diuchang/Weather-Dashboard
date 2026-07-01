import { useDashboardStore } from '../../store/dashboardStore';
import { getLayerGradient, getLayerRange } from '../../utils/colorScales';
import type { WeatherLayer } from '../../types';

const LAYER_LABELS: Record<WeatherLayer, string> = {
  temperature: 'Temperature',
  rain: 'Precipitation',
  wind: 'Wind Speed',
  humidity: 'Humidity',
};

export default function ColorLegend() {
  const weatherLayer = useDashboardStore((s) => s.weatherLayer);
  const { min, max, unit } = getLayerRange(weatherLayer);
  const gradient = getLayerGradient(weatherLayer);

  return (
    <div className="flex items-center gap-2 rounded-lg bg-panel-700 border border-white/10 px-3 py-2">
      <span className="text-xs text-slate-400 mr-1">{LAYER_LABELS[weatherLayer]}</span>
      <span className="text-xs text-slate-500">{min}{unit}</span>
      <div
        className="w-24 h-2.5 rounded-full flex-none"
        style={{ background: gradient }}
      />
      <span className="text-xs text-slate-500">{max}{unit}</span>
    </div>
  );
}
