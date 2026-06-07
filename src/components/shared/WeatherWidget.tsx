import { Cloud, Wind, Droplets, Thermometer } from 'lucide-react';
import { motion } from 'framer-motion';
import type { WeatherData } from '@/services/mockData';

interface Props {
  weather: WeatherData;
}

export default function WeatherWidget({ weather }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="glass-card"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <Cloud className="w-4 h-4 text-primary" />
        Weather Conditions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Thermometer className="w-4 h-4 text-destructive" />
          <span className="text-muted-foreground">Temp</span>
          <span className="ml-auto text-foreground font-medium">{weather.temperature}°C</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Cloud className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Cloud</span>
          <span className="ml-auto text-foreground font-medium">{weather.cloudCover}%</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Wind className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Wind</span>
          <span className="ml-auto text-foreground font-medium">{weather.windSpeed.toFixed(1)} km/h</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Droplets className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Humidity</span>
          <span className="ml-auto text-foreground font-medium">{weather.humidity}%</span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground text-center">
        {weather.condition}
      </div>
    </motion.div>
  );
}
