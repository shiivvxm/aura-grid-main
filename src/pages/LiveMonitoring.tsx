import { useRealtimeData } from '@/hooks/useRealtimeData';
import ChartContainer from '@/components/shared/ChartContainer';
import AlertPanel from '@/components/shared/AlertPanel';
import { motion } from 'framer-motion';
import { Activity, Wifi } from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { zoneBarData } from '@/services/mockData';
import { useState, useEffect } from 'react';

export default function LiveMonitoring() {
  const { timeSeries, metrics, removeAlert, alerts } = useRealtimeData(2000);
  const [barData, setBarData] = useState(zoneBarData());

  useEffect(() => {
    const id = setInterval(() => setBarData(zoneBarData()), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-6">
      {/* Status bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-sm flex items-center gap-4"
      >
        <div className="flex items-center gap-2">
          <span className="status-dot bg-energy" />
          <Wifi className="w-4 h-4 text-energy" />
          <span className="text-sm font-medium text-foreground">Live Stream Active</span>
        </div>
        <span className="text-xs text-muted-foreground">Refresh: 2s</span>
        <div className="ml-auto flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm text-muted-foreground">
            Grid Load: <span className="text-foreground font-semibold">{metrics.gridLoad.toFixed(1)} MW</span>
          </span>
        </div>
      </motion.div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartContainer title="Household Energy" subtitle="kW consumption over time" delay={1}>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={timeSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
              <XAxis dataKey="time" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(217, 33%, 14%)', border: '1px solid hsl(217, 33%, 20%)', borderRadius: 12, fontSize: 12, color: '#fff' }} />
              <Line type="monotone" dataKey="household" stroke="hsl(199, 89%, 48%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Solar Generation" subtitle="kW generated from solar panels" delay={2}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={timeSeries}>
              <defs>
                <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
              <XAxis dataKey="time" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(217, 33%, 14%)', border: '1px solid hsl(217, 33%, 20%)', borderRadius: 12, fontSize: 12, color: '#fff' }} />
              <Area type="monotone" dataKey="solar" stroke="hsl(142, 71%, 45%)" fill="url(#solarGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Total Grid Load" subtitle="MW across all zones" delay={3}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={timeSeries}>
              <defs>
                <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
              <XAxis dataKey="time" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(217, 33%, 14%)', border: '1px solid hsl(217, 33%, 20%)', borderRadius: 12, fontSize: 12, color: '#fff' }} />
              <Area type="monotone" dataKey="grid" stroke="hsl(38, 92%, 50%)" fill="url(#gridGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Zone Comparison" subtitle="Consumption vs Generation by zone" delay={4}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(217, 33%, 14%)', border: '1px solid hsl(217, 33%, 20%)', borderRadius: 12, fontSize: 12, color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: 12, color: 'hsl(215, 20%, 55%)' }} />
              <Bar dataKey="consumption" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} name="Consumption" />
              <Bar dataKey="generation" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} name="Generation" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AlertPanel alerts={alerts} onDismiss={removeAlert} />
      </div>
    </div>
  );
}
