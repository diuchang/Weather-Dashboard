import CurrentWeather from './CurrentWeather';
import CitySelector from './CitySelector';
import TodaySummary from './TodaySummary';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';
import ClimateSeasons from './ClimateSeasons';
import RainSunCalendar from './RainSunCalendar';
import YearAtAGlance from './YearAtAGlance';

export default function LeftPanel() {
  return (
    <div className="w-full h-full flex flex-col overflow-y-auto bg-navy-900">
      <div className="flex flex-col gap-3 p-4">
        <CitySelector />
        <CurrentWeather />
        <TodaySummary />
        <HourlyForecast />
        <DailyForecast />
        <ClimateSeasons />
        <RainSunCalendar />
        <YearAtAGlance />
      </div>
    </div>
  );
}
