import { create } from 'zustand';
import { addDays, startOfDay } from 'date-fns';
import type { City, WeatherLayer } from '../types';
import { CITIES } from '../data/cities';

export type TimelineView = 'day' | 'month' | 'year';
export type MapMode = 'color' | 'circles' | 'dots';

interface DashboardState {
  selectedCity: City;
  selectedDate: Date;
  dateRange: [Date, Date];
  weatherLayer: WeatherLayer;
  isPlaying: boolean;
  currentHour: number;
  zoomLevel: 0.5 | 1 | 2;
  timelineView: TimelineView;
  mapMode: MapMode;

  setSelectedCity: (city: City) => void;
  setSelectedDate: (date: Date) => void;
  setDateRange: (range: [Date, Date]) => void;
  setWeatherLayer: (layer: WeatherLayer) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentHour: (hour: number) => void;
  setZoomLevel: (zoom: 0.5 | 1 | 2) => void;
  setTimelineView: (view: TimelineView) => void;
  setMapMode: (mode: MapMode) => void;
}

const today = startOfDay(new Date());

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedCity: CITIES[0],
  selectedDate: today,
  dateRange: [today, addDays(today, 6)],
  weatherLayer: 'temperature',
  isPlaying: false,
  currentHour: new Date().getHours(),
  zoomLevel: 1,
  timelineView: 'day',
  mapMode: 'circles',

  setSelectedCity: (city) => set({ selectedCity: city }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setDateRange: (range) => set({ dateRange: range }),
  setWeatherLayer: (layer) => set({ weatherLayer: layer }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentHour: (hour) => set({ currentHour: hour }),
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
  setTimelineView: (view) => set({ timelineView: view }),
  setMapMode: (mode) => set({ mapMode: mode }),
}));
