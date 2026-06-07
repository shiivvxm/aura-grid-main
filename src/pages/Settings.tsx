import { motion } from 'framer-motion';
import { User, Settings as SettingsIcon, Bell, Shield, Sliders, Moon, Sun, Monitor, Brain, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTheme } from '@/components/theme/ThemeProvider';

export default function Settings() {
    const { theme, setTheme } = useTheme();
    const [refreshRate, setRefreshRate] = useState(1.2);
    const [aiSensitivity, setAiSensitivity] = useState(75);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [autoOptimize, setAutoOptimize] = useState(true);

    const handleSave = () => {
        toast.success("Settings Saved", {
            description: "Your preferences have been updated across the neural grid.",
            icon: <Zap className="w-4 h-4 text-primary" />,
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <header>
                <h1 className="text-3xl font-black text-foreground tracking-tighter flex items-center gap-3">
                    <SettingsIcon className="w-8 h-8 text-primary" /> System Settings
                </h1>
                <p className="text-muted-foreground font-medium">Configure your AI dashboard and grid simulation parameters.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar Tabs */}
                <div className="space-y-1">
                    {[
                        { id: 'profile', label: 'User Profile', icon: User },
                        { id: 'sim', label: 'Simulation & AI', icon: Sliders },
                        { id: 'alerts', label: 'Security Alerts', icon: Bell },
                        { id: 'display', label: 'Display & UI', icon: Monitor },
                    ].map((item, i) => (
                        <button
                            key={item.id}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${i === 1 ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="md:col-span-2 space-y-8">
                    {/* Section: Display & UI */}
                    <section className="glass-card space-y-6">
                        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <Monitor className="w-5 h-5 text-primary" /> Appearance
                        </h2>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Theme Mode</Label>
                                <p className="text-[10px] text-muted-foreground">Switch between dark and light system aesthetics.</p>
                            </div>
                            <div className="flex bg-accent/30 rounded-lg p-1">
                                <button
                                    onClick={() => setTheme('light')}
                                    className={`p-2 rounded-md transition-all ${theme === 'light' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                                    title="Light Mode"
                                >
                                    <Sun className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`p-2 rounded-md transition-all ${theme === 'dark' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                                    title="Dark Mode"
                                >
                                    <Moon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Section: Simulation & AI */}
                    <section className="glass-card space-y-6">
                        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <Brain className="w-5 h-5 text-primary" /> Grid Intelligence
                        </h2>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="auto-opt">Autonomous Optimization</Label>
                                    <p className="text-[10px] text-muted-foreground">Allow AI to apply load balancing without manual confirmation.</p>
                                </div>
                                <Switch id="auto-opt" checked={autoOptimize} onCheckedChange={setAutoOptimize} />
                            </div>

                            <Separator className="bg-border" />

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="refresh-slider">Data Refresh Speed</Label>
                                    <span className="text-xs font-mono text-primary font-bold">{refreshRate}s</span>
                                </div>
                                <input
                                    id="refresh-slider"
                                    type="range"
                                    min="0.5"
                                    max="5"
                                    step="0.1"
                                    title="Telemetry Refresh Rate"
                                    value={refreshRate}
                                    onChange={(e) => setRefreshRate(parseFloat(e.target.value))}
                                    className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] text-muted-foreground">
                                    <span>Fast (0.5s)</span>
                                    <span>Slow (5s)</span>
                                </div>
                            </div>

                            <Separator className="bg-border" />

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="sensitivity-slider">AI Model Sensitivity</Label>
                                    <span className="text-xs font-mono text-primary font-bold">{aiSensitivity}%</span>
                                </div>
                                <input
                                    id="sensitivity-slider"
                                    type="range"
                                    min="1"
                                    max="100"
                                    step="1"
                                    title="AI Model Sensitivity"
                                    value={aiSensitivity}
                                    onChange={(e) => setAiSensitivity(parseInt(e.target.value))}
                                    className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] text-muted-foreground">
                                    <span>Conservative</span>
                                    <span>Aggressive</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section: Notifications */}
                    <section className="glass-card space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <Bell className="w-5 h-5 text-primary" /> Security Alerts
                            </h2>
                            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                        </div>
                        <div className={`space-y-4 transition-opacity duration-300 ${notificationsEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                            {[
                                { id: 'fault', label: 'Critical Fault Alerts', desc: 'Notify immediately on grid-wide failure probability > 30%.' },
                                { id: 'theft', label: 'Theft Risk Detection', desc: 'Alert when AI flags unauthorized energy shunting.' },
                                { id: 'spike', label: 'Load Spikes', desc: 'Daily summary of unexpected demand surges.' },
                            ].map((item, i) => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor={`notif-${item.id}`} className="text-sm font-bold text-foreground cursor-pointer">{item.label}</Label>
                                        <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                                    </div>
                                    <Switch id={`notif-${item.id}`} defaultChecked={i < 2} />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <Button variant="ghost" className="font-bold text-xs uppercase tracking-widest px-6 h-11">Discard</Button>
                        <Button onClick={handleSave} className="bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest px-8 h-11 shadow-lg shadow-primary/20">Save Configuration</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

