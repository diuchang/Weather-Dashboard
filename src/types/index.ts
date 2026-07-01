export interface City {
  id: string;
  name: string;
  lat: number;
  lon: number;
  region: 'north' | 'central' | 'south';
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation: number[];
    wind_speed_10m: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
}

export interface GeoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
  admin2?: string;
  elevation?: number;
  timezone?: string;
}

export type WeatherLayer = 'temperature' | 'rain' | 'wind' | 'humidity';
