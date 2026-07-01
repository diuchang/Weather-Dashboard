import { useDashboardStore } from '../../store/dashboardStore';
import { useWeather } from '../../hooks/useWeather';
import { getWeatherInfo } from '../../utils/weatherCodes';
import LoadingSpinner from '../shared/LoadingSpinner';
import { HiOutlineSparkles } from 'react-icons/hi';

function tempWord(t: number) {
  if (t < 18) return 'cold';
  if (t < 24) return 'cool';
  if (t < 30) return 'warm';
  if (t < 34) return 'hot';
  return 'very hot';
}

function humidityWord(h: number) {
  if (h < 50) return 'dry';
  if (h < 70) return 'comfortable';
  if (h < 85) return 'humid';
  return 'very humid';
}

function rainWord(mm: number) {
  if (mm < 0.2) return 'no rain expected';
  if (mm < 5) return 'a bit of light rain';
  if (mm < 20) return 'moderate rain';
  return 'heavy rain';
}

function windWord(w: number) {
  if (w < 10) return 'calm';
  if (w < 25) return 'a light breeze';
  if (w < 40) return 'windy';
  return 'strong winds';
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
  const condition = getWeatherInfo(data.daily.weather_code[0]).label.toLowerCase();

  return (
    <div className="rounded-xl bg-gradient-to-br from-panel-700 to-navy-900 border border-white/5 p-4">
      <div className="flex items-center gap-2 mb-2">
        <HiOutlineSparkles size={14} className="text-blue-300" />
        <p className="text-xs text-slate-400 uppercase tracking-widest">Today in {city.name}</p>
      </div>

      <p className="text-sm text-slate-300 leading-relaxed">
        Expect <span className="text-orange-300 font-medium">{tempWord(temp)}</span> weather
        with {condition} skies, currently around{' '}
        <span className="text-orange-300 font-medium">{temp}°C</span>{' '}
        (high <span className="text-orange-300">{max}°</span>, low{' '}
        <span className="text-slate-400">{min}°</span>). The air feels{' '}
        <span className="text-purple-300 font-medium">{humidityWord(humidity)}</span> at{' '}
        <span className="text-purple-300 font-medium">{humidity}%</span> humidity, with{' '}
        <span className="text-blue-300 font-medium">{rainWord(precip)}</span>
        {precip >= 0.2 && (
          <> (<span className="text-blue-300">{precip.toFixed(1)} mm</span>)</>
        )}
        . Winds are <span className="text-teal-300 font-medium">{windWord(wind)}</span> at{' '}
        <span className="text-teal-300 font-medium">{wind} km/h</span>.
      </p>
    </div>
  );
}
