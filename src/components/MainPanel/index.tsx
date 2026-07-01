import SearchBar from './SearchBar';
import DateRangePicker from './DateRangePicker';
import LayerSelector from './LayerSelector';
import TimelinePlayback from './TimelinePlayback';
import ZoomControls from './ZoomControls';
import ColorLegend from './ColorLegend';
import WeatherMap from './WeatherMap';

export default function MainPanel() {
  return (
    <div className="flex-1 flex flex-col h-full bg-navy-800 p-4 gap-3 overflow-hidden min-w-0">
      {/* Top toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <SearchBar />
        <DateRangePicker />
        <div className="flex-1" />
        <LayerSelector />
      </div>

      {/* Timeline + zoom */}
      <div className="flex items-center gap-3">
        <TimelinePlayback />
        <ZoomControls />
        <ColorLegend />
      </div>

      {/* Map */}
      <div className="flex-1 rounded-xl overflow-hidden border border-white/5 min-h-0">
        <WeatherMap />
      </div>
    </div>
  );
}
