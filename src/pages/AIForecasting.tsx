import { useRealtimeData } from '@/hooks/useRealtimeData';
import ChartContainer from '@/components/shared/ChartContainer';
import RiskGauge from '@/components/shared/RiskGauge';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Sparkles, Activity, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

export default function AIForecasting() {
    const { metrics, timeSeries, weeklyForecast, recommendations, runOptimization, isOptimizing } = useRealtimeData();
    const [forecastType, setForecastType] = useState<'24h' | '7d'>('24h');
    const [appliedRecs, setAppliedRecs] = useState<Set<string>>(new Set());

    const handleApply = (rec: { id: string; title: string }, idx: number) => {
        if (appliedRecs.has(rec.id)) {
            toast('Already Applied', { description: `${rec.title} is already active in the grid.` });
            return;
        }
        setAppliedRecs(prev => new Set(prev).add(rec.id));
        toast.success('Optimization Applied', {
            description: `${rec.title} — estimated load reduction: ${idx * 5 + 10}%.`,
            icon: <Zap className="w-4 h-4 text-primary" />,
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-primary" /> AI Forecasting Lab
                    </h1>
                    <p className="text-muted-foreground font-medium">Predictive grid analysis and autonomous demand modeling.</p>
                </div>
                <Button
                    onClick={runOptimization}
                    disabled={isOptimizing}
                    className="bg-primary text-primary-foreground font-bold h-12 px-8 rounded-xl glow-primary"
                >
                    {isOptimizing ? "Calibrating Model..." : "Recalibrate AI Model"}
                </Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Main Forecast Graph */}
                <ChartContainer
                    title="Demand Prediction Engine"
                    subtitle={forecastType === '24h' ? "AI-modeled load for next 24 cycles" : "Weekly strategic trend analysis"}
                    className="xl:col-span-2"
                    action={
                        <div className="flex bg-accent/30 rounded-lg p-1">
                            <button
                                onClick={() => setForecastType('24h')}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${forecastType === '24h' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                24H
                            </button>
                            <button
                                onClick={() => setForecastType('7d')}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${forecastType === '7d' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                7D
                            </button>
                        </div>
                    }
                >
                    <div className="h-[350px] w-full mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            {forecastType === '24h' ? (
                                <AreaChart data={timeSeries}>
                                    <defs>
                                        <linearGradient id="forecastGradFlow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="white" strokeOpacity={0.05} vertical={false} />
                                    <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ background: 'hsl(var(--background-deep))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    />
                                    <Area type="monotone" dataKey="predicted" stroke="hsl(var(--primary))" fill="url(#forecastGradFlow)" strokeWidth={3} />
                                    <Area type="monotone" dataKey="actual" stroke="#10B981" fill="none" strokeWidth={2} strokeDasharray="5 5" />
                                </AreaChart>
                            ) : (
                                <BarChart data={weeklyForecast}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="white" strokeOpacity={0.05} vertical={false} />
                                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ background: 'hsl(var(--background-deep))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    />
                                    <Bar dataKey="demand" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name="Predicted Demand" />
                                    <Bar dataKey="solar" fill="hsl(var(--warning))" radius={[6, 6, 0, 0]} name="Renewable Potential" />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </ChartContainer>

                {/* Risk Metrics */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card flex flex-col items-center justify-center p-8 text-center"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Activity className="w-5 h-5 text-destructive" />
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Critical Risk Analysis</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-8 w-full">
                            <div className="flex flex-col items-center gap-4">
                                <RiskGauge value={metrics.overloadProbability} label="Overload Prob" color={metrics.overloadProbability > 50 ? 'destructive' : 'warning'} />
                                <p className="text-[10px] text-muted-foreground font-medium px-2">Probability of localized node failure</p>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                {/* High impact Blackout Meter */}
                                <div className="relative w-24 h-24">
                                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                                        <circle cx="48" cy="48" r="40" fill="none" stroke="hsl(217 33% 20%)" strokeWidth="8" />
                                        <motion.circle
                                            cx="48" cy="48" r="40" fill="none"
                                            stroke="hsl(0 84% 60%)" strokeWidth="8" strokeLinecap="round"
                                            strokeDasharray={2 * Math.PI * 40}
                                            initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                                            animate={{ strokeDashoffset: (2 * Math.PI * 40) - (metrics.blackoutRisk / 100) * (2 * Math.PI * 40) }}
                                            transition={{ duration: 1.5, ease: "easeInOut" }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-xl font-black text-white">{metrics.blackoutRisk}%</span>
                                    </div>
                                    {metrics.blackoutRisk > 40 && (
                                        <motion.div
                                            animate={{ opacity: [1, 0.4, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            className="absolute -top-1 -right-1"
                                        >
                                            <AlertTriangle className="w-5 h-5 text-destructive fill-destructive/20" />
                                        </motion.div>
                                    )}
                                </div>
                                <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Blackout Risk</span>
                                <p className="text-[10px] text-muted-foreground font-medium px-2">Grid-wide cascade event probability</p>
                            </div>
                        </div>

                        <div className="mt-8 w-full p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black text-destructive uppercase tracking-widest">System Alert</span>
                                <span className="w-2 h-2 rounded-full bg-destructive animate-ping" />
                            </div>
                            <p className="text-xs text-muted-foreground text-left leading-relaxed">
                                Cascading failure protocols are {metrics.blackoutRisk > 30 ? <span className="text-destructive font-bold">ARMED</span> : "Standby"}. AI is monitoring {timeSeries.length} active nodes for thermal runaway.
                            </p>
                        </div>
                    </motion.div>

                    {/* AI Reasoning Panel */}
                    <div className="glass-card">
                        <div className="flex items-center gap-2 mb-4">
                            <Brain className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">AI Neural Reasoning</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 italic text-xs text-muted-foreground leading-relaxed">
                                "Based on the {forecastType} trend, the primary vector for grid instability is the unregulated solar feed-in from the Western Hub. Recommend dynamic phase shifting to compensate."
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-primary px-3 py-2 bg-primary/10 rounded-lg">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Model Confidence: {metrics.confidencePercent}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Suggested Load Balancing */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ChartContainer
                        title="Suggested Load Balancing Actions"
                        subtitle="AI-calculated optimizations to prevent predicted overloads"
                    >
                        <div className="space-y-3 mt-4">
                            {recommendations.map((rec, i) => (
                                <motion.div
                                    key={rec.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center justify-between p-4 rounded-2xl bg-[#0d1117]/50 border border-white/5 group hover:border-primary/30 transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl ${rec.impact === 'high' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                                            <Zap className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                                            <p className="text-xs text-muted-foreground">{rec.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase text-muted-foreground">Est. Impact</p>
                                            <p className={`text-xs font-bold ${rec.impact === 'high' ? 'text-destructive' : 'text-primary'}`}>-{i * 5 + 10}% Load</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleApply(rec, i)}
                                            className={`h-9 px-6 border font-black text-[10px] tracking-widest transition-all ${appliedRecs.has(rec.id)
                                                    ? 'bg-energy/20 text-energy border-energy/30 hover:bg-energy/30'
                                                    : 'bg-primary/20 text-primary border-primary/30 hover:bg-primary/30'
                                                }`}
                                        >
                                            {appliedRecs.has(rec.id) ? '✓ ACTIVE' : 'APPLY'}
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </ChartContainer>
                </div>

                {/* Quick Stats / Summary */}
                <div className="glass-card flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Strategic Summary</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-muted-foreground">Grid Capacity Utilization</span>
                                    <span className="text-white font-bold">78%</span>
                                </div>
                                <Progress value={78} className="h-1.5" indicatorClassName="bg-primary" />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-muted-foreground">Renewable Penetration</span>
                                    <span className="text-energy font-bold">42%</span>
                                </div>
                                <Progress value={42} className="h-1.5" indicatorClassName="bg-energy" />
                            </div>
                            <div className="pt-4 grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Peak MW</p>
                                    <p className="text-xl font-black text-white">{metrics.peakDemand}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Savings</p>
                                    <p className="text-xl font-black text-energy">$12.4k</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-[10px] font-black text-primary uppercase">Elite Prediction</p>
                                <p className="text-[9px] text-muted-foreground">Using Quantum-Ready Model X4</p>
                            </div>
                        </div>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="text-primary hover:bg-primary/10"
                            onClick={() => toast.info('Quantum-Ready Model X4', { description: 'Predictive accuracy: 96.4% | Last trained: 2 hours ago' })}
                        >
                            <Activity className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
