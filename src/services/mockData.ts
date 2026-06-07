// Mock data generators for real-time simulation

const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const randInt = (min: number, max: number) => Math.floor(rand(min, max));

export interface EnergyMetrics {
  householdLoad: number;
  solarGeneration: number;
  gridLoad: number;
  peakDemand: number;
  efficiency: number;
  renewablePercent: number;
  co2Saved: number;
  riskScore: number;
  theftProbability: number;
  confidencePercent: number;
  overloadProbability: number;
  blackoutRisk: number;
  currentCost: number;
  estimatedMonthlyCost: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  action: string;
  impact: 'high' | 'medium' | 'low';
}

export interface TimeSeriesPoint {
  time: string;
  actual: number;
  predicted: number;
  solar: number;
  household: number;
  grid: number;
}

export interface Alert {
  id: string;
  type: 'overload' | 'blackout' | 'theft' | 'warning';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
}

export interface WeatherData {
  temperature: number;
  cloudCover: number;
  windSpeed: number;
  humidity: number;
  condition: string;
}

export interface Zone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  load: number;
  status: 'safe' | 'medium' | 'danger';
  theftRisk: boolean;
  faults: number;
}

export const generateMetrics = (): EnergyMetrics => ({
  householdLoad: rand(2.1, 4.8),
  solarGeneration: rand(1.2, 3.5),
  gridLoad: rand(45, 85),
  peakDemand: rand(70, 95),
  efficiency: rand(78, 96),
  renewablePercent: rand(35, 65),
  co2Saved: rand(120, 350),
  riskScore: rand(10, 80),
  theftProbability: rand(5, 45),
  confidencePercent: rand(82, 98),
  overloadProbability: rand(5, 60),
  blackoutRisk: rand(2, 40),
  currentCost: rand(12, 45),
  estimatedMonthlyCost: rand(450, 1200),
});

export const getWeeklyForecast = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    name: day,
    demand: rand(60, 95),
    solar: rand(20, 50),
  }));
};

export const getRecommendations = (): Recommendation[] => [
  {
    id: 'r1',
    title: 'Switch to Solar',
    description: 'Solar generation is at peak. Switch heavy appliances to solar power to maximize efficiency.',
    action: 'Switch to Solar',
    impact: 'high',
  },
  {
    id: 'r2',
    title: 'Reduce Grid Load',
    description: 'Grid load is approaching threshold. Suggest reducing non-essential industrial load immediately.',
    action: 'Reduce Load',
    impact: 'high',
  },
  {
    id: 'r3',
    title: 'Optimize Distribution',
    description: 'Low demand period in residential zones. Initialize storage pre-charge sequence.',
    action: 'Optimize Now',
    impact: 'medium',
  },
  {
    id: 'r4',
    title: 'Shift Demand',
    description: 'Predicted peak in commercial sector. Propose shifting laundry to off-peak hours.',
    action: 'Shift Load',
    impact: 'low',
  },
];

export const generateTimeSeries = (count: number = 24): TimeSeriesPoint[] => {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const time = new Date(now.getTime() - (count - i) * 3600000);
    const base = 40 + Math.sin(i / 4) * 20;
    return {
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actual: base + rand(-5, 5),
      predicted: base + rand(-3, 3),
      solar: Math.max(0, 15 + Math.sin((i - 6) / 3) * 15 + rand(-2, 2)),
      household: rand(2, 5),
      grid: base + rand(-8, 8),
    };
  });
};

const alertMessages = [
  { type: 'overload' as const, title: 'Grid Overload Warning', message: 'Zone A3 approaching capacity limit', severity: 'high' as const },
  { type: 'theft' as const, title: 'Theft Alert', message: 'Anomalous consumption in Sector 7', severity: 'critical' as const },
  { type: 'blackout' as const, title: 'Blackout Risk', message: 'Transformer T4 temperature elevated', severity: 'high' as const },
  { type: 'warning' as const, title: 'Maintenance Required', message: 'Solar panel efficiency below threshold', severity: 'medium' as const },
  { type: 'warning' as const, title: 'Peak Demand Alert', message: 'Expected surge in 30 minutes', severity: 'medium' as const },
  { type: 'overload' as const, title: 'Voltage Fluctuation', message: 'Unstable voltage detected in Zone B1', severity: 'low' as const },
];

export const generateAlert = (): Alert => {
  const template = alertMessages[randInt(0, alertMessages.length)];
  return {
    id: Math.random().toString(36).slice(2, 9),
    ...template,
    timestamp: new Date(),
  };
};

export const generateWeather = (): WeatherData => ({
  temperature: randInt(18, 35),
  cloudCover: randInt(10, 90),
  windSpeed: rand(2, 25),
  humidity: randInt(30, 80),
  condition: ['Clear', 'Partly Cloudy', 'Cloudy', 'Windy'][randInt(0, 4)],
});

export const generateZones = (): Zone[] => [
  { id: 'z1', name: 'Downtown Core', lat: 40.7128, lng: -74.006, load: rand(60, 95), status: rand(0, 1) > 0.7 ? 'danger' : 'safe', theftRisk: rand(0, 1) > 0.8, faults: randInt(0, 3) },
  { id: 'z2', name: 'Industrial Park', lat: 40.7282, lng: -73.994, load: rand(50, 90), status: rand(0, 1) > 0.6 ? 'medium' : 'safe', theftRisk: rand(0, 1) > 0.7, faults: randInt(0, 5) },
  { id: 'z3', name: 'Residential North', lat: 40.7489, lng: -73.968, load: rand(30, 70), status: 'safe', theftRisk: false, faults: 0 },
  { id: 'z4', name: 'Commercial District', lat: 40.7549, lng: -73.984, load: rand(55, 85), status: rand(0, 1) > 0.5 ? 'medium' : 'safe', theftRisk: rand(0, 1) > 0.85, faults: randInt(0, 2) },
  { id: 'z5', name: 'Solar Farm East', lat: 40.7214, lng: -73.950, load: rand(20, 50), status: 'safe', theftRisk: false, faults: 0 },
  { id: 'z6', name: 'Suburban West', lat: 40.7359, lng: -74.025, load: rand(35, 65), status: rand(0, 1) > 0.7 ? 'danger' : 'medium', theftRisk: rand(0, 1) > 0.75, faults: randInt(0, 4) },
];

export const zoneBarData = () => {
  const zones = ['Downtown', 'Industrial', 'Residential', 'Commercial', 'Solar Farm', 'Suburban'];
  return zones.map(name => ({
    name,
    consumption: rand(30, 90),
    generation: rand(10, 45),
  }));
};

export const carbonData = () =>
  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => ({
    month,
    saved: rand(80, 200),
    emitted: rand(40, 120),
  }));

export const renewableVsFossil = () => {
  const renewable = rand(35, 65);
  return [
    { name: 'Renewable', value: renewable, fill: 'hsl(142, 71%, 45%)' },
    { name: 'Fossil', value: 100 - renewable, fill: 'hsl(215, 20%, 35%)' },
  ];
};
