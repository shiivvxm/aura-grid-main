import { useRealtimeData } from '@/hooks/useRealtimeData';
import MetricCard from '@/components/shared/MetricCard';
import AlertPanel from '@/components/shared/AlertPanel';
import WeatherWidget from '@/components/shared/WeatherWidget';
import ChartContainer from '@/components/shared/ChartContainer';
import RiskGauge from '@/components/shared/RiskGauge';
import { Zap, Sun, Gauge, Leaf, ShieldCheck, TrendingUp } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar,
} from 'recharts';
import { motion } from 'framer-motion';
import { useState } from 'react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card-sm text-xs">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value.toFixed(1)} MW
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { metrics, timeSeries, alerts, weather, removeAlert, weeklyForecast } = useRealtimeData();
  const [timeframe, setTimeframe] = useState('Day');

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Household Load" value={metrics.householdLoad} unit="kW" icon={Zap} color="primary" trend="up" delay={0} />
        <MetricCard title="Solar Generation" value={metrics.solarGeneration} unit="kW" icon={Sun} color="energy" trend="up" delay={1} />
        <MetricCard title="Estimated Cost" value={metrics.currentCost} unit="USD" icon={TrendingUp} color="warning" delay={2} />
        <MetricCard title="Renewable Mix" value={metrics.renewablePercent} unit="%" icon={Leaf} color="energy" trend="up" delay={3} />
      </div>

      {/* Main chart + alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartContainer
          title="Load Analytics"
          subtitle={timeframe === 'Day' ? "Actual vs Predicted (MW)" : `${timeframe}ly consumption trend`}
          className="lg:col-span-2"
          delay={4}
          action={
            <div className="flex bg-accent/30 rounded-lg p-0.5">
              {['Day', 'Week', 'Month'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${timeframe === t ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={280}>
            {timeframe === 'Day' ? (
              <AreaChart data={timeSeries}>
                <defs>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" vertical={false} />
                <XAxis dataKey="time" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12, color: 'hsl(215, 20%, 55%)' }} />
                <Area type="monotone" dataKey="actual" stroke="hsl(199, 89%, 48%)" fill="url(#actualGrad)" strokeWidth={2} name="Actual Load" />
                <Area type="monotone" dataKey="predicted" stroke="hsl(142, 71%, 45%)" fill="url(#predictedGrad)" strokeWidth={2} strokeDasharray="4 4" name="AI Predicted" />
              </AreaChart>
            ) : (
              <BarChart data={timeframe === 'Week' ? weeklyForecast : [
                { name: 'Week 1', demand: 450 },
                { name: 'Week 2', demand: 520 },
                { name: 'Week 3', demand: 480 },
                { name: 'Week 4', demand: 610 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '12px' }} />
                <Bar dataKey="demand" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} name="Consumption MW" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </ChartContainer>

        <AlertPanel alerts={alerts} onDismiss={removeAlert} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <WeatherWidget weather={weather} />

        {/* Sustainability card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card flex flex-col items-center justify-center gap-4"
        >
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Leaf className="w-4 h-4 text-energy" /> Sustainability Impact
          </h3>
          <div className="flex gap-6">
            <RiskGauge value={metrics.renewablePercent} label="Renewable %" color="energy" />
            <RiskGauge value={metrics.efficiency} label="Efficiency" color="primary" />
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">
              <span className="text-energy font-semibold">{metrics.co2Saved.toFixed(0)} kg</span> CO₂ saved today
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              Est. Monthly: <span className="text-primary">${metrics.estimatedMonthlyCost.toFixed(0)}</span>
            </p>
          </div>
        </motion.div>

        {/* Risk overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card flex flex-col items-center justify-center gap-4"
        >
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Risk Overview
          </h3>
          <div className="flex gap-6">
            <RiskGauge
              value={metrics.riskScore}
              label="Grid Risk"
              color={metrics.riskScore > 60 ? 'destructive' : metrics.riskScore > 35 ? 'warning' : 'energy'}
            />
            <RiskGauge
              value={metrics.theftProbability}
              label="Theft Risk"
              color={metrics.theftProbability > 30 ? 'destructive' : 'warning'}
            />
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> AI Confidence: <span className="text-primary font-semibold">{metrics.confidencePercent.toFixed(0)}%</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
