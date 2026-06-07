import { useRealtimeData } from '@/hooks/useRealtimeData';
import ChartContainer from '@/components/shared/ChartContainer';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Zap, AlertTriangle, Activity, Globe, Info, Brain, Radio, Cloud, Sun, CloudRain, Search, AlertCircle, Thermometer } from 'lucide-react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { type Zone } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

function SmartGridMap({
    zones,
    onSelectZone,
    selectedId,
    showWeather,
    showFaults,
    showTheft,
    showLoad,
    isStressMode
}: {
    zones: Zone[];
    onSelectZone: (z: Zone) => void;
    selectedId?: string;
    showWeather: boolean;
    showFaults: boolean;
    showTheft: boolean;
    showLoad: boolean;
    isStressMode: boolean;
}) {
    return (
        <div className="relative w-full aspect-[16/9] bg-background-deep/50 rounded-2xl overflow-hidden border border-white/5">
            {/* Simulation of a map background with grid lines */}
            <div className="absolute inset-0 opacity-20 grid-pattern" />

            {/* Connecting lines simulation */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                <path d="M 100 100 L 300 200 L 500 150 L 700 300" stroke="currentColor" strokeWidth="1" fill="none" className="text-primary" />
                <path d="M 200 400 L 400 350 L 600 450" stroke="currentColor" strokeWidth="1" fill="none" className="text-energy" />
            </svg>

            {/* Zone Hotspots */}
            {zones.map((z, i) => {
                const isSelected = z.id === selectedId;
                // Mock positions for a geographic look
                const x = 15 + (i * 15) % 70;
                const y = 20 + (i * 12) % 60;

                // Color based on load + stress mode
                const effectiveLoad = isStressMode ? Math.min(100, z.load + 30) : z.load;
                const loadColor = effectiveLoad > 80 ? 'bg-destructive' : effectiveLoad > 50 ? 'bg-warning' : 'bg-energy';
                const ringColor = effectiveLoad > 80 ? 'bg-destructive/50' : effectiveLoad > 50 ? 'bg-warning/50' : 'bg-energy/50';

                return (
                    <motion.div
                        key={z.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="absolute cursor-pointer"
                        style={{ left: `${x}%`, top: `${y}%` }}
                        onClick={() => onSelectZone(z)}
                    >
                        <div className="relative group">
                            {/* Pulse rings */}
                            {showLoad && (
                                <motion.div
                                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className={`absolute inset-0 rounded-full ${ringColor}`}
                                />
                            )}
                            <div className={`
                w-4 h-4 rounded-full border-2 border-white shadow-lg transition-transform duration-300
                ${isSelected ? 'scale-150 ring-4 ring-primary/30' : 'group-hover:scale-125'}
                ${showLoad ? loadColor : 'bg-muted'}
              `} />

                            {/* Fault Indicator */}
                            {showFaults && (z.faults > 0 || (isStressMode && i % 2 === 0)) && (
                                <motion.div
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="absolute -top-4 -right-4 text-destructive drop-shadow-lg"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                </motion.div>
                            )}

                            {/* Theft Indicator */}
                            {showTheft && (z.theftRisk || (isStressMode && i % 3 === 0)) && (
                                <div className="absolute -bottom-4 -left-4 text-orange-500 drop-shadow-lg">
                                    <Search className="w-4 h-4" />
                                </div>
                            )}

                            {/* Weather Overlay */}
                            {showWeather && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute left-6 top-0 flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full border border-white/5"
                                >
                                    {i % 3 === 0 ? <Sun className="w-3 h-3 text-warning" /> : i % 3 === 1 ? <Cloud className="w-3 h-3 text-blue-300" /> : <CloudRain className="w-3 h-3 text-primary" />}
                                    <span className="text-[10px] font-bold text-white whitespace-nowrap">{24 + (i % 8)}°C</span>
                                </motion.div>
                            )}

                            {/* Tooltip on hover or selection */}
                            {(isSelected) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-20 whitespace-nowrap"
                                >
                                    <div className="bg-popover/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg shadow-2xl">
                                        <p className="text-[10px] font-bold text-foreground">{z.name}</p>
                                        <div className="space-y-0.5 mt-0.5">
                                            <p className={`text-[9px] font-mono ${effectiveLoad > 80 ? 'text-destructive' : 'text-primary'}`}>
                                                Load: {effectiveLoad.toFixed(1)}%
                                            </p>
                                            {showFaults && (z.faults > 0 || (isStressMode && i % 2 === 0)) && <p className="text-[8px] text-destructive font-bold flex items-center gap-1"><AlertCircle className="w-2 h-2" /> Grid Fault Detected</p>}
                                            {showTheft && (z.theftRisk || (isStressMode && i % 3 === 0)) && <p className="text-[8px] text-orange-400 font-bold flex items-center gap-1"><Search className="w-2 h-2" /> Theft Risk Alpha</p>}
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 bg-popover/90 border-r border-b border-white/10 rotate-45 mx-auto -mt-1" />
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

export default function SmartLiveMap() {
    const { zones, timeSeries } = useRealtimeData();
    const [selectedZoneId, setSelectedZoneId] = useState<string | null>(zones[0]?.id || null);
    const [showWeather, setShowWeather] = useState(false);
    const [showFaults, setShowFaults] = useState(true);
    const [showTheft, setShowTheft] = useState(true);
    const [showLoad, setShowLoad] = useState(true);
    const [isStressMode, setIsStressMode] = useState(false);

    const selectedZone = useMemo(() =>
        zones.find(z => z.id === selectedZoneId) || zones[0],
        [zones, selectedZoneId]
    );

    // Mock neural telemetry data
    const neuralMetrics = useMemo(() => ({
        powerFactor: 0.95 + Math.random() * 0.04,
        harmonicDistortion: 2.1 + Math.random() * 1.5,
        healthScore: isStressMode ? 40 + Math.random() * 20 : 85 + Math.random() * 10,
        predictionConfidence: 94 + Math.random() * 4,
    }), [selectedZone?.id, isStressMode]);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full">
            {/* Main Map View */}
            <div className="xl:col-span-3 space-y-6">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                            <Globe className="w-6 h-6 text-primary" /> Smart Neural Map
                        </h1>
                        <p className="text-muted-foreground text-sm">Geospatial AI analysis of grid performance and hotspots.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant={isStressMode ? "destructive" : "outline"}
                            size="sm"
                            className="text-[10px] h-9 font-bold uppercase tracking-widest gap-2"
                            onClick={() => setIsStressMode(!isStressMode)}
                        >
                            <Zap className={`w-3 h-3 ${isStressMode ? "animate-pulse" : ""}`} />
                            {isStressMode ? "Deactivate Stress" : "Simulate Stress"}
                        </Button>
                        <div className="glass-card-sm py-1.5 px-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-energy animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sync: 1.2ms</span>
                        </div>
                    </div>
                </header>

                <ChartContainer
                    title="Grid Topology Visualization"
                    subtitle="Real-time geographic load distribution and risk detection"
                    className="min-h-[500px]"
                    action={
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest border-r border-white/10 pr-6 mr-2">
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-energy" /> Normal</span>
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warning" /> Warning</span>
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-destructive" /> Critical</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setShowLoad(!showLoad)}
                                    className={`flex items-center gap-1.5 text-[10px] font-bold uppercase transition-opacity ${showLoad ? "opacity-100" : "opacity-40"}`}
                                >
                                    <Activity className="w-3 h-3 text-primary" /> Load
                                </button>
                                <button
                                    onClick={() => setShowFaults(!showFaults)}
                                    className={`flex items-center gap-1.5 text-[10px] font-bold uppercase transition-opacity ${showFaults ? "opacity-100 text-destructive" : "opacity-40"}`}
                                >
                                    <AlertCircle className="w-3 h-3" /> Faults
                                </button>
                                <button
                                    onClick={() => setShowTheft(!showTheft)}
                                    className={`flex items-center gap-1.5 text-[10px] font-bold uppercase transition-opacity ${showTheft ? "opacity-100 text-orange-500" : "opacity-40"}`}
                                >
                                    <Search className="w-3 h-3" /> Theft
                                </button>
                                <button
                                    onClick={() => setShowWeather(!showWeather)}
                                    className={`flex items-center gap-1.5 text-[10px] font-bold uppercase transition-opacity ${showWeather ? "opacity-100 text-blue-400" : "opacity-40"}`}
                                >
                                    <Cloud className="w-3 h-3" /> Weather
                                </button>
                            </div>
                        </div>
                    }
                >
                    <SmartGridMap
                        zones={zones}
                        selectedId={selectedZoneId || undefined}
                        onSelectZone={(z) => setSelectedZoneId(z.id)}
                        showWeather={showWeather}
                        showFaults={showFaults}
                        showTheft={showTheft}
                        showLoad={showLoad}
                        isStressMode={isStressMode}
                    />
                </ChartContainer>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ChartContainer title="Neural Load Prediction" subtitle="AI-forecasted demand vs actual metrics" delay={0.2}>
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={timeSeries.slice(-12)}>
                                <defs>
                                    <linearGradient id="neuralGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="white" strokeOpacity={0.05} />
                                <XAxis dataKey="time" hide />
                                <YAxis hide domain={['auto', 'auto']} />
                                <Tooltip
                                    contentStyle={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#0EA5E9' }}
                                />
                                <Area type="monotone" dataKey="grid" stroke="#0EA5E9" fill="url(#neuralGrad)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    <div className="glass-card flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <Brain className="w-4 h-4 text-primary" /> Hotspot AI Reasoning
                            </h3>
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20 font-bold">ACTIVE</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed italic border-l-2 border-primary/30 pl-3 py-1">
                            "Anomalous demand wave detected moving from {selectedZone?.name || 'Sector 1'} towards adjacent nodes. Neural model suggests 84% probability of adaptive theft attempt or industrial shunt failure."
                        </p>
                        <div className="mt-4 flex items-center justify-between gap-3">
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 text-[10px] h-8 uppercase tracking-wider font-bold"
                                onClick={() => toast('Neural Log Archive', { description: `Showing 72h anomaly history for ${selectedZone?.name || 'this sector'}.` })}
                            >
                                View History
                            </Button>
                            <Button
                                size="sm"
                                className="flex-1 text-[10px] h-8 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 uppercase tracking-wider font-bold"
                                onClick={() => toast.success('Probe Deployed', { description: `Diagnostic probe launched to ${selectedZone?.name || 'target node'}. ETA: 3s.` })}
                            >
                                Deploy Probe
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Side Telemetry Panel */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
            >
                <div className="glass-card-sm border-primary/20 bg-primary/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-primary/20">
                            <Radio className="w-5 h-5 text-primary animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white">Neural Telemetry</h2>
                            <p className="text-[10px] text-muted-foreground font-mono">{selectedZone?.id.toUpperCase() || 'NODE_NULL'}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">
                                <span>Node Grid Health</span>
                                <span className="text-energy">{neuralMetrics.healthScore.toFixed(0)}%</span>
                            </div>
                            <Progress value={neuralMetrics.healthScore} className="h-1.5 bg-white/5" indicatorClassName="bg-gradient-to-r from-primary to-energy" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                                <p className="text-[9px] font-bold text-muted-foreground mb-1 uppercase">Power Factor</p>
                                <p className="text-lg font-black text-white">{neuralMetrics.powerFactor.toFixed(2)}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                                <p className="text-[9px] font-bold text-muted-foreground mb-1 uppercase">Harmonics</p>
                                <p className="text-lg font-black text-white">{neuralMetrics.harmonicDistortion.toFixed(1)}%</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Info className="w-3 h-3 text-primary" />
                                <p className="text-[10px] font-bold text-primary uppercase">Prediction Confidence</p>
                            </div>
                            <p className="text-xl font-black text-white">{neuralMetrics.predictionConfidence.toFixed(1)}%</p>
                            <p className="text-[10px] text-muted-foreground mt-1">Confidence level of the current neural prediction model.</p>
                        </div>
                    </div>
                </div>

                {/* Selected Zone Quick Stats */}
                <div className="glass-card space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Node Information</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">Name</span>
                            <span className="text-xs font-bold text-white">{selectedZone?.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">Coordinates</span>
                            <span className="text-[10px] font-mono text-primary">{selectedZone?.lat.toFixed(4)}, {selectedZone?.lng.toFixed(4)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">Current Status</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${selectedZone?.status === 'danger' ? 'border-destructive/30 text-destructive bg-destructive/5' :
                                selectedZone?.status === 'medium' ? 'border-warning/30 text-warning bg-warning/5' :
                                    'border-energy/30 text-energy bg-energy/5'
                                }`}>
                                {selectedZone?.status.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button
                            className="w-full gap-2 text-[10px] h-10 font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
                            onClick={() => toast.success('Phase Analysis Complete', {
                                description: `Node ${selectedZone?.id?.toUpperCase()}: Power Factor ${(0.95 + Math.random() * 0.04).toFixed(2)} — Grid Stable.`,
                                icon: <Activity className="w-4 h-4" />
                            })}
                        >
                            <Activity className="w-3 h-3" /> Execute Phase Analysis
                        </Button>
                    </div>
                </div>

                {/* System Logs */}
                <div className="glass-card-sm space-y-2 max-h-[200px] overflow-y-auto">
                    <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-2 sticky top-0 bg-inherit pt-1">Neural Logs</p>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="text-[9px] font-mono text-muted-foreground/60 border-b border-white/5 pb-2">
                            <span className="text-primary/70">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span> INF: Recalibrating phase {i} for node {selectedZone?.id}...
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
