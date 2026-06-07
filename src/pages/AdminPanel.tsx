import { useRealtimeData } from '@/hooks/useRealtimeData';
import ChartContainer from '@/components/shared/ChartContainer';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Activity, Database, Lock, Terminal, Zap, RefreshCw, AlertTriangle, ShieldCheck, Cpu, Power, Radio, Plus, MessageSquare, Send, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export default function AdminPanel() {
    const { zones } = useRealtimeData();
    const [isEmergencyArmed, setIsEmergencyArmed] = useState(false);
    const [loadBalancing, setLoadBalancing] = useState(true);
    const [broadcastMsg, setBroadcastMsg] = useState('');
    const [logs, setLogs] = useState<{ id: string; time: string; msg: string; type: 'info' | 'warn' | 'error' }[]>([]);
    const [zoneStates, setZoneStates] = useState<Record<string, boolean>>({});

    // Initialize zone states
    useEffect(() => {
        const initialStates: Record<string, boolean> = {};
        zones.forEach(z => {
            if (z && z.id) initialStates[z.id] = true;
        });
        if (Object.keys(initialStates).length > 0) {
            setZoneStates(prev => {
                if (Object.keys(prev).length === 0) return initialStates;
                return prev;
            });
        }
    }, [zones]);

    // Simulate raw log stream
    useEffect(() => {
        const interval = setInterval(() => {
            const newLog = {
                id: Math.random().toString(36).substr(2, 9),
                time: new Date().toLocaleTimeString(),
                msg: [
                    'Neural weights recalibrated for Sector 7',
                    'Async telemetry received from Hub-Alpha',
                    'Memory buffer flush complete',
                    'Inbound packet scan: 0 threats detected',
                    'Grid phase adjustment applied: +0.02ms'
                ][Math.floor(Math.random() * 5)],
                type: 'info' as const
            };
            setLogs(prev => [newLog, ...prev].slice(0, 10));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleShutdown = () => {
        if (!isEmergencyArmed) {
            toast.error("Action Denied", { description: "You must ARM the emergency system first." });
            return;
        }
        toast.warning("GRID SHUTDOWN INITIALIZED", {
            description: "Executing cascading isolation protocols. All sectors going offline.",
            duration: 5000,
        });
    };

    const handleBroadcast = () => {
        if (!broadcastMsg.trim()) return;
        toast.info("Alert Broadcasted", {
            description: `Message sent to all grid devices: "${broadcastMsg}"`,
            icon: <Radio className="w-4 h-4" />
        });
        setBroadcastMsg('');
    };

    const toggleZone = (id: string) => {
        const newState = !zoneStates[id];
        setZoneStates(prev => ({ ...prev, [id]: newState }));
        toast(newState ? "Zone Energized" : "Zone De-energized", {
            description: `Sector ${id} is now ${newState ? 'online' : 'isolated'}.`,
            icon: <Power className={`w-4 h-4 ${newState ? 'text-energy' : 'text-destructive'}`} />
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tighter flex items-center gap-3">
                        <Lock className="w-8 h-8 text-destructive" /> Admin Control Center
                    </h1>
                    <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-energy" /> Advanced Surveillance Mode Active
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[10px] uppercase h-9 rounded-xl">
                                <Plus className="w-3.5 h-3.5 mr-2" /> Add Smart Meter
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card border-white/10 text-foreground">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                    <Radio className="w-5 h-5 text-primary" /> Register New Smart Meter
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="meter-id">Device Serial Number</Label>
                                    <Input id="meter-id" placeholder="AUR-SM-XXXXX" className="bg-white/5 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="meter-zone">Deployment Zone</Label>
                                    <Input id="meter-zone" placeholder="Sector 7G" className="bg-white/5 border-white/10" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={() => toast.success("Device Registered")} className="w-full bg-primary text-primary-foreground font-bold">Initialize Connection</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <div className="flex items-center gap-3 p-1.5 rounded-xl bg-accent/30 border border-white/5 h-9">
                        <div className="flex items-center gap-2 px-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${isEmergencyArmed ? 'bg-destructive animate-ping' : 'bg-muted'}`} />
                            <span className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground">Emergency Armed</span>
                        </div>
                        <Switch checked={isEmergencyArmed} onCheckedChange={setIsEmergencyArmed} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    {/* Top Row: Global Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Global Load Balancing */}
                        <section className="glass-card flex items-center justify-between p-6">
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-primary" /> Global Load Balancing
                                </h3>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Autonomous redistribution engine</p>
                            </div>
                            <Switch
                                aria-label="Toggle Global Load Balancing"
                                checked={loadBalancing}
                                onCheckedChange={(val) => {
                                    setLoadBalancing(val);
                                    toast(val ? "Load Balancing Active" : "Load Balancing Suspended");
                                }} />
                        </section>

                        {/* Emergency shutdown */}
                        <section className="glass-card border-destructive/20 bg-destructive/5 flex items-center justify-between p-6">
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-destructive flex items-center gap-2">
                                    <Power className="w-4 h-4" /> Emergency Shutdown
                                </h3>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Cascading grid isolation protocol</p>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                disabled={!isEmergencyArmed}
                                onClick={handleShutdown}
                                className="font-black text-[10px] uppercase h-8 px-5 rounded-lg shadow-lg shadow-destructive/20"
                            >
                                Execute Kill-Switch
                            </Button>
                        </section>
                    </div>

                    {/* Node Management / Turn grid zone ON/OFF */}
                    <ChartContainer title="Tactical Zone Management" subtitle="Real-time power distribution and sector isolation controls">
                        <div className="overflow-x-auto mt-4">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                        <th className="py-3 px-4">Node / Sector</th>
                                        <th className="py-3 px-4">Current Status</th>
                                        <th className="py-3 px-4">Load Efficiency</th>
                                        <th className="py-3 px-4 text-right">Power State</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs">
                                    {zones.slice(0, 6).map((zone) => (
                                        <tr key={zone.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="flex flex-col">
                                                    <span className="font-mono font-bold text-primary">{zone.id}</span>
                                                    <span className="text-[9px] text-muted-foreground uppercase tracking-tighter">Sector {zone.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${zoneStates[zone.id] ? 'bg-energy animate-pulse' : 'bg-destructive'}`} />
                                                    <span className="text-[10px] font-bold uppercase">{zoneStates[zone.id] ? 'Active' : 'Isolated'}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="w-32 bg-white/5 h-1 rounded-full overflow-hidden">
                                                    <div
                                                        className={`${zone.load > 80 ? 'bg-destructive' : 'bg-primary'} h-full transition-all duration-500`}
                                                        style={{ width: `${zone.load}%` }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <Switch
                                                    aria-label={`Toggle Sector ${zone.id}`}
                                                    checked={zoneStates[zone.id] ?? true}
                                                    onCheckedChange={() => toggleZone(zone.id)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </ChartContainer>

                    {/* Alert broadcast component */}
                    <section className="glass-card space-y-4">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-bold text-white">Grid-Wide Alert Broadcast</h2>
                        </div>
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Input
                                    value={broadcastMsg}
                                    onChange={(e) => setBroadcastMsg(e.target.value)}
                                    placeholder="Enter emergency message for all smart meters..."
                                    className="bg-white/5 border-white/10 h-11 pl-10 text-sm"
                                    onKeyDown={(e) => e.key === 'Enter' && handleBroadcast()}
                                />
                                <Radio className="w-4 h-4 text-primary/40 absolute left-3.5 top-3.5" />
                            </div>
                            <Button onClick={handleBroadcast} className="bg-primary hover:bg-primary/90 h-11 px-8 rounded-xl font-bold flex items-center gap-2">
                                <Send className="w-4 h-4" /> Broadcast
                            </Button>
                        </div>
                        <p className="text-[9px] text-muted-foreground uppercase font-medium">Broadcast will be pushed to all registered devices in the neural network.</p>
                    </section>
                </div>

                {/* Sidebar Panel */}
                <div className="space-y-6">
                    {/* Raw Telemetry */}
                    <section className="glass-card flex flex-col h-[400px]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-primary" /> Raw Telemetry
                            </h3>
                            <span className="text-[9px] font-bold animate-pulse text-energy">LIVE</span>
                        </div>
                        <div className="flex-1 font-mono text-[10px] space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                            <AnimatePresence>
                                {logs.map((log) => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex gap-3 text-muted-foreground border-l border-white/5 pl-2"
                                    >
                                        <span className="text-primary/50 shrink-0">[{log.time}]</span>
                                        <span className="text-foreground shrink-0">$</span>
                                        <span>{log.msg}</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </section>

                    {/* System Analytics */}
                    <section className="glass-card">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-6">
                            <Server className="w-4 h-4 text-primary" /> System Utilization
                        </h3>
                        <div className="space-y-6">
                            {[
                                { label: 'AI Compute Engine', value: 72, color: 'bg-primary' },
                                { label: 'Node Comms Hub', value: 34, color: 'bg-energy' },
                                { label: 'Emergency Buffer', value: 89, color: 'bg-warning' },
                            ].map((item) => (
                                <div key={item.label} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold">
                                        <span className="text-muted-foreground uppercase">{item.label}</span>
                                        <span className="text-white">{item.value}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.value}%` }}
                                            className={`h-full ${item.color}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
