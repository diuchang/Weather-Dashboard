export interface WeatherInfo {
  label: string;
  icon: string;
}

export const WMO_CODES: Record<number, WeatherInfo> = {
  0:  { label: 'Clear sky', icon: 'sun' },
  1:  { label: 'Mainly clear', icon: 'sun' },
  2:  { label: 'Partly cloudy', icon: 'cloud-sun' },
  3:  { label: 'Overcast', icon: 'cloud' },
  45: { label: 'Foggy', icon: 'fog' },
  48: { label: 'Icy fog', icon: 'fog' },
  51: { label: 'Light drizzle', icon: 'drizzle' },
  53: { label: 'Moderate drizzle', icon: 'drizzle' },
  55: { label: 'Dense drizzle', icon: 'drizzle' },
  56: { label: 'Freezing drizzle', icon: 'drizzle' },
  57: { label: 'Heavy freezing drizzle', icon: 'drizzle' },
  61: { label: 'Slight rain', icon: 'rain' },
  63: { label: 'Moderate rain', icon: 'rain' },
  65: { label: 'Heavy rain', icon: 'rain-heavy' },
  66: { label: 'Light freezing rain', icon: 'rain' },
  67: { label: 'Heavy freezing rain', icon: 'rain-heavy' },
  71: { label: 'Slight snow', icon: 'snow' },
  73: { label: 'Moderate snow', icon: 'snow' },
  75: { label: 'Heavy snow', icon: 'snow' },
  77: { label: 'Snow grains', icon: 'snow' },
  80: { label: 'Slight showers', icon: 'showers' },
  81: { label: 'Moderate showers', icon: 'showers' },
  82: { label: 'Violent showers', icon: 'showers' },
  85: { label: 'Slight snow showers', icon: 'snow' },
  86: { label: 'Heavy snow showers', icon: 'snow' },
  95: { label: 'Thunderstorm', icon: 'thunder' },
  96: { label: 'Thunderstorm w/ hail', icon: 'thunder' },
  99: { label: 'Thunderstorm w/ heavy hail', icon: 'thunder' },
};

export function getWeatherInfo(code: number): WeatherInfo {
  return WMO_CODES[code] ?? { label: 'Unknown', icon: 'cloud' };
}
