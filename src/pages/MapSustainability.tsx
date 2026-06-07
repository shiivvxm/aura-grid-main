import { useRealtimeData } from '@/hooks/useRealtimeData';
import ChartContainer from '@/components/shared/ChartContainer';
import RiskGauge from '@/components/shared/RiskGauge';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Leaf, Recycle, Flame, Zap, AlertCircle, TrendingUp, Activity, Play } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line
} from 'recharts';
import { carbonData, renewableVsFossil, type Zone } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Inline map component with pulse animation for selected zone
function GridMap({ zones, onSelectZone, selectedId }: { zones: Zone[]; onSelectZone: (z: Zone) => void, selectedId?: string }) {
  const statusColor = { safe: 'border-energy bg-energy/10', medium: 'border-warning bg-warning/10', danger: 'border-destructive bg-destructive/10' };
  const dotColor = { safe: 'bg-energy', medium: 'bg-warning', danger: 'bg-destructive' };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {zones.map((z) => {
        const isSelected = z.id === selectedId;
        return (
          <motion.button
            key={z.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectZone(z)}
            className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${statusColor[z.status]} ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background shadow-[0_0_20px_rgba(var(--primary),0.3)]' : ''}`}
          >
            {isSelected && (
              <motion.div
                layoutId="pulse"
                className="absolute inset-0 bg-primary/5 select-none pointer-events-none"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <div className={`w-2 h-2 rounded-full ${dotColor[z.status]} ${isSelected ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-semibold text-foreground">{z.name}</span>
            </div>
            <p className="text-lg font-bold text-foreground relative z-10">{z.load.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground relative z-10">Load Capacity</p>
            {z.theftRisk && (
              <span className="mt-2 relative z-10 inline-block text-[10px] font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded-full border border-destructive/20">
                ⚠ Theft Risk
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

export default function MapSustainability() {
  const { metrics, zones } = useRealtimeData();
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [carbon, setCarbon] = useState(carbonData());
  const [renewable, setRenewable] = useState(renewableVsFossil());
  const [stressingId, setStressingId] = useState<string | null>(null);
  const [stressTimer, setStressTimer] = useState(0);

  // Derive the active zone data from the live zones array
  const activeZone = useMemo(() => {
    return zones.find(z => z.id === selectedZoneId) || null;
  }, [zones, selectedZoneId]);

  const isStressing = activeZone?.id === stressingId;

  // Generate mock trend data for the active zone
  const trendData = useMemo(() => {
    if (!activeZone) return [];
    return Array.from({ length: 12 }, (_, i) => ({
      time: `${i * 2}:00`,
      load: Math.max(20, Math.min(95, activeZone.load + (Math.random() - 0.5) * 20)),
    }));
  }, [activeZone?.id]);

  useEffect(() => {
    const id = setInterval(() => {
      setCarbon(carbonData());
      setRenewable(renewableVsFossil());
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const handleStressTest = () => {
    if (!activeZone) return;
    setStressingId(activeZone.id);
    setStressTimer(10);
    toast.warning(`Initiating Stress Test on ${activeZone.name}`, {
      description: "Simulating 150% load surge for thermal analysis.",
    });

    const interval = setInterval(() => {
      setStressTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStressingId(null);
          toast.success("Stress Test Completed", {
            description: `Zone ${activeZone.name} integrity verified.`,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Map + Zone details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartContainer title="Smart Grid Map" subtitle="Click a zone for real-time analytics" className="lg:col-span-2" delay={0}
          action={<MapPin className="w-4 h-4 text-primary" />}
        >
          <GridMap zones={zones} onSelectZone={(z) => setSelectedZoneId(z.id)} selectedId={selectedZoneId || undefined} />
        </ChartContainer>

        {/* Zone detail panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card flex flex-col h-full bg-[#0d1117]/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Zone Insight Engine</h3>
            {activeZone && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeZone.status === 'safe' ? 'border-energy/30 text-energy bg-energy/5' : 'border-warning/30 text-warning bg-warning/5'
                }`}>
                LIVE
              </span>
            )}
          </div>

          {activeZone ? (
            <div className="flex-1 flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xl font-black text-foreground tracking-tight">{activeZone.name}</p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Sector ID: {activeZone.id}</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-black ${isStressing ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
                    {isStressing ? '152%' : `${activeZone.load.toFixed(0)}%`}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">REAL-TIME LOAD</p>
                </div>
              </div>

              {/* Load Trend Chart */}
              <div className="bg-black/20 rounded-xl p-2 border border-white/5">
                <p className="text-[9px] font-bold text-muted-foreground mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-primary" /> 24H LOAD TREND
                </p>
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={trendData}>
                    <Line type="monotone" dataKey="load" stroke="#0EA5E9" strokeWidth={2} dot={false} />
                    <Tooltip
                      contentStyle={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '10px' }}
                      itemStyle={{ color: '#0EA5E9' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* AI Reasoning / Theft Risk */}
              {activeZone.theftRisk ? (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <p className="text-xs font-bold text-destructive">THEFT RISK ANALYSIS</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                    "AI detected non-technical loss patterns. Discrepancy between transformer output and smart meter aggregation: <span className="text-destructive font-bold">14.2kW</span> at 2:14 AM."
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-energy/10 border border-energy/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-energy" />
                    <p className="text-xs font-bold text-energy">GRID STABILITY: EXCELLENT</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Zero harmonic distortion detected. Power factor remains at optimal <span className="text-energy font-bold">0.99</span>.
                  </p>
                </div>
              )}

              <div className="mt-auto pt-4">
                <Button
                  className={`w-full gap-2 font-bold uppercase tracking-widest text-[10px] py-6 shadow-lg shadow-primary/10 transition-all ${isStressing ? 'bg-destructive hover:bg-destructive/80' : 'bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30'
                    }`}
                  onClick={handleStressTest}
                  disabled={isStressing}
                >
                  {isStressing ? (
                    <>
                      <Activity className="w-4 h-4 animate-spin" />
                      Stress Test Active ({stressTimer}s)
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      Initiate Zone Stress Test
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center animate-pulse">
                <MapPin className="w-8 h-8 text-primary/40" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Awaiting Input</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Select a sector from the live grid for advanced neural telemetry and stress analysis.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ChartContainer title="Carbon Reduction" subtitle="Monthly CO₂ comparison (kg)" delay={3}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={carbon}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(217, 33%, 14%)', border: '1px solid hsl(217, 33%, 20%)', borderRadius: 12, fontSize: 12, color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="saved" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} name="CO₂ Saved" />
              <Bar dataKey="emitted" fill="hsl(215, 20%, 35%)" radius={[4, 4, 0, 0]} name="CO₂ Emitted" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Efficiency score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card flex flex-col items-center justify-center gap-4"
        >
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Recycle className="w-4 h-4 text-energy" /> Efficiency Score
          </h3>
          <RiskGauge value={metrics.efficiency} label="Overall" color="energy" />
          <p className="text-xs text-muted-foreground text-center">
            System operating at <span className="text-energy font-semibold">{metrics.efficiency.toFixed(0)}%</span> efficiency
          </p>
        </motion.div>

        {/* Renewable vs Fossil pie */}
        <ChartContainer title="Energy Mix" subtitle="Renewable vs Fossil" delay={5}
          action={<Flame className="w-4 h-4 text-warning" />}
        >
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={renewable}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                dataKey="value"
                strokeWidth={0}
              >
                {renewable.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(217, 33%, 14%)', border: '1px solid hsl(217, 33%, 20%)', borderRadius: 12, fontSize: 12, color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
