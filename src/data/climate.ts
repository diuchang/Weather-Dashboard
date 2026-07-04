import type { City } from '../types';

export interface MonthlyClimate {
  tempAvg: number;   // °C
  humidity: number;  // %
  rainfall: number;  // mm
  rainDays: number;  // days with measurable rain
}

// Climate normals (approximate) by region, index 0–11 = Jan–Dec
const CLIMATE: Record<string, MonthlyClimate[]> = {
  north: [
    { tempAvg: 17, humidity: 80, rainfall: 18,  rainDays: 8 },
    { tempAvg: 18, humidity: 83, rainfall: 26,  rainDays: 11 },
    { tempAvg: 21, humidity: 87, rainfall: 44,  rainDays: 15 },
    { tempAvg: 24, humidity: 87, rainfall: 90,  rainDays: 13 },
    { tempAvg: 28, humidity: 83, rainfall: 189, rainDays: 14 },
    { tempAvg: 30, humidity: 82, rainfall: 240, rainDays: 15 },
    { tempAvg: 30, humidity: 83, rainfall: 288, rainDays: 16 },
    { tempAvg: 29, humidity: 85, rainfall: 318, rainDays: 17 },
    { tempAvg: 28, humidity: 84, rainfall: 265, rainDays: 14 },
    { tempAvg: 26, humidity: 82, rainfall: 131, rainDays: 9 },
    { tempAvg: 22, humidity: 79, rainfall: 43,  rainDays: 6 },
    { tempAvg: 18, humidity: 78, rainfall: 20,  rainDays: 5 },
  ],
  central: [
    { tempAvg: 21, humidity: 84, rainfall: 96,  rainDays: 14 },
    { tempAvg: 22, humidity: 83, rainfall: 33,  rainDays: 7 },
    { tempAvg: 24, humidity: 83, rainfall: 22,  rainDays: 5 },
    { tempAvg: 26, humidity: 82, rainfall: 27,  rainDays: 6 },
    { tempAvg: 28, humidity: 79, rainfall: 63,  rainDays: 8 },
    { tempAvg: 29, humidity: 76, rainfall: 87,  rainDays: 8 },
    { tempAvg: 29, humidity: 75, rainfall: 85,  rainDays: 9 },
    { tempAvg: 29, humidity: 76, rainfall: 103, rainDays: 11 },
    { tempAvg: 27, humidity: 82, rainfall: 350, rainDays: 15 },
    { tempAvg: 26, humidity: 85, rainfall: 612, rainDays: 21 },
    { tempAvg: 24, humidity: 85, rainfall: 366, rainDays: 21 },
    { tempAvg: 22, humidity: 85, rainfall: 199, rainDays: 18 },
  ],
  south: [
    { tempAvg: 26, humidity: 72, rainfall: 14,  rainDays: 2 },
    { tempAvg: 27, humidity: 70, rainfall: 4,   rainDays: 1 },
    { tempAvg: 28, humidity: 70, rainfall: 12,  rainDays: 2 },
    { tempAvg: 29, humidity: 72, rainfall: 42,  rainDays: 5 },
    { tempAvg: 29, humidity: 79, rainfall: 220, rainDays: 18 },
    { tempAvg: 28, humidity: 82, rainfall: 331, rainDays: 22 },
    { tempAvg: 28, humidity: 83, rainfall: 313, rainDays: 23 },
    { tempAvg: 28, humidity: 83, rainfall: 267, rainDays: 22 },
    { tempAvg: 27, humidity: 84, rainfall: 334, rainDays: 23 },
    { tempAvg: 27, humidity: 83, rainfall: 268, rainDays: 21 },
    { tempAvg: 27, humidity: 79, rainfall: 115, rainDays: 12 },
    { tempAvg: 26, humidity: 75, rainfall: 56,  rainDays: 6 },
  ],
};

export function getClimateForCity(city: City): MonthlyClimate[] {
  return CLIMATE[city.region];
}

export type SeasonType = 'hot-humid' | 'rainy' | 'cool' | 'mild';

export interface SeasonMeta {
  label: string;
  color: string;
}

export const SEASON_META: Record<SeasonType, SeasonMeta> = {
  'hot-humid': { label: 'Hot & humid', color: '#EEA530' },
  rainy:       { label: 'Rainy', color: '#33449C' },
  cool:        { label: 'Cool', color: '#18C5CC' },
  mild:        { label: 'Mild', color: '#7BC367' },
};

export function classifySeason(m: MonthlyClimate): SeasonType {
  if (m.rainfall >= 200) return 'rainy';
  if (m.tempAvg <= 20) return 'cool';
  if (m.tempAvg >= 27 && m.humidity >= 80) return 'hot-humid';
  return 'mild';
}

export const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
