import { useDashboardStore } from '../../store/dashboardStore';
import type { WeatherLayer } from '../../types';
import { WiThermometer, WiRain, WiStrongWind, WiHumidity } from 'react-icons/wi';

const LAYERS: { key: WeatherLayer; label: string; Icon: React.ComponentType<{ size?: number; className?: string }>; activeClass: string }[] = [
  { key: 'temperature', label: 'Temp', Icon: WiThermometer, activeClass: 'bg-orange-500/20 border-orange-500/40 text-orange-300' },
  { key: 'rain', label: 'Rain', Icon: WiRain, activeClass: 'bg-blue-500/20 border-blue-500/40 text-blue-300' },
  { key: 'wind', label: 'Wind', Icon: WiStrongWind, activeClass: 'bg-teal-500/20 border-teal-500/40 text-teal-300' },
  { key: 'humidity', label: 'Humidity', Icon: WiHumidity, activeClass: 'bg-purple-500/20 border-purple-500/40 text-purple-300' },
];

export default function LayerSelector() {
  const weatherLayer = useDashboardStore((s) => s.weatherLayer);
  const setWeatherLayer = useDashboardStore((s) => s.setWeatherLayer);

  return (
    <div className="flex gap-1">
      {LAYERS.map(({ key, label, Icon, activeClass }) => (
        <button
          key={key}
          onClick={() => setWeatherLayer(key)}
          className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
            weatherLayer === key
              ? activeClass
              : 'bg-panel-700 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
          }`}
        >
          <Icon size={16} />
          {label}
        </button>
      ))}
    </div>
  );
}
