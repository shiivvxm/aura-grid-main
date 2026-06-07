import { useState, useEffect, useCallback, useRef } from 'react';
import {
  generateMetrics, generateTimeSeries, generateAlert, generateWeather,
  generateZones, getWeeklyForecast, getRecommendations, type EnergyMetrics, type TimeSeriesPoint, type Alert, type WeatherData, type Zone,
} from '@/services/mockData';

export function useRealtimeData(interval = 3000) {
  const [metrics, setMetrics] = useState<EnergyMetrics>(generateMetrics());
  const [timeSeries, setTimeSeries] = useState<TimeSeriesPoint[]>(generateTimeSeries());
  const [alerts, setAlerts] = useState<Alert[]>([generateAlert(), generateAlert(), generateAlert()]);
  const [weather, setWeather] = useState<WeatherData>(generateWeather());
  const [zones, setZones] = useState<Zone[]>(generateZones());
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [weeklyForecast] = useState(getWeeklyForecast());
  const recommendations = getRecommendations();
  const intervalRef = useRef<number>();

  const runOptimization = useCallback(() => {
    setIsOptimizing(true);
    setTimeout(() => setIsOptimizing(false), 10000);
  }, []);

  const update = useCallback(() => {
    let newMetrics = generateMetrics();
    if (isOptimizing) {
      newMetrics = {
        ...newMetrics,
        riskScore: newMetrics.riskScore * 0.4,
        overloadProbability: newMetrics.overloadProbability * 0.3,
        blackoutRisk: newMetrics.blackoutRisk * 0.2,
        efficiency: Math.min(99, newMetrics.efficiency * 1.2),
        renewablePercent: Math.min(100, newMetrics.renewablePercent * 1.15),
        confidencePercent: Math.min(100, newMetrics.confidencePercent * 1.1),
      };
    }
    setMetrics(newMetrics);

    setTimeSeries(prev => {
      const next = [...prev.slice(1)];
      const now = new Date();
      const base = 40 + Math.sin(now.getHours() / 4) * 20;

      let actual = base + (Math.random() - 0.5) * 10;
      let predicted = base + (Math.random() - 0.5) * 6;

      if (isOptimizing) {
        // Optimized state: Actual follows predicted more closely
        actual = predicted + (Math.random() - 0.5) * 2;
      }

      next.push({
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        actual,
        predicted,
        solar: Math.max(0, 15 + Math.sin((now.getHours() - 6) / 3) * 15 + (Math.random() - 0.5) * 4),
        household: 2 + Math.random() * 3,
        grid: actual + (Math.random() - 0.5) * 5,
      });
      return next;
    });

    if (Math.random() > 0.6 && !isOptimizing) {
      setAlerts(prev => [generateAlert(), ...prev].slice(0, 8));
    }
    setZones(generateZones());
  }, [isOptimizing]);

  useEffect(() => {
    intervalRef.current = window.setInterval(update, interval);
    const weatherInterval = window.setInterval(() => setWeather(generateWeather()), 15000);
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(weatherInterval);
    };
  }, [update, interval]);

  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  return { metrics, timeSeries, alerts, weather, zones, removeAlert, isOptimizing, runOptimization, weeklyForecast, recommendations };
}
