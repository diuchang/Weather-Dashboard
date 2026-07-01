import {
  WiDaySunny,
  WiDayCloudy,
  WiCloud,
  WiFog,
  WiSprinkle,
  WiRain,
  WiRainMix,
  WiSnow,
  WiShowers,
  WiThunderstorm,
} from 'react-icons/wi';

interface Props {
  icon: string;
  size?: number;
  className?: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  sun: WiDaySunny,
  'cloud-sun': WiDayCloudy,
  cloud: WiCloud,
  fog: WiFog,
  drizzle: WiSprinkle,
  rain: WiRain,
  'rain-heavy': WiRainMix,
  snow: WiSnow,
  showers: WiShowers,
  thunder: WiThunderstorm,
};

export default function WeatherIcon({ icon, size = 32, className = '' }: Props) {
  const Icon = ICON_MAP[icon] ?? WiCloud;
  return <Icon size={size} className={className} />;
}
