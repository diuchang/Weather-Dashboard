import { useDashboardStore } from '../../store/dashboardStore';
import { useWeather } from '../../hooks/useWeather';
import { getWeatherInfo } from '../../utils/weatherCodes';
import WeatherIcon from '../shared/WeatherIcon';
import LoadingSpinner from '../shared/LoadingSpinner';
import { WiHumidity, WiStrongWind } from 'react-icons/wi';

export default function CurrentWeather() {
  const city = useDashboardStore((s) => s.selectedCity);
  const currentHour = useDashboardStore((s) => s.currentHour);
  const { data, loading } = useWeather(city);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 rounded-xl bg-panel-800 border border-white/5">
        <LoadingSpinner size={28} />
      </div>
    );
  }

  const h = data?.hourly;
  const temp = h ? Math.round(h.temperature_2m[currentHour]) : '--';
  const humidity = h ? Math.round(h.relative_humidity_2m[currentHour]) : '--';
  const wind = h ? Math.round(h.wind_speed_10m[currentHour]) : '--';
  const code = h?.weather_code[currentHour] ?? 0;
  const info = getWeatherInfo(code);

  return (
    <div className="rounded-xl bg-gradient-to-br from-panel-700 to-navy-900 border border-white/5 p-5">
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Current Weather</p>
          <h2 className="text-xl font-semibold text-white leading-tight">{city.name}</h2>
        </div>
        <WeatherIcon icon={info.icon} size={52} className="text-sky-300 -mt-1" />
      </div>

      <div className="flex items-end gap-3 mt-3 mb-4">
        <span className="text-6xl font-bold text-white leading-none">{temp}</span>
        <span className="text-2xl text-slate-400 mb-2">°C</span>
      </div>

      <p className="text-sm text-slate-300 mb-4">{info.label}</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
          <WiHumidity size={22} className="text-blue-400" />
          <div>
            <p className="text-xs text-slate-400">Humidity</p>
            <p className="text-sm font-medium text-white">{humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
          <WiStrongWind size={22} className="text-teal-400" />
          <div>
            <p className="text-xs text-slate-400">Wind</p>
            <p className="text-sm font-medium text-white">{wind} km/h</p>
          </div>
        </div>
      </div>
    </div>
  );
}
