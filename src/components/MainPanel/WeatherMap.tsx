import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { useDashboardStore } from '../../store/dashboardStore';
import type { MapMode } from '../../store/dashboardStore';
import { useThemeStore } from '../../store/themeStore';
import { useAllCitiesWeather } from '../../hooks/useAllCitiesWeather';
import { CITIES } from '../../data/cities';
import { getLayerColor, formatLayerValue } from '../../utils/colorScales';
import type { WeatherLayer, WeatherResponse } from '../../types';
import LoadingSpinner from '../shared/LoadingSpinner';
import ZoomControls from './ZoomControls';
import LayerSelector from './LayerSelector';
import ColorLegend from './ColorLegend';
import MapModeSelector from './MapModeSelector';

const VIETNAM_CENTER: [number, number] = [16.5, 107.5];
const BASE_ZOOM = 6;
const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const LIGHT_TILES = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

function getLayerValue(
  hourly: WeatherResponse['hourly'],
  layer: WeatherLayer,
  hour: number
): number {
  switch (layer) {
    case 'temperature': return hourly.temperature_2m[hour] ?? 0;
    case 'rain': return hourly.precipitation[hour] ?? 0;
    case 'wind': return hourly.wind_speed_10m[hour] ?? 0;
    case 'humidity': return hourly.relative_humidity_2m[hour] ?? 0;
  }
}

function ZoomController() {
  const map = useMap();
  const zoomLevel = useDashboardStore((s) => s.zoomLevel);
  useEffect(() => {
    map.setZoom(Math.round(BASE_ZOOM * zoomLevel));
  }, [zoomLevel, map]);
  return null;
}

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);
  return null;
}

interface MapMarkersProps {
  cityData: Map<string, WeatherResponse>;
}

const MODE_STYLES: Record<MapMode, (color: string) => L.CircleMarkerOptions> = {
  circles: (color) => ({
    radius: 9,
    fillColor: color,
    fillOpacity: 0.9,
    color: '#0a0f1e',
    weight: 1.5,
    stroke: true,
  }),
  color: (color) => ({
    radius: 26,
    fillColor: color,
    fillOpacity: 0.4,
    stroke: false,
    weight: 0,
  }),
  dots: (color) => ({
    radius: 4,
    fillColor: color,
    fillOpacity: 1,
    stroke: false,
    weight: 0,
  }),
};

function MapMarkers({ cityData }: MapMarkersProps) {
  const map = useMap();
  const weatherLayer = useDashboardStore((s) => s.weatherLayer);
  const currentHour = useDashboardStore((s) => s.currentHour);
  const mapMode = useDashboardStore((s) => s.mapMode);
  const setSelectedCity = useDashboardStore((s) => s.setSelectedCity);
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());

  useEffect(() => {
    const markers = markersRef.current;
    CITIES.forEach((city) => {
      if (!markers.has(city.id)) {
        const marker = L.circleMarker([city.lat, city.lon], {
          radius: 9,
          fillColor: '#3b82f6',
          fillOpacity: 0.9,
          color: '#0a0f1e',
          weight: 1.5,
        });
        marker.on('click', () => setSelectedCity(city));
        marker.addTo(map);
        markers.set(city.id, marker);
      }
    });
    return () => {
      markers.forEach((m) => m.remove());
      markers.clear();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => {
    const markers = markersRef.current;
    CITIES.forEach((city) => {
      const marker = markers.get(city.id);
      if (!marker) return;
      const data = cityData.get(city.id);
      if (!data) return;
      const value = getLayerValue(data.hourly, weatherLayer, currentHour);
      const color = getLayerColor(weatherLayer, value);
      const label = formatLayerValue(weatherLayer, value);
      marker.setStyle(MODE_STYLES[mapMode](color));
      marker.unbindTooltip();
      marker.bindTooltip(`<strong>${city.name}</strong><br/>${label}`, {
        permanent: false,
        direction: 'top',
        offset: [0, -10],
      });
    });
  }, [cityData, weatherLayer, currentHour, mapMode]);

  return null;
}

export default function WeatherMap() {
  const { cityData, loading } = useAllCitiesWeather();
  const [geoData, setGeoData] = useState<GeoJSON.FeatureCollection | null>(null);
  const theme = useThemeStore((s) => s.theme);
  const isLight = theme === 'light';

  useEffect(() => {
    fetch('/vietnam-provinces.geojson')
      .then((r) => r.json())
      .then((d: GeoJSON.FeatureCollection) => setGeoData(d))
      .catch(() => {});
  }, []);

  const geoStyle: L.PathOptions = isLight
    ? { color: '#d6d0c0', weight: 1, fillColor: '#f4f1e9', fillOpacity: 0.4 }
    : { color: '#1e2d4a', weight: 1, fillColor: '#0d1526', fillOpacity: 0.4 };

  return (
    <div className="relative w-full h-full">
      {loading && cityData.size === 0 && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-navy-800/90 border border-white/10 rounded-full px-3 py-1.5">
          <LoadingSpinner size={14} />
          <span className="text-xs text-slate-300">Loading weather data...</span>
        </div>
      )}
      <MapContainer
        center={VIETNAM_CENTER}
        zoom={BASE_ZOOM}
        className="w-full h-full"
        zoomControl={false}
        scrollWheelZoom={true}
        style={{ background: isLight ? '#f4f1e9' : '#060b17' }}
      >
        <TileLayer
          key={theme}
          url={isLight ? LIGHT_TILES : DARK_TILES}
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        {geoData && <GeoJSON data={geoData} style={geoStyle} />}
        <MapMarkers cityData={cityData} />
        <ZoomController />
        <MapResizer />
      </MapContainer>
      <div className="absolute left-3 top-3 z-[1000]">
        <MapModeSelector />
      </div>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-[1000]">
        <ZoomControls />
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-3">
        <LayerSelector />
        <ColorLegend />
      </div>
    </div>
  );
}
