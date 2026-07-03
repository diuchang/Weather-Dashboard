import TimelinePlayback from './TimelinePlayback';
import WeatherMap from './WeatherMap';

export default function MainPanel() {
  return (
    <div className="flex-1 flex flex-col h-full bg-navy-800 p-4 gap-3 overflow-hidden min-w-0">
      {/* Timeline */}
      <TimelinePlayback />

      {/* Map */}
      <div className="flex-1 rounded-xl overflow-hidden border border-white/5 min-h-0">
        <WeatherMap />
      </div>
    </div>
  );
}
