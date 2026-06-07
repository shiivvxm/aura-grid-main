import { useRealtimeData } from '@/hooks/useRealtimeData';
import ChartContainer from '@/components/shared/ChartContainer';
import MetricCard from '@/components/shared/MetricCard';
import RiskGauge from '@/components/shared/RiskGauge';
import AlertPanel from '@/components/shared/AlertPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, ShieldAlert, AlertTriangle, Eye, Sparkles, Loader2, Gauge, Shield, Lightbulb, CheckCircle2 } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

export default function AIInsights() {
  const { metrics, timeSeries, alerts, removeAlert, isOptimizing, runOptimization, weeklyForecast, recommendations } = useRealtimeData();
  const [forecastType, setForecastType] = useState<'24h' | '7d'>('24h');

  const handleOptimize = () => {
    runOptimization();
    toast.success("AI Optimization Initialized", {
      description: "Neural network is recalibrating grid distribution for peak efficiency.",
      icon: <Sparkles className="w-4 h-4 text-primary" />,
    });
  };

  const riskLevel = metrics.riskScore > 60 ? 'Critical' : metrics.riskScore > 35 ? 'Elevated' : 'Normal';
  const riskColor = metrics.riskScore > 60 ? 'text-destructive' : metrics.riskScore > 35 ? 'text-warning' : 'text-energy';

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <div className="xl:col-span-3 space-y-6">
        {/* Page Header with Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">AI Prediction Lab</h2>
            <p className="text-sm text-muted-foreground font-medium">Predictive analysis and autonomous grid balancing.</p>
          </div>
          <Button
            onClick={handleOptimize}
            disabled={isOptimizing}
            className={`h-12 px-6 rounded-xl font-bold transition-all duration-500 shadow-lg ${isOptimizing
              ? 'bg-primary/20 text-primary border-primary/30'
              : 'bg-primary text-primary-foreground hover:bg-primary/90 glow-primary shadow-primary/20'
              }`}
          >
            {isOptimizing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Optimizing Grid...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Run AI Optimization
              </>
            )}
          </Button>
        </div>

        {/* Top metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="AI Confidence" value={metrics.confidencePercent} unit="%" icon={Brain} color="primary" delay={0} />
          <MetricCard title="Peak Demand" value={metrics.peakDemand} unit="MW" icon={TrendingUp} color="warning" delay={1} />
          <MetricCard title="Overload Prob" value={metrics.overloadProbability} unit="%" icon={Gauge} color={metrics.overloadProbability > 50 ? 'destructive' : 'warning'} delay={2} />
          <MetricCard title="Blackout Risk" value={metrics.blackoutRisk} unit="%" icon={Shield} color={metrics.blackoutRisk > 30 ? 'destructive' : 'warning'} delay={3} />
        </div>

        {/* Forecast + Risk gauges */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ChartContainer
            title="AI Demand Forecast"
            subtitle={forecastType === '24h' ? "Next 24 hours predicted load" : "7-day trend analysis"}
            className="lg:col-span-2"
            delay={4}
            action={
              <div className="flex bg-accent/30 rounded-lg p-0.5">
                <button
                  onClick={() => setForecastType('24h')}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${forecastType === '24h' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  24H
                </button>
                <button
                  onClick={() => setForecastType('7d')}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${forecastType === '7d' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  7D
                </button>
              </div>
            }
          >
            <div className="h-[280px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                {forecastType === '24h' ? (
                  <AreaChart data={timeSeries}>
                    <defs>
                      <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" vertical={false} />
                    <XAxis dataKey="time" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '12px', fontSize: '11px' }}
                      itemStyle={{ color: '#0EA5E9' }}
                    />
                    <Area type="monotone" dataKey="predicted" stroke="hsl(199, 89%, 48%)" fill="url(#forecastGrad)" strokeWidth={2} />
                    <Area type="monotone" dataKey="actual" stroke="#10B981" fill="none" strokeWidth={2} strokeDasharray="5 5" />
                  </AreaChart>
                ) : (
                  <BarChart data={weeklyForecast}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '12px', fontSize: '11px' }}
                    />
                    <Bar dataKey="demand" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} name="Demand MW" />
                    <Bar dataKey="solar" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Solar Gen" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </ChartContainer>

          {/* Risk analysis card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card flex flex-col gap-6"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <h3 className="text-sm font-semibold text-foreground">Risk Telemetry</h3>
            </div>
            <div className="flex-1 flex flex-col justify-around">
              <div className="flex justify-around items-center">
                <RiskGauge value={metrics.overloadProbability} label="Overload" color={metrics.overloadProbability > 50 ? 'destructive' : 'warning'} />
                <RiskGauge value={metrics.blackoutRisk} label="Blackout" color={metrics.blackoutRisk > 30 ? 'destructive' : 'warning'} />
              </div>
              <div className="p-4 rounded-xl bg-accent/30 border border-white/5 text-center mt-4">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Grid Security Level</p>
                <p className={`text-xl font-black ${riskColor}`}>{riskLevel}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Suggested Load Balancing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground tracking-tight">AI Load Balancing</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">AUTONOMOUS MODE</span>
            </div>

            <div className="space-y-4">
              {[
                { zone: 'Sector 4 (Industrial)', suggested: -15, type: 'reduction' },
                { zone: 'Zone B-12 (Residential)', suggested: +10, type: 'increase' },
                { zone: 'Commercial District', suggested: -5, type: 'reduction' }
              ].map((item, i) => (
                <div key={item.zone} className="flex items-center justify-between p-3 rounded-xl bg-[#0d1117]/50 border border-white/5">
                  <span className="text-xs text-foreground font-medium">{item.zone}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.type === 'reduction' ? 'bg-destructive/10 text-destructive' : 'bg-energy/10 text-energy'}`}>
                      {item.suggested > 0 ? '+' : ''}{item.suggested}%
                    </span>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold hover:bg-primary/20 hover:text-primary border border-transparent hover:border-primary/30">APPLY</Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Real-time Alerts */}
          <AlertPanel alerts={alerts} onDismiss={removeAlert} />
        </div>
      </div>

      {/* Right Sidebar - Smart Recommendations */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card h-full flex flex-col"
        >
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="w-5 h-5 text-warning" />
            <h3 className="text-lg font-bold text-foreground">Smart Insights</h3>
          </div>

          <div className="space-y-6 overflow-y-auto pr-1">
            {recommendations.map((rec, i) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="p-4 rounded-xl bg-accent/20 border border-white/5 space-y-3 relative overflow-hidden group hover:border-primary/30 transition-all duration-300"
              >
                <div className={`absolute top-0 right-0 w-16 h-16 blur-2xl -mr-8 -mt-8 ${rec.impact === 'high' ? 'bg-destructive/10' : rec.impact === 'medium' ? 'bg-warning/10' : 'bg-primary/10'}`} />
                <div className="flex items-start justify-between relative z-10">
                  <h4 className="text-sm font-bold text-foreground">{rec.title}</h4>
                  <span className={`text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded ${rec.impact === 'high' ? 'bg-destructive/20 text-destructive border border-destructive/30' :
                    rec.impact === 'medium' ? 'bg-warning/20 text-warning border border-warning/30' :
                      'bg-primary/20 text-primary border border-primary/30'
                    }`}>
                    {rec.impact} Priority
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed relative z-10">{rec.description}</p>
                <Button size="sm" className="w-full text-[10px] font-black tracking-widest py-1 h-8 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 shadow-none">
                  <CheckCircle2 className="w-3 h-3 mr-2" /> {rec.action.toUpperCase()}
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Brain className="w-4 h-4" />
                <span className="text-[10px] font-black tracking-widest">AI SUMMARY</span>
              </div>
              <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                "System health remains stable. Predicted spike in commercial sector at 4PM. Recommend 10% preemptive throttling."
              </p>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-energy animate-pulse shadow-[0_0_8px_rgba(var(--energy),0.5)]" />
              <span className="text-[10px] font-bold uppercase tracking-wider">AI Neural Core Active</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
